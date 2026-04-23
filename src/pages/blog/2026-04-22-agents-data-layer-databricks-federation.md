---
templateKey: blog-post
title: "The Data Layer Is Where Agents Earn Their Keep. Here's How to Let Them In Safely."
date: 2026-04-22T00:00:00.000Z
author: Nick Gamb
description: "AI agents need the warehouse to be useful. Security teams don't want forty agents holding warehouse credentials. Federated token brokering between the Maverics AI Identity Gateway and Databricks account-wide token federation resolves both — and the same pattern applies to Snowflake."
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

Every agentic AI pitch deck has a slide where the agents query the data warehouse. That's where the business value sits — the invoices, the customer records, the forecast models, the claims history. Every agentic AI security review has a different slide, the one where the CISO asks who's giving forty autonomous processes a warehouse credential. That gap is where most agent programs stall. For the teams running on Databricks, there's now a practical way through it. For the ones on Snowflake, the same pattern applies.

## The Shared-Credential Trap

When a team has agents on one side and a warehouse on the other, the shortest line between them is a shared secret. Someone spins up a service account. Someone generates a personal access token and drops it into an environment variable. Someone widens a network ACL because building per-user controls felt like a six-week project nobody budgeted for.

This works. For a while. Then the query logs get audited and every write came from `svc_agent_prod_01`. Then an agent ships with a prompt injection vulnerability and that same token is suddenly doing work nobody authorized. Then the compliance team asks for role-based access reviews and you realize there are no roles — just the one account that can do everything.

The problem isn't any single shortcut. The shortcuts accumulate. Each one moves the identity of the real person one step further from the query running on their behalf. By the time a real incident shows up, you can't reconstruct who did what. The audit trail is a dead end. And the team that built the agents takes the blame for a security architecture they were never asked to design.

## What Account-Wide Token Federation Changes

Databricks shipped a piece of this puzzle called [account-wide token federation](https://docs.databricks.com/aws/en/dev-tools/auth/oauth-federation-policy#account-wide-token-federation). The mechanic is direct: you tell your Databricks account to trust a specific JWT issuer, identified by an issuer URL, an audience value, and a subject claim. From that point on, any JWT signed by that issuer with the right claims exchanges at the Databricks token endpoint for a Databricks-native OAuth access token. The account never stores a credential for the caller. The warehouse never sees a password. Your identity provider becomes the decision point for who gets in.

That flips the access model. Instead of provisioning warehouse credentials to every system that needs data, you provision trust to one issuer and let the IdP do the rest. When someone joins, their IdP account is the only thing that changes. When they leave, one deprovision removes warehouse access. Role changes, permission reviews, MFA requirements — all of it stays in the tool your identity team already runs.

Snowflake supports the same general shape through its own external OAuth and token exchange flows. The specific configuration differs. The architecture is the same: the data platform trusts an issuer, the issuer signs JWTs for its users, and a standards-based exchange returns a native token. One pattern, many targets.

## Where the Maverics AI Identity Gateway Fits

The piece Databricks' federation expects — a trusted issuer signing JWTs with a verified user's identity — is what the [Maverics AI Identity Gateway](https://docs.strata.io/reference/orchestrator/experimental/token-brokering#federated-exchange) is built to be. Its Federated Exchange flow implements [RFC 8693](https://datatracker.ietf.org/doc/html/rfc8693), the IETF standard for OAuth 2.0 token exchange, and mints short-lived JWTs targeted at services configured to trust it.

The sequence, end to end:

1. An agent needs to run a query. The gateway first checks who's driving the agent by verifying a token issued through the customer's own IdP — Okta, Entra, Keycloak, whichever is in front.
2. The gateway mints a short-lived JWT. The `sub` claim is the human. An `act` claim identifies the agent as the acting party, per the RFC 8693 delegation pattern.
3. The gateway exchanges that JWT at the Databricks token endpoint per the federation policy on the account.
4. Databricks returns a short-lived OAuth access token that identifies the user. Unity Catalog applies her existing permissions when the query runs.
5. The query runs against Databricks under the user's identity. Databricks logs it. The gateway's audit log holds the full delegation chain — user, agent, tool call, time.

Two properties matter to a CISO reading this flow:

- **The acting party is carried through.** Databricks logs the user who initiated the query. The gateway log adds the agent that acted on her behalf. Put the two together and you get a delegation chain an incident responder can actually follow, instead of a shared service account.
- **The agent holds nothing sensitive.** The gateway holds its signing key. The agent holds a short-lived access token good only for MCP tool calls at the gateway — never direct API access to the warehouse. There is no warehouse secret to steal from an agent container, which changes the threat model for prompt injection and supply-chain compromise.

![Token flow: human, agent, Maverics AI Identity Gateway, Databricks account-wide token federation](/img/blog/databricks-federation-flow.svg)

## What's on the Wire

The JWT the gateway presents to Databricks looks like this:

```json
{
  "iss": "https://gateway.acme.com/",
  "sub": "alice@acme.com",
  "aud": "databricks",
  "act": { "sub": "ai-analyst-agent" },
  "iat": 1776859200,
  "exp": 1776859260
}
```

`iss` is the gateway — the issuer the Databricks federation policy trusts. `sub` is Alice, the human driving this agent. `act` declares that `ai-analyst-agent` is acting on her behalf, per the RFC 8693 delegation model. `aud` matches the audience in the federation policy. `iat` and `exp` bound the token to a sixty-second window — long enough for one exchange, short enough that leakage is a non-event.

If the token leaks, the blast radius is the distance between the agent and the clock. Nothing long-lived was exposed. Nothing that can be replayed tomorrow morning.

## The Delegation Chain Is the Whole Point

Without the `act` claim, the gateway could still mint a JWT that Databricks accepts. The warehouse would see a user identity, the query would run, and the audit log would be more useful than a shared service account. That's better. What it misses is the actor.

The `act` claim is what the gateway logs for every exchange, and it's the part a compliance reviewer cares about. It says: this query was initiated by Alice, but the actor on the wire is an agent she authorized. That distinction matters when something goes wrong. If an agent misbehaves at three in the morning, the gateway log tells you which human's credentials an attacker would need to compromise, and which agent identity to disable in parallel. If an agent gets compromised through a prompt injection, you can suspend the agent without suspending the human.

This is the shape of delegated authority in mature enterprise identity systems. AWS IAM role assumption does it. Kubernetes impersonation does it. The difference with agents is that the acting party is software deciding what to do in real time, so a short TTL and tight audience restrictions matter more. RFC 8693 token exchange carries all three properties — identity, actor, attenuation — in a single standards-defined claim set.

## Why This Matters at the Top

Five outcomes worth naming on a CISO or CIO slide:

- **One revocation point.** Disable the user in the IdP and their agents lose warehouse access the same minute. No warehouse-side cleanup. No hunting for stale PATs in agent config.
- **Every query attributable.** Databricks query history ties to the real user. The gateway audit log ties the specific agent and tool call to that same user. Compliance reviews get shorter. Incident forensics gets faster.
- **Least privilege by default.** The human's Unity Catalog permissions are the ceiling. An agent cannot exceed what the person driving it is allowed to see. Role-based access control you already designed applies to agents without a second system to maintain.
- **No credential sprawl.** Agents don't hold warehouse tokens. Rotating a PAT across forty agents stops being a recurring fire drill because there's nothing to rotate.
- **Pattern reuse.** The gateway speaks RFC 8693 to Databricks, to Snowflake's OAuth federation, to Google Cloud's Security Token Service, and to any target that accepts OAuth 2.0 token exchange. You implement federation once and apply it across the data estate.

Senior leaders don't need the protocol details on that slide. They need the shape of the risk posture change: the same identity system protecting employees now protects agent access, audit evidence becomes a byproduct rather than a project, and adding the next data platform doesn't restart the conversation.

## What's Shipping and What's Next

Federated Exchange is in the Maverics Orchestrator today, with documented support for Databricks Workload Identity Federation and Google Cloud's workload identity federation. We recently extended it to Databricks account-wide token federation in a proof of concept with a Fortune 100 financial services customer. The pattern worked end to end: their users logged into Databricks through their own IdP, the gateway brokered each agent query as that user, and every query carried the human on the audit line. The customer came away more confident about SaaS interoperability than they started.

The turnkey Databricks connector — the one that ships with a form, a policy template, and documentation — is planned for the Maverics product over the next few weeks. Customers who want to shape that design while the POC is still wet are the ones to talk to now.

## The Short Version

Agents without data access are a chat toy. Agents with unfederated data access are a pending incident. Token federation is the way past that binary. The data platform trusts your IdP. The gateway signs short-lived JWTs that carry the human on the line. Databricks and Snowflake both support the pattern. The Maverics AI Identity Gateway makes it consistent across them. Your agents get useful. Your audit log stays honest. Your incident-response team keeps sleeping through the night.

That's the data layer story — and it's one senior leaders can finally approve.

## Further Reading

- [Strata Federated Token Brokering — Federated Exchange](https://docs.strata.io/reference/orchestrator/experimental/token-brokering#federated-exchange)
- [Databricks Account-Wide Token Federation](https://docs.databricks.com/aws/en/dev-tools/auth/oauth-federation-policy#account-wide-token-federation)
- [Your MCP Server Is a Resource Server Now. Act Like It.](/blog/agentic-identity/your-mcp-server-is-a-resource-server-now-act-like-it/) — the tool-layer counterpart to the data-layer pattern in this post.
