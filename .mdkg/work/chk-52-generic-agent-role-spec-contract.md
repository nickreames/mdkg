---
id: chk-52
type: checkpoint
title: Generic agent role SPEC contract
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: [.mdkg/work/task-274-define-generic-agent-role-spec-requirements.md]
relates: [task-274]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-274]
created: 2026-06-06
updated: 2026-06-06
---
# Summary

`task-274` defined the generic agent role SPEC contract for goal-8. Agent
SPECs are now framed as durable role and authority contracts, with runtime
profiles treated as projections.

# Scope Covered

- Base agent SPEC fields for identity, role, triggers, authority, resources,
  capabilities, inputs, outputs, receipts, queue/event semantics,
  single-writer policy, validation, escalation, and projection targets.
- Role-specific requirements for orchestrator, worker, reviewer, summarizer,
  and graph/project agents.
- Runtime-neutral projection boundary for agent TOML, manifests, process
  configs, queue consumers, and worker profiles.
- Single-writer and FinalReceipt closeout rules.
- Compatibility notes for future parser/template validation.

# Decisions Captured

- Orchestrators coordinate graph state, work packs, queue events, and accepted
  FinalReceipts; they do not get unbounded implementation write authority by
  default.
- Workers write only inside explicit scoped boundaries.
- Reviewer and summarizer agents are read-only unless a SPEC grants narrow
  mutation authority.
- Graph/project agents own durable mdkg graph writes for their workspace.
- Runtime-specific agent files remain projections and must not add durable
  behavior without source repair work.

# Implementation Summary

Only mdkg graph/design state changed. `task-274` now carries the role contract,
and `edd-14` gained focused aliases for role and lifecycle discoverability.

# Verification / Testing

- `node dist/cli.js index`
- `node dist/cli.js validate --json`
- `node dist/cli.js capability search "orchestrator agent" --json`
- `node dist/cli.js capability search "runtime agent manifest" --json`
- `node dist/cli.js capability search "TriggerEvent" --json`
- `node dist/cli.js capability search "FinalReceipt" --json`
- Product-name grep over `task-274`
- `git diff --check`

# Known Issues / Follow-ups

- `task-275` must define queue event and receipt semantics for agent SPECs.
- `test-104` must validate discoverability after `task-275` is complete.
- Runtime implementation and exporter work remain deferred.

# Links / Artifacts

- `goal-8`
- `task-274`
- `epic-50`
- `.mdkg/templates/specs/agent.SPEC.md`
