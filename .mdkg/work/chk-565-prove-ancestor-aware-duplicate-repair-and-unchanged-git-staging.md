---
id: chk-565
type: checkpoint
title: Prove ancestor-aware duplicate repair and unchanged Git staging
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: [task-819, goal-82]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-819]
created: 2026-09-06
updated: 2026-09-06
---
# Summary

Goal 82's first increment is complete locally. Legacy Git-stage duplicate repair
now distinguishes existing-ancestor edits/renames from proven independent add/add
creation, and never stages Git files. This checkpoint does not achieve Goal 82:
immutable identity, versioned migration, command parity, reviewed semantic apply,
and the complete acceptance matrix remain required.

# Scope Covered

task-819 only. Goal 17 remains achieved historical evidence, not reopened work.

## Changed Surfaces

- src/commands/fix.ts; src/cli.ts; tests/commands/fix.test.ts.
- scripts/smoke-id-repair.js; CLI_COMMAND_MATRIX.md.
- docs/advanced-alpha/graph-movement.md and its matching docs/src/content mirror.
- Goal 82 run contract, task-819 ownership/evidence, this checkpoint and required
  mdkg index/event projections. Generated CLI docs were checked and unchanged.

## Boundaries

- In scope: generic source/CLI repair safety and disposable local Git fixtures.
- Out of scope: canonical migration, bundles, subgraphs, real repository Git
  staging/commit/push/history operations, remotes, providers and consumers.
- No raw prompts, secrets, provider evidence or bulky execution traces recorded.

# Decisions Captured

dec-93 and edd-81. Git stage numbers are positional, never branch authority.
Normal disjoint same-node edits that Git merges cleanly remain one node.

# Implementation Summary

Reproduced four baseline failures before repair: implicit staging, modify/modify
alias splitting, missing delete/modify diagnostics, and rename/rename splitting.
The planner now inventories all indexed sides and the full common-ancestor graph,
reserves indexed aliases, checks workspace ownership, and blocks unproven cases.
NUL-delimited path parsing supports spaces and non-ASCII paths. Read-only Git
queries disable optional index writes. Repeat application preserves an already
resolved working tree instead of splitting the unresolved Git index again.

# Test Proof

- Target: add/add, modify/modify, delete/modify, rename/rename, absent ancestry,
  renamed ancestor without stage 1, wrong base, invalid stages, quoted paths,
  criss-cross ambiguous ancestry, disjoint same-node edits and unchanged Git bytes.
- Fixtures: temporary local Git repositories created by the focused suite and
  packaged smoke scripts; no canonical graph repair was executed.
- Remaining scope: legacy reference-rewrite ambiguity and reviewed/hash-bound
  semantic application are task-822 work, not proven by tolerant repair indexing.

# Verification / Testing

## Command Evidence

- npm run build: passed.
- npm run build:test and node --test dist/tests/commands/fix.test.js: 27 passed.
- Combined fix/command_contract/security_containment suites: 52 passed before
  the final two ancestry/disjoint-edit fixtures; those two then passed in the
  expanded 27-case fix suite.
- node scripts/smoke-id-repair.js: passed, including exact Git-index preservation.
- node scripts/smoke-branch-conflicts.js: passed, read-only duplicate planning.
- npm run cli:check:built: passed.
- npm run docs:check:built: passed, 474 command examples and no generated drift.
- git diff --check: passed before this evidence annotation; repeated at handoff.

## Pass / Fail Status

- PASS for task-819. Full Goal 82 verification remains pending.

## Known Warnings

- Three inherited imported-bundle age warnings remain unchanged; no refresh.
- The previously documented volatile SQLite warning-fingerprint issue is outside
  this increment. No claim of provider, publication or live remote verification.

# Known Issues / Follow-ups

- Legacy repair is not the new complete identity/reconciliation API.
- Git still reports unresolved index stages after working-tree repair until the
  caller explicitly reviews/stages; this is intentional authority separation.

## Follow-up Refs

- task-820, task-821, task-822, test-151, test-475, test-476, goal-82.

# Links / Artifacts

- Local main HEAD remains 8f69773b653fd3fb409c4b473e4d39e288ee6e21, one ahead of
  cached origin/main 9652b8558942041cbebe8f444fbc79e16b1a670d; no remote check.
- This increment is unstaged/uncommitted. Only attributable Goal 82 paths changed.
- Selected Goal 73 and runtime database hashes match intake; Demo 3 bundle is
  unchanged (SHA-256 741b4644da1d3d1ff3bbd4b9240e22870609f015e49e28170a91748ab024570b).
- Authority: explicit Goal 82 Run; supported goal/task ownership and transient
  mutation locks only. No runtime writer lease acquired or database initialized.
- Skill coverage: goal pursuit, work grounding, boundary ownership, pack building,
  source-grounded regression and verification/checkpoint. Skill candidates: none.

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw secrets, raw prompts, raw payloads, or bulky execution traces.
