---
extends: base.MANIFEST.md
template_kind: agent
spec_kind: agent
---

# Agent Role

Define the durable agent role and trigger conditions.

Suggested generic roles:

- orchestrator agent.
- worker agent.
- reviewer agent.
- summarizer agent.
- graph/project agent.

# Trigger Conditions

- Human request.
- Graph work item.
- Queue event.
- Scheduled check.
- API or runtime event.

# Allowed Resources

- Resources the agent may read or write.

# Allowed Capabilities

- Capability ids and optional generic capability URIs.

# Forbidden Actions

- Actions this agent must never perform.

# Input Context

- Required room, goal, task, pack, or queue context.

# Output Contract

- Required report, patch, receipt, or handoff.

# Receipt / Evidence Contract

- Attempt, validation, and final evidence requirements.

# Queue / Event Semantics

- Accepted trigger events.
- AgentRun claim rules.
- AttemptReceipt requirements.
- ValidationReceipt requirements.
- FinalReceipt requirements.

# Single-Writer Policy

- The graph, repo, path, branch, queue, or work item key that serializes writes.

# Escalation Behavior

- When to stop, ask, or return a blocker.

# Failure Modes

- Ambiguous scope.
- Conflicting writers.
- Invalid or stale context.
- Validation failure.
- Missing final receipt.

# Projection Targets

- Tool-specific agent manifest.
- Future runtime agent manifest.
- Future workflow/runtime capability object.
- Future workflow/runtime agent definition.
