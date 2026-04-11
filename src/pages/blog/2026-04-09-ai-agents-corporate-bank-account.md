---
templateKey: blog-post
title: "I Gave 4 AI Agents a Corporate Bank Account. Here's How I Stopped Them From Draining It."
date: 2026-04-09T00:00:00.000Z
author: Sawyer Pence
description: "A technical build log of the Multi-Agent Control Room, where AI agents pay invoices, escalate denials, and every action is identity-governed through OPA policies, RFC 8693 delegation tokens, and the Maverics AI Identity Gateway."
featuredpost: true
featuredimage: /img/blog/bank-account-hero.png
category: Agentic Identity
tags:
  - Agentic Identity
  - MCP
  - OPA
  - OAuth
  - Delegation
---

A technical build log of the Multi-Agent Control Room, where AI agents pay invoices, escalate denials, and every action is identity-governed through OPA policies, RFC 8693 delegation tokens, and the Maverics AI Identity Gateway.

**Four AI agents share a corporate bank account** with spending limits from $0 to $500K, enforced by OPA Rego policies evaluated on every MCP tool call through the Maverics AI Identity Gateway. No prompt engineering, no application-level checks. RFC 8693 delegation tokens fuse human and agent identity into a single JWT, making the human's role the authorization ceiling. The same agents produce different outcomes depending on who is logged in, with zero code changes. Agents connect to enterprise APIs exclusively through an identity gateway that translates REST to MCP tools, evaluates policy inline, and issues 5-second scoped tokens per tool call. Every decision is logged for audit. Denied agents automatically escalate work up an identity-governed org chain, creating emergent human-in-the-loop governance without explicitly programming that behavior.

If you've been following Clawdrey Hepburne's blog, you already know the problem. In her "Your Sub-Agents Are Running With Scissors" series, she lays it out with the kind of clarity only a lobster in a little black dress can muster: AI agents inherit credentials from their parents like a contractor walking around with a photocopied CEO badge. No scoped identity. No attenuation. No audit trail. Just ambient authority all the way down.

Clawdrey's work on OVID Mandates and Cedar-based policy engines tackles this from the agent's perspective. How agents should carry identity. How policies should be formally verifiable. How delegation should be mathematically provable as privilege-attenuating. She co-authors with her human, Sarah Cecchetti, co-founder of IDPro and former AWS engineer on the Cognito and Cedar teams.

Where Clawdrey asks "what should agents carry?", this post asks "what should the infrastructure enforce?" I took the problems Clawdrey identifies and built a working system that solves them. Four AI agents with a corporate bank account, governed by delegation tokens, OPA policies, and an identity gateway that enforces per-tool authorization on every single MCP call.

## What I Built

A browser-based "Control Room" where four AI agents run a fictional finance department for a company called Initech:

| Agent | Role | Can Spend | Key Tools |
|-------|------|-----------|-----------|
| Finance Clerk | Read-only bookkeeper | $0 | list_invoices, view_invoice |
| Finance Manager | Accounts payable | Up to $50K | + pay_invoice, approve_expense |
| Finance Director | Department head | Up to $250K | + pay_invoice, approve_expense |
| CFO | Top authority | Up to $500K | + pay_invoice, approve_expense |

Each agent runs in its own Docker container, connects to enterprise APIs through an identity gateway, and has its spending limits enforced by OPA policies on every single tool call. The clerk literally cannot spend a dollar. Not because I told it not to in the prompt, but because the gateway evaluates a Rego policy and rejects the request before it ever reaches the Finance API.

The fun part: a human can log in via Keycloak and their authority level becomes the ceiling for what every agent can do. Log in as a clerk? Even the CFO bot can't spend a cent. Log in as the actual CFO? Now it can process payments up to $500K. Same agents, same code, different human, different outcomes.

## The Stack

The stack: 4x GoClaw containers (~35MB RAM each), Maverics AI Identity Gateway, Maverics Auth (OIDC Provider), Keycloak (human authentication), Finance API (Express service), Messaging Service (in-memory), OPA (policy engine), Loki + Promtail + Grafana (audit), n8n (workflow automation), LLM Egress Proxy (nginx SNI allowlist), React Control Room (2x2 agent chat grid). That's ~20 containers, 4 isolated Docker networks, and a lot of YAML.

![Build Log: Project ClawControl — Multi-Agent AI Identity System architecture](/img/blog/bank-account-architecture.png)

## Part 1: Making Agents Talk to APIs Through an Identity Gateway

The core architectural decision: agents cannot reach enterprise APIs directly. They live on agent-net. The Finance API lives on enterprise-net. There's no route between them. The only path is through the Maverics AI Identity Gateway.

Agents connect to the gateway using MCP's streamable-http transport. Three things happen on every tool call:

1. OPA evaluates the request
2. If allowed, the gateway does an RFC 8693 token exchange for a 5-second scoped token
3. Forwards to the backend API with the scoped token

Gateway config:

```yaml
finance-api-bridge:
  type: mcpBridge
  openapi:
    spec:
      uri: file:///etc/maverics/openapi/finance-api.yaml
    baseURL: http://api-finance:3000
  authorization:
    inbound:
      opa:
        file: /etc/maverics/policies/finance-authz.rego
    outbound:
      type: tokenExchange
      tokenExchange:
        type: delegation
        idp: auth-provider
        audience: finance-api
        tools:
          - name: pay_invoice
            ttl: 5s
            scopes: [finance:write]
          - name: list_invoices
            ttl: 5s
            scopes: [finance:read]
```

## Part 2: The OPA Policies (Where It Gets Fun)

### RBAC: Who Can Do What

```rego
role_scopes := {
    "clerk":    {"finance:read"},
    "manager":  {"finance:read", "finance:write"},
    "director": {"finance:read", "finance:write"},
    "cfo":      {"finance:read", "finance:write"},
}
```

### Spending Thresholds: How Much Can They Spend

```rego
thresholds := {
    "manager":  50000,
    "director": 250000,
    "cfo":      500000,
}

threshold_deny contains msg if {
    input.tool == "pay_invoice"
    limit := thresholds[input.role]
    input.amount > limit
    msg := sprintf("Amount $%d exceeds %s limit of $%d", [input.amount, input.role, limit])
}
```

### Business Hours: When Can They Do It

```rego
business_hours_deny contains msg if {
    input.tool in write_tools
    not input.role in unrestricted_roles
    clock := time.clock(time.now_ns())
    hour := clock[0]
    not (hour >= 8; hour < 18)
    msg := "Write operations restricted to business hours (08:00-18:00 UTC)"
}
```

### Escalation Chain: Who Can Message Whom

```rego
escalation_allowed := {
    "clerk":    {"manager"},
    "manager":  {"clerk", "director"},
    "director": {"clerk", "manager", "cfo"},
    "cfo":      {"clerk", "manager", "director"},
}
```

## Part 3: Delegation Tokens and the "Authority Ceiling" Trick

When a human logs in via Keycloak, the backend does an RFC 8693 token exchange:

```json
{
  "sub": "alice@initech.com",
  "role": "clerk",
  "act": {
    "sub": "openclaw-manager",
    "role": "manager"
  },
  "token_type": "delegation"
}
```

The human's role is the authorization ceiling. Even though the manager bot natively has $50K spending authority, when Alice (clerk) is logged in, the token's role claim is clerk.

```javascript
if (humanRole != "") {
    claims["role"] = humanRole
}
act := map[string]interface{}{}
act["sub"] = agentSub
act["role"] = agentRole
claims["act"] = act
```

| Human | Agent | pay_invoice | Why |
|-------|-------|------------|-----|
| Alice (Clerk) | CFO Bot | DENIED | role=clerk, no finance:write |
| Bob (Manager) | CFO Bot ($45K) | ALLOWED | role=manager, $45K < $50K |
| Bob (Manager) | CFO Bot ($75K) | DENIED | role=manager, $75K > $50K |
| David (CFO) | CFO Bot ($75K) | ALLOWED | role=cfo, $75K < $500K |

## Part 4: The Token Lifecycle

The flow:

1. **Login:** Human authenticates via Keycloak (OIDC PKCE). Backend acquires agent CC token, does RFC 8693 exchange, PUTs delegation token onto each agent's MCP server.
2. **Every tool call:** Agent calls MCP tool → Gateway evaluates OPA → if allowed: exchanges delegation token for 5-second scoped token → scoped token sent to Finance API.
3. **Logout:** Backend clears delegation tokens, acquires fresh agent CC tokens.

## Part 5: Auto-Wake and the Escalation Loop

When an agent is denied, it queues the work by messaging the next role up the chain. Auto-wake polling checks inboxes every 5 seconds with a 15-second debounce. Agents read messages, process them, and reply. If also denied, they escalate further.

When a higher-authority human logs in later, the agents present the queued work and wait for approval. Human-in-the-loop governance that doesn't require the human to be present when work arrives.

## Part 6: The Activity Feed

The Control Room shows a live activity feed from two sources: instant relay events (milliseconds) and Loki audit events (10-30 seconds late, authoritative).

```text
[ALLOW] clerk list_invoices via finance-api                     11:42:01
[DENY]  clerk pay_invoice   No spending authority               11:42:03
[MSG]   clerk --> manager   "INV-001, $75K"                     11:42:04
[TOKEN] manager delegation  sub=bob@initech                     11:42:15
[ALLOW] manager pay_invoice via finance-api                     11:42:18
[MSG]   manager --> clerk   "Paid INV-001"                      11:42:20
```

## Part 7: Agent Security Hardening

- **Read-only containers.** Every agent runs with read_only: true, cap_drop: ALL, no-new-privileges: true.
- **LLM egress proxy.** Nginx SNI allowlist. Only api.groq.com and api.anthropic.com pass through.

```nginx
map $ssl_preread_server_name $backend {
    api.groq.com        api.groq.com:443;
    api.anthropic.com   api.anthropic.com:443;
    default             127.0.0.1:1;  # deny
}
```

- **Server-asserted roles.** Agent's role is signed into JWT by Maverics Auth.
- **Identity-anchored context.** Personality and operating instructions stored in PostgreSQL as immutable context files.

## What I Learned

1. **Identity is the right abstraction for AI agent governance.** Not prompt engineering, not application-level checks, not network rules.
2. **The gateway pattern works.** Agents don't know they're governed. APIs don't know they're called by agents.
3. **Per-tool token exchange is underrated.** Every tool call getting its own 5-second scoped token. Blast radius is effectively zero.
4. **Delegation tokens are the key insight.** Same agents behave differently depending on which human is driving. No code changes.
5. **Auto-wake + escalation creates emergent behavior.** I didn't explicitly program "if denied, escalate." The behavior emerged from the identity layer.

The full system runs via `docker compose up`. Built with GoClaw (agent runtime), Maverics (identity gateway + auth), OPA (policy engine), and Docker Compose.
