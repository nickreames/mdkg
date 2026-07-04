---
id: task-654
type: task
title: implement graph discovery history why next-work and agent-loop query surfaces
status: todo
priority: 1
parent: goal-52
tags: [remote-git, graph-discovery, query-model, agent-loop, cli]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: [test-339]
refs: [goal-51, task-650, test-338, edd-62, edd-63]
context_refs: []
evidence_refs: []
aliases: []
skills: [service-boundary-ownership-check, verify-close-and-checkpoint]
created: 2026-07-03
updated: 2026-07-03
---
# Overview

Implement read-only graph discovery and project-memory query surfaces plus
generic agent working-loop integration for descriptor-backed graph context.

# Acceptance Criteria

- Graph discovery reports local, remote descriptor, bundle, and subgraph context
  with stale/fresh evidence.
- History queries traverse graph nodes, events, checkpoints, accepted revisions,
  and validation receipts.
- Why queries cite decisions, EDDs, PRDs, checkpoints, and evidence refs.
- Next-work queries rank actionable nodes using goal scope, blockers, status,
  priority, freshness, and accepted revision evidence.
- Agent working-loop surfaces distinguish read-only remote inspect/pack/query
  from authorized local claim/update/checkpoint mutation.

# Files Affected

- CLI/API modules selected during `task-651`
- graph/query tests
- docs/generated references after command behavior stabilizes

# Implementation Notes

- Remote descriptors may inform planning; they do not authorize writes.
- Any future remote write behavior needs a separate decision and explicit
  approval gate.

# Test Plan

- query and graph discovery unit tests
- CLI contract/help checks if new commands or flags are added
- `npm run cli:check`
- `npm run cli:contract`

# Links / Artifacts

- `edd-62`
- `edd-63`
- `test-339`
