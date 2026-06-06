---
id: epic-50
type: epic
title: generic orchestrator subagent and runtime agent SPEC contracts
status: done
priority: 1
tags: [agents, orchestrator, subagent, runtime-agent, receipts]
owners: []
links: []
artifacts: [.mdkg/templates/specs/agent.SPEC.md, .mdkg/templates/specs/runtime-agent.SPEC.md]
relates: [goal-8, task-274, task-275, test-104]
blocked_by: [epic-46, epic-47]
blocks: [task-274, task-275, test-104]
refs: [edd-14]
aliases: [orchestrator-agent-spec-contract, runtime-agent-manifest-contract]
skills: [author-mdkg-skill]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Define generic agent SPEC requirements for orchestrators, workers, reviewers,
summarizers, graph/project agents, and runtime agents.

# Goal

Make generic agent and runtime-agent SPEC contracts decision-complete for later
runtime integration work.

# Scope

- Orchestrator, worker, reviewer, summarizer, graph/project, and runtime-agent
  roles.
- Queue/event and receipt semantics.
- Single-writer boundaries.

# Milestones

- Complete `task-274`, `task-275`, and `test-104`.

# Acceptance Criteria

- Agent roles have clear authority boundaries.
- Single-writer policy is explicit.
- Trigger, queue, and receipt semantics are specified.
- Runtime-agent manifest projection remains generic.

# Out of Scope

- Runtime implementation.
- Queue implementation.

# Risks

- Multiple writers inside one graph create conflicts.

# Closeout Evidence

- `task-274` and `task-275` are done.
- `test-104` is done and records agent-orchestration and runtime-agent
  discoverability evidence.
- `chk-52` and `chk-53` record generic agent role and queue/event/receipt
  closeout summaries.
- `node dist/cli.js capability search "orchestrator agent" --json`,
  `node dist/cli.js capability search "runtime agent manifest" --json`,
  `node dist/cli.js capability search "TriggerEvent" --json`, and
  `node dist/cli.js capability search "FinalReceipt" --json` resolve
  `edd-14`.
- Runtime integration and queue implementation are not part of this design
  closeout.

# Links / Artifacts

- `goal-8`
- `.mdkg/templates/specs/agent.SPEC.md`
- `.mdkg/templates/specs/runtime-agent.SPEC.md`
