---
extends: agent.SPEC.md
template_kind: runtime_agent
spec_kind: runtime_agent
---

# Queue Ownership

- Orchestrator queue and per-agent queue responsibilities.

# Trigger Kinds

- User message, scheduled job, API event, mdkg queue event, runtime event, or
  internal retry.

# Sandbox Requirements

- Lease refs, workspace bounds, cleanup, and metering requirements.

# SecretGrant Requirements

- Opaque refs and allowed consumers only.

# Single-Writer Keys

- Repo, graph, branch, or room keys that serialize writes.

# Receipt Lifecycle

- TriggerEvent contract.
- AgentRun contract.
- AttemptReceipt contract.
- ValidationReceipt contract.
- FinalReceipt contract.

# Cancellation And Retry

- Cancellation, retry, backoff, dead-letter, and finalization policy.

# Telemetry Policy

- Aggregate-safe stats and improvement proposals only unless a runtime spec says
  otherwise.

# Projection Targets

- Local runtime agent manifest.
- Workflow/runtime protocol manifest.
- Downstream agent manifest owned outside mdkg canonical source.
