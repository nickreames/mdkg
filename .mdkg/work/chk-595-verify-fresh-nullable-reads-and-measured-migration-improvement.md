---
id: chk-595
type: checkpoint
title: Verify fresh nullable reads and measured migration improvement
checkpoint_kind: implementation
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-7-nullable-read.json]
relates: [bug-7]
blocked_by: []
blocks: []
refs: [goal-83, goal-84, task-826, task-828, chk-594]
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [bug-7, test-481, test-482]
created: 2026-09-09
updated: 2026-09-09
---
# Summary

The profiled duplicate-read optimization is locally verified. One isolated
installed 2000-node migration improved from 329196 to 272214 ms (17.31% in this
pair) and validated. This is a bounded improvement, not complete scale acceptance.

# Scope Covered

Bug7 migration transaction read costs; no new product or compatibility policy.

## Changed Surfaces

- src/core/filesystem_authority.ts
- src/graph/identity_transaction.ts
- tests/core/filesystem_nullable_read.test.ts
- tests/graph/identity_migration.test.ts
- This checkpoint, bug7, goal84, test481 and the nullable-read evidence artifact.

## Boundaries

Local Goal83/84 source, fixtures, tests and evidence only. No remote Git,
publication, provider/deployment, canonical migration or bundle refresh. Raw
profiles and synthetic fixture bodies remain private under /private/tmp.

# Decisions Captured

No new policy. Old-writer, killed-writer and legacy public-bundle decisions remain
open. The explicit ten-minute profiling allowance is not a product SLA or a
silent change to the existing 180-second full qualification harness.

# Implementation Summary

Nullable reads perform one fresh containment inspection instead of an existence
check followed by a second inspection. No observed filesystem state is cached.

# Implementation Details

Shared reading preserves regular-file checks, no-follow/nonblocking open,
descriptor validation, byte bounds and closure. Initial absence alone is nullable;
later ENOENT or other failures propagate. Every per-write custody, dependency,
inventory and Git/runtime/selection control check remains, as do put() sink checks.

# Verification / Testing

## Command Evidence

- Seven new API regressions failed before implementation; eight final reader
  tests pass, including installed modules on Node 24.15.0, 24.18.0 and 26.0.0.
- Initial focused safety suite: 117 pass. Full Node24.18.0 runtime suite: 1368
  pass. Final regression-only refinements were rerun in a 25-test focused suite;
  do not imply the earlier full run compiled those later test refinements.
- CLI/docs parity and 26 release-contract checks pass. The unused import cleanup
  did not alter the 222 installed regular files matched against rebuilt outputs.
- Profiled candidate: 2000 tasks, 20000 events, JSON, Node26.0.0; apply and
  validation exit zero, exact task count and stable identity inspection pass.
  Authored before bodies and event bytes match the preceding baseline fixture.
- Full/changed-only graph, SQLite and diff checks pass at milestone closeout.

## Pass / Fail Status

Bounded remediation verified; Bug7 and Goal83 remain incomplete/NOT_READY.

## Known Warnings

Three preserved stale subgraph snapshots; do not refresh without authority.

# Known Issues / Follow-ups

Complete representative scale/runtime matrix, pending compatibility decisions,
Bug17 completion, final task828 security review, metadata, full ladder and seal.
The quadratic all-input custody contract remains. No general performance claim
is inferred from one paired profile. Independent source review has no remaining
bounded findings; it is not final security clearance.

## Follow-up Refs

root:bug-7, root:test-481, root:test-482, root:task-826, root:task-828.

# Links / Artifacts

.mdkg/artifacts/goal-84/bug-7-nullable-read.json contains source/package/log/profile
hashes, exact runtime counts, review corrections, limits and ownership. The nine
pre-existing dirty paths remain separate. Protected bytes match chk594/bug34
baseline; mutation locks are transient, runtime leases remain released and queues
empty. Local explicit-path commit is authorized; no push or publication.

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw secrets, raw prompts, raw payloads, or bulky execution traces.
