---
extends: base.SPEC.md
template_kind: agent
---

# Agent Role

Define the durable agent role and trigger conditions.

# Allowed Resources

- Resources the agent may read or write.

# Forbidden Actions

- Actions this agent must never perform.

# Input Context

- Required room, goal, task, pack, or queue context.

# Output Contract

- Required report, patch, receipt, or handoff.

# Receipt / Evidence Contract

- Attempt, validation, and final evidence requirements.

# Escalation Behavior

- When to stop, ask, or return a blocker.

# Projection Targets

- `.codex/agents` TOML
- future OmniRuntime AgentManifest
- future OmniTx capability object
- future OmniPL agent definition
