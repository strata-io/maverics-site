---
templateKey: blog-post
title: "Plug AWS Bedrock Into Your Identity Layer. Same Gateway. Different Agent."
date: 2026-04-25T00:00:00.000Z
author: Nick Gamb
description: "AWS Bedrock AgentCore is a first-class MCP client. The Maverics AI Identity Gateway it connects to is the same one Claude Code connected to in the prior post. This one walks the wire and the AWS setup."
featuredpost: true
featuredimage: /img/blog/connect-bedrock-hero.png
category: Agentic Identity
tags:
  - Agentic Identity
  - MCP
  - OAuth
  - AWS Bedrock
  - Identity Gateway
---

A year ago Anthropic's MCP spec was a curiosity. Today it is the default integration surface for agent tools. The 2025-03-26 spec revision made every MCP server a formal OAuth 2.0 Resource Server. AWS shipped Bedrock AgentCore at re:Invent 2025 with native MCP client support and added stateful MCP features in March 2026. LangChain, the OpenAI Agents SDK, Google Vertex, and Anthropic's own API all consume MCP servers the same way. The agent client is becoming a commodity. Identity is the part that has to hold up.

This post wires an AWS Bedrock AgentCore agent to the same Maverics AI Identity Gateway that connected to Claude Code in [the prior post](/blog/agentic-identity/your-mcp-server-is-a-resource-server-now-act-like-it/). Different agent, same gateway. The companion repo is fully configured and ready to clone.

## What Changed in the Agent Ecosystem

Three things lined up over the last twelve months that make this story straightforward.

First, the MCP spec settled the auth question. As of the 2025-03-26 revision, an MCP server publishes Protected Resource Metadata at `/.well-known/oauth-protected-resource` per [RFC 9728](https://datatracker.ietf.org/doc/html/rfc9728). Clients fetch the metadata, learn which authorization servers issue tokens for the resource, run a standard OAuth 2.0 flow, and present a bearer token on every MCP request. No bespoke handshake. No vendor SDK. Standard OAuth.

Second, AWS shipped [Bedrock AgentCore Gateway](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-target-MCPservers.html) with native MCP client support. AgentCore Gateway speaks MCP over Streamable HTTP (SSE was deprecated in May 2025), fetches Protected Resource Metadata, and supports three auth flows out of the box: 3LO Authorization Code with PKCE, 2LO Client Credentials, and IAM SigV4 for AWS-native services. Agents created on AgentCore can attach an MCP server target with a few CLI calls.

Third, the rest of the ecosystem followed. The OpenAI Agents SDK supports MCP. LangChain has `langchain-mcp-adapters`. Google Vertex announced MCP support. Anthropic's API attaches MCP servers directly. The agent does not define the security model. The resource server and the authorization server do.

That last point is the one that pays off. If the security boundary is the gateway in front of MCP traffic, swapping agent ecosystems is a config change, not an architecture change.

## What an Identity-Governed Agent Looks Like

The prior post walked through the topology in detail. The short version, since it does not change here:

- An **Identity Gateway** sits in front of every MCP server. It enforces inbound authorization policy (who can call which tool with which scopes) and forwards allowed calls to the upstream MCP backend.
- An **Authorization Server** issues tokens. For inbound calls the gateway verifies the user's access token. For outbound calls to backends the gateway exchanges that user token for a delegation token via [RFC 8693](https://datatracker.ietf.org/doc/html/rfc8693), with the user as `sub` and the agent as the `act` claim.
- A **policy engine** (OPA in our lab) is the per-tool authorization control point. Policies live in Rego files in a git repo. Pull requests, code review, audit by diff.
- **Per-tool delegation tokens with short TTLs.** A leaked token is exposure for one operation on one backend for five seconds.

This pattern was originally written up around Claude Code. Nothing about it is Claude-specific. The gateway sees an OAuth bearer token and an MCP request, whatever produced that request. The companion repo we forked from already implements all of it.

## Same Gateway, Different Agent

The exact Maverics setup from the prior tutorial works for AgentCore with two changes:

1. **Add a new OAuth client.** Claude Code is a public client using PKCE because a CLI cannot keep a secret. AgentCore is a confidential client. It holds a `client_id` plus a `client_secret` (3LO) or uses Client Credentials with no end user (2LO). We register a new `bedrock-agentcore` OIDC app in the Maverics OIDC Provider with both grant types enabled and scopes that match the tools the agent should be able to call.
2. **Reach Maverics from the public internet.** AgentCore runs in AWS. The lab runs on `localhost`. We expose the gateway and the OIDC Provider over HTTPS via [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/). One `cloudflared` process on the same machine as the lab. Two public hostnames. Free tier.

Everything downstream is unchanged. The Enterprise Ledger MCP server, the Employee Directory MCP bridge, the OPA policies, the token exchange topology, the audit log shape. The gateway was built to validate bearer tokens against an authorization server and run OPA policies on every tool call. It does not care which agent client produced the call.

AgentCore discovers the auth surface on its own. When you register the MCP target, AgentCore fetches the gateway's `/.well-known/oauth-protected-resource` document. Maverics serves that document with the public well-known URL of its OIDC Provider. AgentCore reads it, finds the authorization server, and runs the configured OAuth flow against `auth.<your-domain>` over the tunnel. No hardcoded endpoints in AgentCore. The metadata wires the trust.

That is what putting an Identity Gateway in front of MCP traffic earns you. Adopting a new agent ecosystem becomes a config change, not a rebuild.

![AWS Bedrock AgentCore connected to the Maverics AI Identity Gateway via Cloudflare Tunnel](/img/blog/connect-bedrock-architecture.svg)

## Setting Up AWS

The companion repo's README walks through the steps with exact commands. The shape of the setup:

1. **Create an AWS account.** Sign up at [aws.amazon.com](https://aws.amazon.com). New accounts get $200 in starter credits across the first months. A payment method is required even with credits.
2. **Pick a region.** Bedrock AgentCore is GA in eight regions (us-east-1, us-west-2, ap-south-1, ap-southeast-1, ap-southeast-2, ap-northeast-1, eu-central-1, eu-west-1). The tutorial uses `us-east-1` for the broadest model availability.
3. **Create an IAM identity** with a least-privilege policy covering `bedrock-agentcore:*`, `bedrock:InvokeModel*`, `secretsmanager:CreateSecret` and `GetSecretValue` on the `bedrock-agentcore-*` prefix, and `iam:PassRole` for the gateway's execution role.
4. **Configure the AWS CLI.** `aws configure` with the IAM identity's keys.
5. **Request model access.** Bedrock console, Model access, Anthropic, Claude 3.5 Sonnet v2. Approval is usually instant.
6. **Run a Cloudflare Tunnel.** AgentCore needs to reach the OIDC Provider and the gateway over public HTTPS. Sign up for a free Cloudflare account if you do not already have one. Run `cloudflared tunnel login`, then `cloudflared tunnel create maverics-lab`. The tutorial ships a `cloudflared/config.yml` template that maps `auth.<your-domain>` and `gateway.<your-domain>` to the local Envoy ports. `make tunnel` brings it up.

Cost notes worth setting on the table early. Claude 3.5 Sonnet on Bedrock is around $3 per million input tokens and $15 per million output tokens. A short demo session of a hundred tool calls is well under a dollar. AgentCore agents do internal LLM calls for planning, so a single user prompt can spawn five or more model invocations. Budget conservatively. The teardown script in the tutorial cleans up the gateway and the agent so you stop paying for them when you are done.

## The 3LO Path: Carry the User Through

The default path in the tutorial is 3LO Authorization Code with PKCE. The user identity flows through the agent, into the gateway, and onto the audit line. End to end:

1. **Initial consent (one-time admin step).** During `aws bedrock-agentcore-control create-gateway-target` with `OAUTH2_AUTHORIZATION_CODE`, AgentCore opens a browser for the admin to complete OAuth consent against Maverics. Maverics federates to Keycloak, the admin signs in as a privileged user, scopes are granted, and AgentCore caches the resulting tokens.
2. **A user prompts the agent.** AgentCore presents the user-scoped access token (issued by Maverics) to the gateway on the MCP tool call.
3. **Inbound authorization.** The gateway validates the token signature and audience, then runs the OPA inbound policy for the requested tool. If the policy denies, the agent receives a structured error and reports it back to the user.
4. **Outbound delegation.** On allow, the gateway calls the Maverics Authorization Server for an RFC 8693 token exchange. The Authorization Server mints a delegation JWT with `sub` set to the user, `act.sub` set to the AgentCore agent identity, scope set to the per-tool scope, and TTL set to five seconds.
5. **Backend call.** The gateway forwards the original tool request to the backend with the delegation JWT in the `Authorization` header. The backend logs the user identity. Maverics records the full delegation chain in its audit log.

In Maverics' audit log you should see one record per exchange with the user as `sub`, the AgentCore agent identity (the gateway target's principal) as `act.sub`, the requested per-tool scope, the issued JWT's `jti`, and the TTL. The Enterprise Ledger and Employee Directory backends log the corresponding tool call under that same user. Two systems, one delegation chain, no shared service account anywhere in the picture.

The result is the same delegation chain we built for Claude Code. The agent client changed. The identity and authorization story did not.

## Sidebar: 2LO for Service-to-Service Work

Some agent workloads do not have an end user. Scheduled background tasks, ETL-style data movement, internal automation. For those cases the tutorial includes a second setup script that registers an alternate AgentCore Gateway target with `OAUTH2_CLIENT_CREDENTIALS`. The agent authenticates as itself.

The trade-off is explicit. There is no `sub` claim representing a human, so the audit log shows the agent's service identity as the actor. The delegation chain shrinks to one party. Use 2LO when there genuinely is no user driving the request. When there is a user, default to 3LO so that user identity reaches the data and the audit log.

The companion repo includes both setups. Pick the one that matches the workload.

## The Next Agent Ecosystem Plugs in the Same Way

The interesting move is not "AgentCore connected to Maverics." The interesting move is that nothing about Maverics had to change to make it happen. The MCP server already published Protected Resource Metadata. The Authorization Server already supported the OAuth flows AgentCore uses. The OPA policies and backend services are untouched.

Bring up an OpenAI Agents SDK runtime tomorrow. Or a LangChain workflow. Or an internal agent framework you wrote in-house. They all want an MCP server with an OAuth-protected endpoint. The gateway has been waiting for them. You add a new OAuth client to the OIDC Provider and run the appropriate flow.

A future post will cover Bedrock at the data layer. The pattern repeats. Different audience value on the JWT, same broker doing the work.

## Get the Tutorial

The companion repository has the full lab. Clone it, run `make init && make up`, start `cloudflared` for the public hostnames, and follow the README to wire up AgentCore. The README walks through AWS account setup for readers without an existing account, model access for Claude 3.5 Sonnet on Bedrock, Cloudflare Tunnel configuration, and the AgentCore CLI calls that build the gateway and the agent.

```
git clone <repo-url>
cd connect-bedrock-to-maverics
make init && make up
make tunnel       # in another terminal
bash scripts/agentcore-setup.sh
```

The repo URL goes here once the project is published.

## Further Reading

- [Your MCP Server Is a Resource Server Now. Act Like It.](/blog/agentic-identity/your-mcp-server-is-a-resource-server-now-act-like-it/). The prior post in this series.
- [Strata MCP Provider documentation](https://docs.strata.io/reference/orchestrator/applications/mcp-provider).
- [Strata Token Brokering (experimental)](https://docs.strata.io/reference/orchestrator/experimental/token-brokering).
- [AWS Bedrock AgentCore Gateway: MCP server targets](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-target-MCPservers.html).
- [AWS Bedrock AgentCore Gateway: OAuth authentication](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-oauth.html).
- [MCP specification: Authorization](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization).
- [RFC 9728: OAuth 2.0 Protected Resource Metadata](https://datatracker.ietf.org/doc/html/rfc9728).
