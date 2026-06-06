---
extends: agent.SPEC.md
template_kind: omniruntime_agent
---

# Queue Ownership

- Orchestrator queue and per-agent queue responsibilities.

# Trigger Kinds

- User message, scheduled job, API event, mdkg queue event, or internal retry.

# Sandbox Requirements

- Lease refs, workspace bounds, cleanup, and metering requirements.

# SecretGrant Requirements

- Opaque refs and allowed consumers only.

# Single-Writer Keys

- Repo, graph, branch, or room keys that serialize writes.

# Receipts

- AttemptReceipt contract.
- ValidationReceipt contract.
- FinalReceipt contract.

# Cancellation And Retry

- Cancellation, retry, backoff, dead-letter, and finalization policy.

# Telemetry Policy

- Aggregate-safe stats and improvement proposals only unless a runtime spec says
  otherwise.
