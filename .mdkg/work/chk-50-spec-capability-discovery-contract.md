---
id: chk-50
type: checkpoint
title: SPEC capability discovery contract
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: [.mdkg/work/task-272-define-spec-capability-index-and-discovery-expectations.md]
relates: [task-272]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-272]
created: 2026-06-06
updated: 2026-06-06
---
# Summary

`task-272` defined the future SPEC capability index and discovery contract for
goal-8. The contract keeps `SPEC.md` as durable source and treats capability
indexes as deterministic read-only cache projections.

# Scope Covered

- Current capability command behavior to preserve.
- Future `kind: spec` record fields.
- Search expectations for SPEC, projection, validation, and agent terms.
- List, show, resolve, visibility, and freshness expectations.
- Imported subgraph read-only policy.
- Validation boundary between capability discovery and SPEC validation.

# Decisions Captured

- `mdkg capability ...` remains read-only discovery, not validation.
- Future SPEC records may expose conservative body-derived summaries only when
  parsing is deterministic.
- Imported subgraph SPEC repairs must identify the owning source workspace
  instead of mutating materialized or cached copies.
- Invalid SPECs should remain discoverable enough to repair when parsing
  succeeds.

# Implementation Summary

Only mdkg graph/design state changed. `task-272` now carries the capability
index contract, and `edd-14` gained the `spec-capability-index-discovery`
alias.

# Verification / Testing

- `node dist/cli.js index`
- `node dist/cli.js validate`
- `node dist/cli.js capability search "SPEC section contract" --json`
- `node dist/cli.js capability search "runtime agent manifest" --json`
- `node dist/cli.js capability search "orchestrator agent" --json`
- `node dist/cli.js capability search "SPEC capability index discovery" --json`
- Product-name grep over `task-272`
- `git diff --check`

# Known Issues / Follow-ups

- `task-273` must define projection metadata drift and no-secret policy.
- `task-276` must turn diagnostics and index contracts into an implementation
  sequence.
- `test-101` remains the discovery/index contract validation node.

# Links / Artifacts

- `goal-8`
- `task-272`
- `epic-48`
