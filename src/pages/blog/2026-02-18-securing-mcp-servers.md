---
templateKey: blog-post
title: "Securing MCP Servers at Scale: How to Govern AI Agents with an Enterprise Identity Fabric"
date: 2026-02-18T12:00:00.000Z
author: Nick Gamb
description: "A developer downloads an MCP server from GitHub, runs it locally, connects it to their chat client — and just like that, an AI agent has access to production data with no authentication, no authorization, and no audit trail."
featuredpost: false
featuredimage: /img/blog/securing-mcp-hero.png
category: Agentic Identity
tags:
  - Agentic Identity
  - MCP
  - Identity Fabric
  - Security
---

## Introduction

Here's a scenario you've probably seen: A developer downloads a Model Context Protocol (MCP) server from GitHub, runs it locally, connects it to their chat client or agent workflow, authorizes with a Personal Access Token (PAT) that grants excessive permissions, and starts using it. It works great. Then another developer does the same thing. And another. Before you know it, you have hundreds--or thousands--of MCP servers running across your organization, each with its own set of credentials, no further authentication, no least-privilege authorization, and no way to govern them with your existing identity infrastructure.

This isn't hypothetical. Recent research from Clutch Security shows that in a typical 10,000-person organization:

- 15.28% of employees (1,528 people) are running an average of 2 MCP servers each--that's 3,056 total deployments
- 38% (1,161 servers) are unofficial implementations from unknown authors, often sourced from community packages on npm and GitHub repositories with anonymous authors

The security implications are severe:

- 86% of users deploy MCP servers locally with full privileges and direct filesystem access
- Credentials are stored in plaintext within .env files, JSON configurations, or environment variables
- Traditional security tools are often blind to these deployments
- There's no monitoring, no governance, and no way to connect these servers to enterprise identity systems

We're solving runaway MCP deployment. In this blog, we'll discuss how to connect disconnected, unsecured MCP servers to your enterprise identity infrastructure using Strata's Maverics AI Identity Gateway. Creating an identity fabric enables secure, governed AI operations across your entire stack. Whether your chat clients or agents are local or in the cloud, your models are on-prem or in the cloud, and your MCPs are running anywhere.

## How it works

MCP servers federate through the AI Identity Gateway using standard OAuth/OIDC protocols, just like any other application in your identity fabric. An administrator (or someone with appropriate permissions) can register the MCP server as an application manually in the Maverics Console, or, if Dynamic Client Registration (DCR) is enabled, the MCP server can self-register.

When a developer builds or installs an MCP server (for example, a Salesforce MCP), they configure it with OIDC settings pointing to the AI Identity Gateway as the issuer. When their chat client or agent workflow connects to that MCP server, the authentication flow routes through the AI Identity Gateway, which validates the user's identity against your enterprise IDP. When agents need to access protected resources--such as making tool calls to MCP servers--the AI Identity Gateway dynamically scopes permissions based on the specific tools and resources being accessed, enforcing least-privilege authorization policies that collapse the reachable state space, and creates an audit trail.

This means developers don't need to understand your IDP's specifics or manually configure complex identity credentials--they just point their MCP server to the AI Identity Gateway using standard OIDC configuration.

Your organization can choose how to manage MCP client registration based on governance needs:

**Manual registration** (shown in this tutorial): An administrator registers the MCP server as an application in the Maverics Console, then distributes the client ID and secret to developers. This provides full control over what gets registered and is ideal for organizations that need strict governance and approval workflows.

**Dynamic Client Registration (DCR)**: If enabled, developers can register their MCP server instances automatically using an initial registration token or through a self-service portal. The AI Identity Gateway can enforce policy-based approvals, allowing automatic registration while maintaining governance. This scales better for organizations with many developers and MCP deployments.

Regardless of the registration method, organizations don't need to discover or inventory every individual MCP deployment--once an MCP server is registered (manually by an administrator or via DCR), any instance configured to use the AI Identity Gateway automatically becomes part of your governed identity fabric, subject to the same policies and controls as your other applications.

> **Tip:** The registered MCP clients create the basis of an MCP registry--all MCPs registered in your organization. This registry provides a centralized view of all MCP servers, enabling better governance, monitoring, and management of your AI infrastructure. To detect rogue MCPs, audit resource access for unknown clients using PATs or tokens not minted by the gateway.

## What is an Agent?

Before we dive deeper into the solution, let's clarify what we mean by "agent"--a term that's often overloaded in today's AI landscape.

An **agent** is a software execution context that can select and sequence actions toward a goal, using tools, under some governing policy. This differs from a **workflow**, which is an execution context that follows a predefined action graph.

The key distinction: in AI agents, the planner is non-deterministic--the agent discovers its action plan at execution time based on intent, available tools, and the calls it makes. In workflows, the planner is deterministic--the sequence of actions is predetermined.

Both agents and workflows are execution contexts; neither is a principal. They don't have standing identities or permissions of their own. Instead, they execute under delegated identity--either that of the human who created them or a workload identity that the human is authorized to delegate.

**The security challenge with AI agents:** What changes with AI is that static permission design becomes a runtime problem. Traditional security models assume you can define permissions upfront based on a known action graph. But with AI agents, the action plan is discovered at execution time through the sequence: intent → tools → calls. You can't predict in advance which tools an agent will use or in what order, which means you can't pre-define a static permission set.

The real risk isn't a static permission set--it's the runtime's reachable state space. An agent with broad permissions could potentially access any resource within that permission set, in any sequence, creating an enormous attack surface.

**Ephemeral, task-scoped tokens collapse that state space when accessing protected resources.** Instead of granting an agent standing access to all possible resources it might need, the AI Identity Gateway mints tokens when the agent attempts to access protected resources (like MCP servers), scoped to the specific task and the specific tools required for that access. This approach minimizes blast radius: even if a token is compromised, it only grants access to the resources needed for that particular access attempt, not the entire reachable state space.

**How this works in practice:**

- **Fully automated agents** (those that run autonomously without human oversight) execute as a workload identity that does not have standing permissions. When the agent attempts to access protected resources, the AI Identity Gateway evaluates the agent's intended outcome and the specific tools it's attempting to use, then mints an ephemeral token with only the permissions needed for that specific access, if allowed by policy. The token is scoped to the task and expires after use.

- **User-delegated agents** (those created by a user and run on their behalf when tasked) use the human's identity, but when accessing protected resources, the AI Identity Gateway downscopes the token based on the specific task and tools being accessed. The agent never receives the human's full token directly--it receives a task-scoped token that collapses the reachable state space to only what's needed for that specific resource access.

This model ensures that when agents access protected resources, they operate with least-privilege access dynamically determined at runtime, reducing security risk while enabling the automation and efficiency that make agents valuable.

> **Tip:** When chat clients or agent workflows are federated with the AI Identity Gateway, they create the basis for an agent registry--all agent execution contexts registered in your organization. This registry provides a centralized view of all agent operations, enabling better governance, monitoring, and management of your AI workflows. To detect rogue agents, audit resource access for unknown clients using PATs or tokens not minted by the gateway.

## Architecture: The Identity Fabric

The AI Gateway centrally manages token validation, dynamic downscoping, and fine-grained authorization through an embedded Open Policy Agent (OPA) engine.

**Key takeaway:** The AI Identity Gateway is the single identity fabric hub. All authentication flows through it. When agents attempt to access protected resources (like MCP servers), the AI Identity Gateway dynamically mints ephemeral, task-scoped tokens that collapse the reachable state space to only what's needed for that specific access, and OPA policies enforce fine-grained authorization based on runtime execution context. Applications never need to know which IDP you're using.

## Next Steps

Explore Strata's Maverics documentation for advanced configuration, try the Maverics Sandbox for hands-on experimentation, extend OPA policies to include identity verification signals, add role-based access control (RBAC), and implement audit logging for compliance.

## Resources

- [Strata Maverics Documentation](https://docs.strata.io) -- Learn more about the identity orchestration platform
- [Maverics Sandbox](https://www.maverics.ai/labs/agentic-ai-sandbox/) -- Hands-on environment to experiment with identity fabric concepts

## The Bottom Line

MCP servers and AI agents are being deployed everywhere--downloaded from GitHub, run locally, authorized with overly broad tokens, and disconnected from enterprise identity systems. This creates a growing blind spot: security teams can't see or govern what agents are doing, and developers are left managing credentials and permissions manually in environments that were never designed for this scale.

The core issue isn't MCP itself--it's identity. When MCP servers, chat clients, and agents operate outside your identity fabric, you lose authentication, authorization, and auditability at the moment they matter most: at runtime.

By federating MCP servers and agent execution contexts through the Maverics AI Identity Gateway, organizations can bring AI workloads back under enterprise control without disrupting how developers work. Authentication flows through existing identity providers, permissions are dynamically downscoped based on the specific tools and tasks being executed, and every access is governed by policy and logged for visibility. Ephemeral, task-scoped tokens collapse the agent's reachable state space, reducing blast radius while preserving the flexibility that makes agents valuable.

This approach transforms unmanaged MCP deployments into governed infrastructure and converts AI agents from opaque automation into accountable, policy-driven entities. The result is an identity fabric that spans users, agents, tools, and resources, enabling secure and scalable AI operations across local and cloud environments.
