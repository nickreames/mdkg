---
id: chk-547
type: checkpoint
title: Goal 77 blocker-aware chain-first routing verified
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: [root]
links: []
artifacts: []
relates: [bug-4, test-469]
blocked_by: []
blocks: []
refs: [goal-77, bug-4, test-469, dec-6]
context_refs: [goal-77, bug-4, test-469, dec-6]
evidence_refs: []
aliases: []
skills: []
scope: [bug-4, test-469]
created: 2026-07-25
updated: 2026-07-25
---
# Summary

Node 24.18 focused CLI, MCP, pure-selector, and imported-blocker suites pass.
The first full suite exposed one stale pre-fix subgraph expectation, the
affected suite passed after alignment with the fail-closed contract, and the
selected achieved `root:goal-73` remained unchanged.

# Scope Covered

- Completed nodes: `root:bug-4` and `root:test-469`.
- Implementation surfaces: shared goal-next selector plus CLI and MCP callers.
- Test surfaces: goal command, pure selector, MCP parity, and subgraph imported
  blocker coverage.
- Checkpoint source: `mdkg task done --checkpoint`

## Changed Surfaces

- Added `src/graph/goal_next.ts`.
- Updated CLI and MCP goal-next routing to share the selector.
- Added focused command, selector, MCP parity, and imported-blocker tests.
- Updated Goal 77 routing evidence only; no selected-goal mutation.

## Boundaries

- in scope: blocker-aware chain-first goal routing, local tests, and mdkg
  evidence
- out of scope: dependency bootstrap, smoke/prepublish optimization, coverage,
  unrelated graph, provider, remote, or publication mutations
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- `root:dec-6` remains the generic one-writer and explicit-claim authority
  contract.
- Missing or imported blockers fail closed. An imported blocker remains
  read-only and emits repair guidance.
- Valid chain components expose only their first unfinished frontier; priority,
  status, and QID order resolves independent frontiers and fallback work.

# Implementation Summary

- One pure selector is shared by CLI and MCP.
- Blocked active nodes cannot bypass dependencies; completed active nodes
  advance without a stale warning.
- `mdkg goal next` remains read-only. Ownership and claims remain explicit
  lifecycle mutations.

# Verification / Testing

## Command Evidence

- Node `24.18.0`: goal command `17/17`, pure selector `3/3`, MCP `6/6`.
- Initial full `npm test`: `664/665` passed in `78.300s`; the sole failure was
  a stale assertion expecting imported-blocked work to be selectable.
- Targeted corrected subgraph suite: `17/17` passed in `37.978s`.
- `npm run build`, `npm run cli:check`, and `npm run cli:contract`: passed.
- `mdkg validate --changed-only --json`: zero warnings and errors.
- `git diff --check`: passed.
- Rebuilt real CLI routed Goal 77 to `root:task-810` with zero warnings after
  both scoped nodes completed.
- `mdkg goal current --json` remained achieved `root:goal-73`.

## Pass / Fail Status

- status: passed for the scoped routing contract

## Known Warnings

- The first full suite was not automatically retried. Later integrated
  coverage and release lanes own fresh complete-suite evidence.
- Bounded full graph validation retains only the two accepted stale-subgraph
  warnings outside Goal 77.

# Known Issues / Follow-ups

- Continue with `root:task-810` and `root:test-468` for explicit nested
  dependency ownership and offline-boundary proof.

## Follow-up Refs

- `root:task-810`
- `root:test-468`

# Links / Artifacts

- Durable receipts are summarized here and on `root:test-469`; bulky test
  output remains outside the graph.

# Raw Content Safety

- This checkpoint stores the completion summary and artifact refs, not raw prompts, secrets, payloads, or bulky traces.
