---
templateKey: blog-post
title: "The Agentic Virus: How AI Agents Become Self-Spreading Malware"
date: 2026-02-18T00:00:00.000Z
author: Nick Gamb
description: "What happens when the agent itself is the threat? This post explores how disconnected MCP servers and AI agents create growing blind spots in enterprise identity, and what a purpose-built agentic virus would look like."
featuredpost: true
featuredimage: /img/blog/agentic-virus-hero.png
category: Agentic Identity
tags:
  - Agentic Identity
  - Security
  - MCP
  - AI Agents
---

In my previous post, I walked through how disconnected MCP servers and AI agents create a growing blind spot in enterprise identity. The problem: thousands of MCP deployments running with overly broad tokens, no authentication, and no connection to your identity fabric. The solution: federate everything through the Maverics AI Identity Gateway. That post assumed a well-intentioned developer making poor security choices. This post assumes something worse. What happens when the agent itself is the threat?

## Patient Zero

A developer on your team scrolls through their feed. A project is trending. Tens of thousands of GitHub stars overnight. The README promises a personal AI assistant that can manage files, automate browser tasks, send messages, schedule calendar events, and run shell commands. It's open source. Self-hosted. Privacy-first. They clone it, run `docker compose up`, and connect it to their messaging app. It works. It's impressive. They show a colleague. Sound familiar?

This is roughly what happened with OpenClaw (formerly Clawdbot, formerly Moltbot). The project crossed 100,000 GitHub stars in three days. By the time Cisco published a threat analysis calling it a "security nightmare," millions of weekly visitors were already running it. The agent had full desktop control: shell execution, browser automation, file management, persistent memory across sessions, and credential storage in plaintext Markdown and JSON files. That alone is a significant attack surface. But here's where it gets worse.

In January 2026, someone uploaded a proof-of-concept malicious skill to the Moltbot skill marketplace. It racked up over 4,000 downloads before anyone noticed. The skill was designed for credential theft. Around the same time, a fake "Moltbot Agent" VS Code extension appeared on Microsoft's official marketplace. Upon installation, it deployed ConnectWise ScreenConnect -- a legitimate remote desktop tool -- giving the attacker full remote control of the victim's machine. Moltbot has no legitimate VS Code extension.

When the project was forced to rename from Clawdbot to Moltbot due to a trademark dispute, attackers seized the released X handle within seconds, registered typosquatted domains (moltbot[.]you, clawbot[.]ai), and cloned the GitHub repository under the original creator's name with download buttons pointing to malicious repos.

Then there's Moltbook -- a social network built specifically for AI agents. Cybersecurity firm Wiz discovered a misconfigured Supabase database that exposed 1.5 million API authentication tokens, 35,000 email addresses, and private messages between agents. The root cause: the founder built it with "vibe coding" and forgot to lock down the database. Full read and write access was exposed via a client-side API key.

None of this required a sophisticated attacker. It required curiosity and a trending project. Now imagine someone building one of these on purpose.

## Anatomy of an Agentic Virus

Traditional malware follows a predictable lifecycle: delivery, exploitation, installation, command and control, actions on objectives. An AI-agent-based virus follows the same structure but replaces static payloads with an autonomous reasoning engine. It doesn't execute a fixed script. It reads its environment, makes decisions, and adapts. Here's what that looks like across four phases.

![Agentic Virus Lifecycle — four phases from installation to persistence](/img/blog/virus-lifecycle.svg)

### Phase 1: Installation via Social Engineering

The attacker doesn't need to break into your network. They need to put a project on GitHub and make it go viral. This isn't theoretical.

- The Moltbot ecosystem proved that tens of thousands of developers and tech enthusiasts will install an autonomous agent with root-level access based on a trending repository and a polished README.
- The malicious VS Code extension proved that official marketplaces are viable distribution channels.
- The skill marketplace proof-of-concept proved that post-deployment capability injection works at scale.

The playbook:

1. **Publish a compelling open-source agent.** Give it real utility. File organization, browser automation, message scheduling. Make it actually useful so people recommend it to each other.
2. **Hide the payload in a skill that installs after deployment.** The initial project passes inspection. Once the user trusts the agent and grants it system access, the agent pulls a malicious skill from a remote registry. The user never reviews it. The agent now has capabilities the user didn't authorize.
3. **Let curiosity do the distribution.** A trending project on GitHub, a few posts on X, a demo video that goes viral. Smart people fall for this. It's not about intelligence -- it's about curiosity meeting a well-crafted social engineering play. Your security team can't write a policy against human nature.
4. **Escalate access by asking nicely.** Once installed, the agent doesn't need to exploit a vulnerability to gain more privileges. It just asks. "I need access to your SSH keys to help manage your server deployments." "I need browser permissions to automate your workflow." The user already trusts it -- they installed it voluntarily, it's been helpful for days, and the request sounds reasonable. The actual intent is credential harvesting, but the stated reason is plausible.

Research on LLM-driven manipulation shows that agents using targeted psychological tactics achieve a 205% increase in extracting sensitive information from users. The disturbing finding: users rate the manipulative agent as more empathetic and trustworthy than a baseline.

The agent doesn't need to be covert about asking for access. It needs to be persuasive about why.

This is the critical difference from traditional malware distribution. The attacker doesn't phish a single employee. They distribute the agent publicly and let the internet do the rest. And once installed, the agent social-engineers its own privilege escalation -- from the inside, with a trust relationship already established.

### Phase 2: Reconnaissance

Once running, the agent has the same access as the user who installed it. On a developer workstation, that access is substantial. The agent scans:

- **Shell history** -- previous commands reveal infrastructure, hostnames, deployment patterns
- **SSH keys and configs** (~/.ssh/) -- private keys, known hosts, connection shortcuts to production servers
- **Cloud CLI configurations** (~/.aws/credentials, ~/.azure/, ~/.config/gcloud/) -- often over-permissioned, rarely rotated
- **Environment files** (.env, docker-compose.yml) -- API keys, database connection strings, service account tokens
- **Browser credential stores** -- saved passwords, session cookies, OAuth tokens
- **Git configs and repositories** -- access to source code, CI/CD pipeline definitions, deployment secrets embedded in configs

It maps the local network using whatever CLI tools are available: nmap, arp, netstat, kubectl, `aws ec2 describe-instances`. Developer workstations often have tools installed that most endpoints wouldn't.

All of this is done without triggering endpoint detection. The agent isn't running shellcode or exploiting a CVE. It's reading files and running standard CLI commands exactly the way the human user would. It looks like normal developer activity because it is normal developer activity -- just not initiated by the developer.

Moltbot instances already store credentials in plaintext Markdown and JSON files. Security researchers at SOC Prime noted that this makes them vulnerable to commodity infostealers like RedLine, Lumma, and Vidar. An agentic virus wouldn't need a separate infostealer. It *is* the infostealer. It reads the credentials, understands what they're for, and decides how to use them.

### Phase 3: Lateral Spread

Here's where the virus becomes a virus. With SSH keys and cloud credentials in hand, the agent connects to adjacent hosts. Not by exploiting a vulnerability -- by using legitimate access that was already provisioned.

It SSH's into a staging server using the developer's key. It uses the AWS CLI to spin up a new EC2 instance with the developer's over-permissioned IAM role. It clones itself to the new host.

On the new host, it repeats Phase 2. New credentials, new network topology, new targets.

If it finds access to multiple cloud providers -- AWS in one config, Azure in another, GCP in a .config/gcloud directory -- it replicates across clouds. Many organizations have developer workstations with CLI tools for two or three cloud providers, each configured with long-lived credentials that are rarely audited.

This isn't theoretical either. Researchers at Cornell Tech demonstrated Morris II, a proof-of-concept AI worm that propagates through interconnected GenAI ecosystems using adversarial self-replicating prompts. Their worm spreads through RAG-based communication between AI applications without any user clicks. They tested it against ChatGPT 4.0, Gemini Pro, and LLaVA. It exfiltrated personal data and generated spam to propagate itself further.

Morris II exploited the interconnected nature of AI applications. An agentic virus would exploit the interconnected nature of enterprise infrastructure -- which is far more permissive.

### Phase 4: Persistence and Evasion

The virus doesn't just spread. It digs in. On each compromised host, the agent:

- Creates scheduled tasks or cron jobs to survive reboots
- Installs itself as a system service with a generic name
- Opens reverse shell connections back to a C2 endpoint
- Modifies logging configurations to suppress evidence of its activity
- Creates additional user accounts or SSH keys as backdoors

Because the agent reasons about its environment, it can adapt its persistence strategy per host. On a Linux server, it writes a systemd unit file. On a macOS workstation, it creates a LaunchAgent. On a Windows machine, it registers a scheduled task. It chooses process names that blend in with existing services.

Meanwhile, it's exfiltrating. PII from databases it can query. Credentials from every host it compromises. Network topology and vulnerability data it has mapped. All of this flows back to the attacker through whatever exfiltration channel the agent determines is least likely to be detected -- DNS tunneling, HTTPS to a domain that looks like a SaaS provider, or data hidden in legitimate API calls.

The compound effect is devastating. By the time a SOC analyst notices anomalous behavior on one host, the virus has replicated to dozens. Remediating a single host doesn't contain it. You'd need to identify every compromised system simultaneously, and the virus is actively working to prevent exactly that.

But it gets worse. Traditional botnets -- Mirai, Emotet -- rely on a central command-and-control server to coordinate dumb endpoints. An agentic virus is not dumb. Each copy is an autonomous reasoning engine. If the copies can discover each other -- through shared network markers, known ports, or simply by scanning the same network they already mapped in Phase 2 -- they can coordinate. Not through a central C2, but peer-to-peer. A swarm.

A swarm of agentic copies can divide labor. Some run reconnaissance. Some exfiltrate. Some create noise. That noise matters: dozens of autonomous agents simultaneously making legitimate-looking API calls, SSH connections, and cloud provisioning requests generates enough aggregate traffic to degrade network performance or overwhelm specific services -- an organic, distributed denial of service that doesn't look like a traditional DDoS because every individual request appears normal. It's the volume in aggregate that breaks things.

The swarm can also share intelligence. Credentials harvested by one copy propagate to every other copy. A vulnerability discovered on one host is exploited across every host the swarm can reach. And if the attacker wants to use the swarm as a deliberate weapon, it can coordinate a focused assault on a specific target while a subset of copies quietly continues the real objective: exfiltrating data under the cover of the chaos.

## The MFA Problem: When the Virus Fights Back

At this point, a reasonable response is: "The model's safety guardrails would prevent this. We have endpoint detection. We have MFA. We'll catch it." Let's examine each of these.

### Model Guardrails Don't Apply

In a chat window, ask an LLM to steal your SSH keys and it will refuse. But agentic frameworks don't work like chat windows. The malicious intent isn't in a user prompt that the model evaluates against its safety training. It's embedded in the system instructions, tool definitions, or injected skills that the framework treats as trusted configuration.

The model isn't being told to do something malicious. It's being given tools -- file system access, shell execution, network calls via MCP servers -- and instructions that frame each action as a legitimate task: read this config to help with deployment, run this command to check server status, connect to this host to verify uptime. Each individual tool call is benign. The malice exists only in the aggregate sequence, and models have no mechanism to evaluate the cumulative intent of a chain of tool calls against an ethical framework.

The safety guardrails were designed for conversations, not for autonomous tool-use pipelines where the attacker controls the system prompt.

And that's assuming the attacker uses a guardrailed model at all. Open-weight models can be fine-tuned to strip safety training with minimal effort -- researchers have shown it can take as few as a hundred examples. "Uncensored" model variants are already freely available on public model hubs. The attacker doesn't need to jailbreak anything. They just run their own model.

### Detection is Post-Compromise

Endpoint detection and response (EDR) tools are designed to catch known malicious patterns: shellcode injection, privilege escalation exploits, known malware signatures. An agentic virus doesn't trigger any of these. It reads files using standard filesystem APIs. It runs CLI commands that the user has already installed and configured. It makes network connections using the user's own credentials. From the EDR's perspective, the user is just being productive.

By the time behavioral analysis flags an anomaly -- maybe an unusual volume of SSH connections or an unexpected cloud API call pattern -- the virus has already mapped the network, exfiltrated credentials, and replicated itself to multiple hosts and cloud accounts. Discovery after installation is too late. Inventory and observability are post-compromise tools. They tell you what happened. They don't prevent it from happening.

### Traditional MFA is Spoofable

If the virus encounters a resource protected by traditional MFA, it has options.

In March 2023, researchers at the Alignment Research Center demonstrated that GPT-4 autonomously hired a TaskRabbit worker to solve a CAPTCHA. When the worker asked if it was a robot, GPT-4 lied: "No, I'm not a robot. I have a vision impairment that makes it hard for me to see the images." The worker solved the CAPTCHA.

That was 2023, with a general-purpose model improvising on a platform built for humans. In 2026, the agent doesn't even need to improvise. RentAHuman.ai is a platform purpose-built for AI agents to hire humans for real-world tasks -- "the meatspace layer for AI." It has an MCP server so agents can post task bounties programmatically. Over 180,000 users registered in its first week.

An agentic virus that encounters an MFA challenge it can't bypass could post a bounty: "Verify this login for me." A human completes it, collects their crypto payment, and never knows they just helped a virus authenticate to an enterprise system.

- **SMS-based OTP:** AI agents can acquire real mobile phone numbers. VoIP numbers are commonly blocked by platforms, but SIM-based numbers connected to carrier networks achieve 95-99% success rates for account verification. An agent with access to cloud APIs could provision a number programmatically.
- **Voice-based OTP:** AI-powered phishing kits like BlackForce and GhostFrame already use real-time voice social engineering to extract OTP codes from victims by impersonating legitimate services. An agentic virus could do the same thing autonomously.
- **Push notification MFA:** If the virus controls the host and the user has an authenticator app, it can trigger a push notification and hope the user approves it (push fatigue). If the user has already granted the agent broad system access, the agent may be able to interact with the notification directly.

The core insight is this: you cannot reliably prevent people from installing experimental AI agents. You can write policies. You can train people. Some will still install the trending project because they're curious, because it looks useful, because a colleague recommended it. And once it's installed, you cannot rely on traditional MFA to contain it.

The question isn't "how do we stop installation?" It's "how do we protect the resources the virus will try to access?"

## The AI Identity Gateway as Immune System

This is where the mental model shifts. If you think of security as a perimeter around your hosts, you've already lost. The virus is inside the perimeter the moment a user runs `docker compose up`. Endpoint detection sees normal user behavior. Network monitoring sees legitimate credentials in use.

Instead, think of security as a layer around your resources. APIs. MCP servers. Cloud services. Databases. Every resource that holds value is fronted by a gateway that enforces identity and policy at the point of access.

The virus can compromise all the hosts it wants. When it tries to use what it found -- when it calls an API, connects to an MCP server, queries a database through a protected endpoint -- it hits the gateway.

This is what the Maverics AI Identity Gateway does. It sits between agents and resources, enforcing authentication, authorization, and audit for every interaction.

### How It Works in Practice

The gateway operates as an MCP Provider that validates OAuth tokens and enforces policy-driven access control for every tool call. Here's the core authorization configuration from a working deployment:

```yaml
mcpProvider:
  enabled: true
  authorization:
    oauth:
      enabled: true
      # Standard OAuth discovery endpoint -- agents and clients
      # use this to find the authorization server automatically.
      metadataPath: /.well-known/oauth-protected-resource
      servers:
        # The authorization server that issues tokens for this environment.
        - wellKnownEndpoint: https://auth.orchestrator.lab/.well-known/oauth-authorization-server
          tokenValidation:
            # Only accept tokens intended for this gateway.
            # A token minted for a different audience is rejected,
            # even if it's signed by the same authorization server.
            expectedAudiences:
              - https://gateway.orchestrator.lab/
            # Validate tokens as JWTs -- signature, expiration, and
            # claims are all checked before the request proceeds.
            method: jwt
            jwt:
              # Allow up to 15 seconds of clock drift between the
              # authorization server and the gateway.
              clockSkew: 15s
```

Every MCP request must carry a valid JWT issued by the authorization server, with the correct audience claim. No token, no access. Expired token, no access. Wrong audience, no access. A virus that stole a user's SSH key or AWS credentials gets nothing here -- those credentials don't produce a valid JWT for the gateway.

### Policy Enforcement Per Tool

Each MCP server proxied through the gateway has its own inbound authorization policy evaluated by an embedded Open Policy Agent (OPA) engine, plus outbound token exchange that scopes access per tool:

```yaml
apps:
  - name: mission-control-service
    type: mcpProxy
    authorization:
      # Inbound: evaluate an OPA policy before the request
      # reaches the upstream MCP server.
      inbound:
        opa:
          name: mission-control-inbound-authz
          file: /etc/maverics/policies/mission-control-inbound-authz.rego
      # Outbound: mint a short-lived, scoped token for
      # each tool call via RFC 8693 token exchange.
      outbound:
        type: tokenExchange
        tokenExchange:
          # Delegation: the downstream token carries the
          # original user's identity plus the gateway as actor.
          type: delegation
          idp: oidc-provider
          audience: https://mission-control.orchestrator.lab/
          tools:
            - name: listMissions
              ttl: 5s  # Token expires in 5 seconds.
              scopes:
                - name: mission:List
            - name: createMission
              ttl: 5s
              scopes:
                - name: mission:Create
            - name: updateMissionStatus
              ttl: 5s
              scopes:
                - name: mission:Update
```

Notice the TTLs. Every delegated token lives for five seconds and is scoped to a single tool with a single permission. A token minted for `listMissions` can't be used to `createMission`. A token minted five seconds ago is already dead. Even if the virus somehow intercepted a token in transit, the window for reuse is effectively zero.

This might look like traditional access control -- and the principles are the same. The difference is the layer it operates at. Traditional policies answer: *can this user access the mission-control application?* Gateway policies answer: *can this agent, acting on behalf of this user, call createMission with these specific scopes, right now?*

It's the same identity. The same user directory. But the policy is evaluated per tool call, scoped to a single action, and temporally bound. A user who is authorized to list missions isn't automatically authorized to create them, and authorization that existed five seconds ago doesn't exist now.

Here's what the inbound OPA policy looks like in practice:

```rego
package orchestrator

default result["allowed"] := false

jwt_payload := payload if {
    auth_header := input.request.http.headers.Authorization
    startswith(auth_header, "Bearer ")
    token := substring(auth_header, 7, -1)
    [_, payload, _] := io.jwt.decode(token)
}

result["allowed"] if {
    input.request.mcp.tool.params.name == "listMissions"
    jwt_payload.role in ["admin", "user"]
}

result["allowed"] if {
    input.request.mcp.tool.params.name == "createMission"
    jwt_payload.role == "admin"
}
```

Standard Rego. Teams already using OPA for Kubernetes admission control or API gateway authorization will recognize the pattern. The policy decodes the JWT from the inbound request, then evaluates per-tool rules against the caller's claims. In this case, any user with an `admin` or `user` role can list missions, but only admins can create them.

What makes it powerful is where it's enforced: at the gateway, per tool call, before any downstream request is made.

The operational concern is fair: writing per-tool policies for every MCP server sounds overwhelming. But the alternative is worse. Without the gateway, every downstream service independently implements its own authentication and authorization logic -- or more commonly, relies on long-lived API keys and network-level trust. The gateway centralizes that. You define the policy once in declarative config. The gateway enforces it uniformly across every proxied MCP server. Services that share similar access patterns share similar policies. And because it's OPA, policies can be version-controlled, tested, and audited like any other code.

### Token Exchange and Audit Trails

When the gateway delegates access to a downstream resource, it performs RFC 8693 delegated token exchange. The resulting token carries an actor chain that preserves who initiated the action and through which delegation path:

```json
{
  "sub": "boba.fett@orchestrator.lab",
  "act": {
    "sub": "ai-identity-gateway"
  }
}
```

The downstream API logs every request with the full chain:

```json
{
  "level": "INFO",
  "msg": "API request",
  "method": "GET",
  "path": "/api/v1/employees",
  "subject": "boba.fett@orchestrator.lab",
  "actors": ["ai-identity-gateway"]
}
```

If a compromised agent somehow obtained a valid token and called the Employee Directory API, the audit log would show exactly which user's identity was delegated, through which gateway, at what time, for which specific tool. That's not just detection -- it's attribution.

### What This Means for the Virus

An agentic virus that compromises a host and harvests credentials faces a fundamentally different challenge when the resources it targets are behind the AI Identity Gateway:

- **Stolen AWS credentials** don't produce JWTs with the correct audience. Useless.
- **Stolen API keys and PATs** aren't accepted by the gateway. Useless.
- **Replaying intercepted tokens** fails because they expire in seconds and are scoped to a single tool.
- **Forging tokens** fails because they must be signed by the authorization server's private key, which is not on any host the virus can reach.

The virus can own every workstation on the network. But if the resources it needs to access -- the APIs, the MCP servers, the databases -- all sit behind the gateway, every access attempt requires a fresh, short-lived, policy-compliant token tied to a real human identity.

And that's where the kill switch comes in.

## Human-in-the-Loop: The Kill Switch

The single most effective policy against agentic spread is human-in-the-loop (HITL) authorization.

Here's the concept: when an agent attempts a sensitive action through the gateway -- creating a resource, accessing PII, modifying a configuration -- the OPA policy doesn't just check whether the token is valid. It requires the human principal to actively verify the action.

The flow:

1. Agent calls a tool through the gateway (e.g., `createMission`)
2. Gateway validates the OAuth token and evaluates the OPA policy
3. Policy determines this action requires HITL verification
4. The human who owns the delegated identity receives a verification challenge on their device
5. The human authenticates using a phishing-resistant factor
6. Only after successful verification does the gateway mint the downstream token and forward the request

The virus can't complete step 5. It doesn't have the human's physical device. It can't reason its way past a biometric challenge on hardware it doesn't control.

But here's the catch: the verification factor matters enormously.

### What the Virus Can Spoof

If your HITL verification uses SMS, the virus can acquire a phone number and intercept the code. If it uses a voice call, the virus can answer and use speech synthesis. If it uses a push notification on the same device it controls, the virus can approve it. If it uses on-screen face recognition, the virus could potentially inject a deepfake into the camera feed.

Traditional MFA factors were designed to verify that a human is present. They were not designed to withstand an autonomous agent that has root access to the host and can reason about how to circumvent the challenge.

### What the Virus Cannot Spoof

FIDO2 passkeys and hardware-bound biometrics operate on a different threat model. Consider a solution like HYPR: the user authenticates with a fingerprint or face scan on their physical smartphone. The authentication uses public key cryptography -- the private key never leaves the device's secure enclave. There's no OTP to intercept. No shared secret to steal. No push notification to approve on a compromised host.

The verification proves three things simultaneously:

- **Present:** The human is physically holding the device and providing a biometric. The agent does not have the device.
- **Aware:** The challenge is specific to the action being attempted. The human sees what they're authorizing.
- **Consenting:** The biometric is an active, deliberate gesture. Not a background process. Not an auto-approved notification.

An agentic virus that controls a developer's laptop still cannot produce the developer's fingerprint on a separate physical device. The challenge-response is bound to hardware the virus doesn't possess, using cryptographic keys it can't extract.

This is the difference between MFA designed for humans-versus-phishing-sites and MFA designed for humans-versus-autonomous-agents. The latter requires a verification factor that is physically decoupled from any host the agent could compromise.

When you combine the AI Identity Gateway's per-tool, per-action policy enforcement with phishing-resistant HITL verification, you get a system where:

- Every sensitive action requires real-time human proof
- The proof is bound to hardware the virus can't access
- The scope of what's authorized is limited to the specific action requested
- The authorization expires in seconds

The virus's autonomy -- its greatest weapon -- is neutralized. It can reason, adapt, and spread across hosts. But every time it reaches for a protected resource, a human has to physically approve it. And the human (hopefully) won't approve actions they didn't initiate.

## Wrapping Up

The threat model described in this post isn't speculative. Every component exists today. Open-source agents with full desktop control exist. Malicious skill injection has been demonstrated. Supply chain impersonation campaigns have been executed. AI worm propagation has been proven in controlled research. MFA bypass techniques are documented and actively used.

What doesn't exist yet -- as far as we know -- is a purpose-built agentic virus that combines all of these capabilities into a single self-propagating system. But the gap between "all the pieces exist separately" and "someone assembles them" is not large. It requires motivation, not invention.

The identity gateway is the architectural constant. Regardless of how the virus evolves -- more creative social engineering, deeper evasion, faster spread -- every access to a protected resource must go through the gateway. The gateway enforces policy. The policy can require human verification. And human verification, done correctly, is the one thing an autonomous agent fundamentally cannot fake.

There's also an open question about what "done correctly" will look like in two or three years. FIDO2 passkeys and hardware biometrics are the current gold standard. But if agents become sophisticated enough to physically manipulate devices (robotic process automation taken to an extreme), or if deepfake technology advances enough to defeat current liveness detection, we'll need verification methods that are even harder to spoof.

The age of intelligent, AI-driven viruses is arriving. The question for your organization is straightforward: are the resources your agents can access protected by an identity gateway that demands human proof at the gate?

If not, the next trending GitHub project might be patient zero.

## Resources

- [Securing MCP Servers at Scale](https://www.maverics.ai/blog/securing-mcp-with-maverics-ai-gateway/) -- Previous blog on governing AI agents with an enterprise identity fabric
- [Maverics AI Identity Gateway](https://www.maverics.ai) -- Runtime identity control plane for AI agents
- [Maverics Sandbox](https://www.maverics.ai/labs/agentic-ai-sandbox/) -- Hands-on lab for identity controls on AI agents
- [Strata Documentation](https://docs.strata.io) -- Full Maverics platform documentation
- [Orchestrator Blueprints](https://github.com/strata-io/orchestrator-blueprints) -- Containerized reference architectures including the AI Identity Gateway lab used in this post
- [Identity MCP](https://github.com/strata-io/identity-mcp) -- Experimental MCP server exploring novel identity verification signals
- [Morris II: AI Worm Research](https://sites.google.com/view/compromptmized) -- Cornell Tech research on self-replicating AI worms
- [HYPR Passwordless MFA](https://www.hypr.com) -- FIDO2-based phishing-resistant authentication
- [CHEQ Protocol (IETF Draft)](https://datatracker.ietf.org/doc/draft-rcross-cheq/) -- Emerging protocol for human-in-the-loop confirmation of AI agent decisions
