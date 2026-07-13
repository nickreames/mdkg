---
id: chk-500
type: checkpoint
title: Remaining containment sinks migrated and verified
checkpoint_kind: implementation
status: done
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-765]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-765]
created: 2026-07-12
updated: 2026-07-12
---
# Summary

Closed 20 assigned finding IDs with 21 direct hostile-path assertions; full 613+8 tests, command parity, and targeted smokes passed.

# Scope Covered

- Completed node: task-765 (Migrate archive bundle Git scaffold subgraph loop skill work handoff and event sinks)
- Node type: task
- Checkpoint source: `mdkg task done --checkpoint`

## Changed Surfaces

- Completed work node: task-765
- Attached artifacts are listed in checkpoint frontmatter and below.

## Boundaries

- in scope: structured task completion and checkpoint evidence
- out of scope: unrelated graph, runtime, provider, or release mutations
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- See decision and approval refs on the completed node and checkpoint frontmatter.

# Implementation Summary

- Migrated archive, bundle, Git, graph import, scaffold, subgraph, loop, skill,
  work, handoff, event, and mutation-lock paths to the contained filesystem
  authority.
- Added `tests/commands/security_containment.test.ts` with one named assertion
  for every assigned finding ID. The event-log finding has separate final-file
  and linked-ancestor cases, yielding 21 assertions for 20 findings.
- Tightened subgraph materialization so extracted entries, marker, ignore file,
  cleanup, and final rename all use contained operations.
- Repaired the mutation-lock release race by retrying transient `ENOENT` during
  concurrent lock inspection.

# Verification / Testing

## Command Evidence

- `npm run test`: 613 package tests and 8 public-release tests passed.
- `npm run cli:check`: command matrix parity passed.
- `npm run smoke:archive-work`, `smoke:bundle`, `smoke:subgraph`,
  `smoke:upgrade`, `smoke:loop`, `smoke:work-invocation`, `smoke:sqlite`,
  `smoke:db`, and `smoke:db-snapshot`: passed.
- Dedicated containment suite: 21/21 passed.
- Parallel SQLite allocator regression: passed three consecutive focused runs
  after the lock-race repair.
- `node dist/cli.js validate --changed-only --json`: zero warnings and errors.
- `git diff --check`: passed.

## Pass / Fail Status

- status: done

## Known Warnings

- warning: none recorded by the completion command

# Known Issues / Follow-ups

- This checkpoint closes only `task-765` and its exact 20 finding IDs. The
  remaining Goal 69 findings continue under `task-766` through `task-776`.
- Goal 64 remains paused and fail-closed until Goal 69 finishes and a fresh
  repository security audit requalifies the release.

## Follow-up Refs

- task/test/goal refs: inspect the completed node and checkpoint frontmatter

# Links / Artifacts

- No artifacts were attached by the completion command.

# Raw Content Safety

- This checkpoint stores the completion summary and artifact refs, not raw prompts, secrets, payloads, or bulky traces.
