---
templateKey: blog-post
title: "The Data Layer Is Where Agents Earn Their Keep. Here's How to Let Them In Safely."
date: 2026-04-22T00:00:00.000Z
author: Nick Gamb
description: "AI agents need the warehouse to be useful. Security teams don't want forty agents holding warehouse credentials. Federated token brokering between the Maverics AI Identity Gateway and Databricks account-wide token federation puts the human on every query's audit line."
featuredpost: true
featuredimage: /img/blog/databricks-federation-hero.png
category: Agentic Identity
tags:
  - Agentic Identity
  - Token Brokering
  - Databricks
  - Data Platforms
  - Identity Gateway
---

Every agentic AI pitch deck has a slide where agents query the data warehouse. That's where the business value sits: invoices, customer records, forecast models, claims history. Every agentic AI security review has a different slide, the one where the CISO asks who's giving forty autonomous processes a warehouse credential. That gap is where most agent programs stall. For teams running on Databricks, there's now a practical way through it.

## The SaaS Interoperability Problem

Corporate identity stopped being about logging into your own apps a long time ago. Most of what employees touch lives in someone else's SaaS: Databricks, Snowflake, Salesforce, ServiceNow, pick the category. Getting the IdP you run internally (Okta, Entra, Ping) to govern access to those third-party systems has always been harder than the marketing suggests. SAML gave you sign-on. SCIM gave you user lifecycle. Neither gives you the live, claims-bound, short-lived tokens an agent needs on every tool call.

The identity community has seen this coming. The emerging [Cross-App Access (XAA)](https://oauth.net/cross-app-access/) spec, built on the Identity Assertion JWT Authorization Grant at the IETF, is an industry attempt to solve it at the protocol level. It lets the enterprise IdP mediate every app-to-app and agent-to-app call so identity and authorization travel with the request. XAA showed up as one of the first authorization extensions in the 2025-11-25 MCP spec revision. The direction is clear.

Databricks didn't wait. Its account-wide token federation is a working Security Token Service: an RFC 8693 endpoint that accepts a JWT from any issuer the account trusts and returns a Databricks-native OAuth token. It is a concrete, shipping piece of the SaaS interop story for data platforms, built on a standard already present in every mainstream OAuth library. As far as we've seen, no other major data platform ships this specific piece of the puzzle.

## The Shared-Credential Trap

When a team has agents on one side and a warehouse on the other, the shortest line between them is a shared secret. Someone spins up a service account. Someone generates a personal access token and drops it into an environment variable. Someone widens a network ACL because building per-user controls felt like a six-week project nobody budgeted for.

This works. For a while. Then the query logs get audited and every write came from `svc_agent_prod_01`. Then an agent ships with a prompt injection vulnerability and that same token is suddenly doing work nobody authorized. Then the compliance team asks for role-based access reviews and you realize there are no roles, just the one account that can do everything.

The problem isn't any single shortcut. The shortcuts accumulate. Each one moves the identity of the real person one step further from the query running on their behalf. By the time a real incident shows up, you can't reconstruct who did what. The audit trail is a dead end. And the team that built the agents takes the blame for a security architecture they were never asked to design.

## What Account-Wide Token Federation Changes

Databricks shipped a piece of this puzzle called [account-wide token federation](https://docs.databricks.com/aws/en/dev-tools/auth/oauth-federation-policy#account-wide-token-federation). The mechanic is direct: you tell your Databricks account to trust a specific JWT issuer, identified by an issuer URL, an audience value, and a subject claim. From that point on, any JWT signed by that issuer with the right claims exchanges at the Databricks token endpoint for a Databricks-native OAuth access token. The account never stores a credential for the caller. The warehouse never sees a password. Your identity provider becomes the decision point for who gets in.

That flips the access model. Instead of provisioning warehouse credentials to every system that needs data, you provision trust to one issuer and let the IdP do the rest. When someone joins, their IdP account is the only thing that changes. When they leave, one deprovision removes warehouse access. Role changes, permission reviews, MFA requirements all stay in the tool your identity team already runs.

Snowflake gets to the same end state through a different mechanism. Snowflake's External OAuth accepts an IdP-issued JWT directly as its access token, with no platform-side exchange step. The Maverics gateway can broker either shape, but Databricks' STS endpoint is distinctive, and it's what the rest of this post focuses on.

## Where the Maverics AI Identity Gateway Fits

Two components inside the Maverics AI Identity Gateway product do the work. The **gateway** sits in front of MCP traffic. It enforces inbound authorization policy, maps tools to upstream services, and forwards allowed calls. The **Maverics Authorization Server** sits behind it as the token issuer. The AS is the trusted party Databricks' federation policy accepts, and it's what implements [Strata's Federated Exchange](https://docs.strata.io/reference/orchestrator/experimental/token-brokering#federated-exchange) flow, built on [RFC 8693](https://datatracker.ietf.org/doc/html/rfc8693) token exchange for brokering into third-party SaaS.

The sequence, end to end:

1. An agent sends an MCP tool request to the gateway, carrying the user's access token. (The user signed in earlier through the corporate IdP, whether Okta, Entra, or Keycloak, and the Maverics Authorization Server issued the access token the agent now holds.)
2. The gateway evaluates its inbound authorization policy for the tool being called. On pass, it asks the Authorization Server for a Databricks-bound token via RFC 8693 exchange with `audience = https://databricks.com`.
3. The Authorization Server evaluates its token brokering policy, maps scopes and claims, and mints a short-lived JWT with the user as `sub`, the agent as the `act`, and the Databricks audience.
4. The Authorization Server performs a second RFC 8693 exchange against the Databricks Authorization Server. Databricks validates the JWT against its federation policy and returns a Databricks-native OAuth access token for that user.
5. The Databricks token flows back through the Authorization Server to the gateway. The gateway forwards the original tool request to Databricks MCP with the Databricks token on the wire.
6. Databricks MCP runs the request and logs it under the user's identity. Unity Catalog applies the user's existing permissions. The Maverics audit log preserves the full delegation chain: user, agent, tool call, time.

Two properties stand out:

- **The acting party is carried through.** Databricks logs the user who initiated the query. The Maverics Authorization Server records the agent as the acting party on each exchange. Put the two together and you get a delegation chain an incident responder can follow, instead of a shared service account.
- **The agent holds nothing sensitive.** The Authorization Server holds the signing key for the federation JWT. The agent holds a short-lived access token good only for MCP tool calls at the gateway, not direct API access to the warehouse. There is no warehouse secret to steal from an agent container, which changes the threat model for prompt injection and supply-chain compromise.

![Token flow: Agent → Maverics Gateway → Maverics Authorization Server → Databricks Authorization Server → Databricks MCP](/img/blog/databricks-federation-flow.svg)

## What's on the Wire

The JWT the Maverics Authorization Server presents to the Databricks Authorization Server looks like this:

```json
{
  "iss": "https://auth.acme.com/",
  "sub": "alice@acme.com",
  "aud": "https://databricks.com",
  "act": { "sub": "ai-analyst-agent" },
  "iat": 1776859200,
  "exp": 1776859260
}
```

`iss` is the Maverics Authorization Server, the issuer the Databricks federation policy trusts. `sub` is Alice, the human driving this agent. `act` declares that `ai-analyst-agent` is acting on her behalf, per the RFC 8693 delegation model. `aud` matches the audience in the Databricks federation policy. `iat` and `exp` bound the token to a sixty-second window: long enough for one exchange, short enough that leakage is a non-event.

If the token leaks, the blast radius is the distance between the agent and the clock. Nothing long-lived was exposed. Nothing that can be replayed tomorrow morning.

## Why the `act` Claim Matters

Without the `act` claim, the Authorization Server could still mint a JWT that Databricks accepts. The warehouse would see a user identity, the query would run, and the audit log would be more useful than a shared service account. Better, but incomplete. What it misses is the actor.

The `act` claim is what the Maverics Authorization Server records for every exchange, and it's the part a compliance reviewer cares about. It says the query was initiated by Alice, but the actor on the wire is an agent she authorized. That distinction matters when something goes wrong. If an agent misbehaves at three in the morning, the Maverics audit log tells you which human's credentials an attacker would need to compromise, and which agent identity to disable in parallel. If an agent gets compromised through a prompt injection, you can suspend the agent without suspending the human.

This is how delegated authority works in mature enterprise identity systems. AWS IAM role assumption does it. Kubernetes impersonation does it. The difference with agents is that the acting party is software deciding what to do in real time, so a short TTL and tight audience restrictions matter more. RFC 8693 token exchange carries all three properties (identity, actor, attenuation) in a single standards-defined claim set.

## What Changes

Five things change the day this pattern goes live:

- **One revocation point.** Disable the user in the IdP and their agents lose warehouse access the same minute. No warehouse-side cleanup. No hunting for stale PATs in agent config.
- **Every query attributable.** Databricks query history ties to the real user. The Maverics audit log ties the specific agent and tool call to that same user. Compliance reviews get shorter. Incident forensics gets faster.
- **Least privilege by default.** The human's Unity Catalog permissions are the ceiling. An agent cannot exceed what the person driving it is allowed to see. Role-based access control you already designed applies to agents without a second system to maintain.
- **No credential sprawl.** Agents don't hold warehouse tokens. Rotating a PAT across forty agents stops being a recurring fire drill because there's nothing to rotate.
- **Pattern reuse.** The Maverics Authorization Server mints JWTs for Google Cloud's Security Token Service via RFC 8693, and for Snowflake's External OAuth flow even though the mechanism on the platform side is different. You implement federation once in Strata and apply it across the data estate.

The identity system you already run for employees now runs for your agents. Audit evidence comes along for the ride. Adding the next data platform doesn't restart the conversation.

## The Short Version

Agents without data access are a chat toy. Agents with unfederated data access are a pending incident. Token federation is the way past that binary. The data platform trusts your IdP. The Maverics Authorization Server signs short-lived JWTs that carry the human on the line. Databricks already ships the STS endpoint that closes the loop. Your agents get useful. Your audit log stays honest. Your incident-response team keeps sleeping through the night.

This is the data layer story you can take into a security review without flinching.

## Further Reading

- [Strata Federated Token Brokering: Federated Exchange](https://docs.strata.io/reference/orchestrator/experimental/token-brokering#federated-exchange)
- [Databricks Account-Wide Token Federation](https://docs.databricks.com/aws/en/dev-tools/auth/oauth-federation-policy#account-wide-token-federation)
- [Your MCP Server Is a Resource Server Now. Act Like It.](/blog/agentic-identity/your-mcp-server-is-a-resource-server-now-act-like-it/). The tool-layer counterpart to the data-layer pattern in this post.
