---
id: chk-572
type: checkpoint
title: Record seven locally verified security remediations and remaining 0.6.0 gates
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [bug-13]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [bug-13]
created: 2026-09-08
updated: 2026-09-08
---
# Summary

Bounded event validation verified: 70 focused, 39 installed, 898 full plus 26 contract tests; explicit history policy accepted; final exact-range review remains open.

# Scope Covered

- Completed node: bug-13 (Event JSONL validation follows symlinks and reads an unbounded stream into memory)
- Node type: bug
- Checkpoint source: `mdkg task done --checkpoint`

## Changed Surfaces

- Completed work node: bug-13
- Attached artifacts are listed in checkpoint frontmatter and below.

## Boundaries

- in scope: structured task completion and checkpoint evidence
- out of scope: unrelated graph, runtime, provider, or release mutations
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- See decision and approval refs on the completed node and checkpoint frontmatter.

# Implementation Summary

- Completion of bug-13 was recorded through the structured task lifecycle.
- Detailed implementation or test evidence remains on the completed node and linked refs.

# Verification / Testing

## Command Evidence

- command: `mdkg task done --checkpoint`
- result: completed node and evidence checkpoint written

## Pass / Fail Status

- status: done

## Known Warnings

- warning: none recorded by the completion command

# Known Issues / Follow-ups

- Inspect the completed node and linked refs for any explicitly recorded residual work.

## Follow-up Refs

- task/test/goal refs: inspect the completed node and checkpoint frontmatter

# Links / Artifacts

- .mdkg/artifacts/goal-84/bug-13-verification.json

# Raw Content Safety

- This checkpoint stores the completion summary and artifact refs, not raw prompts, secrets, payloads, or bulky traces.

## Qualified Midpoint Receipt

Owner: mdkg-project-agent, sole repository writer. Explicit run scope is
root:goal-83 / root:goal-84; publication root:goal-85 remains paused and blocked.
The selected root:goal-73 is achieved and unchanged, not execution authority.

Locally verified security nodes: root:bug-8, root:bug-9, root:bug-11,
root:bug-13, root:bug-14, root:bug-19 and root:bug-20. Their per-bug sanitized
JSON receipts bind source hashes and focused/installed checks. The sealed
Standard audit root:chk-571 is historical baseline evidence, not final clearance.

Current change unit: shared bounded event reader/validator, optional finite
configuration, CLI validation integration, source/installed regressions,
README/troubleshooting compatibility guidance and scoped mdkg receipts.
Before patch 15/17 event cases failed; afterward 70 focused, 39 installed,
898 full tests and 26 contract checks pass, zero failures/skips. Build, CLI and
documentation parity (478 examples/63 files), full/changed-only graph and diff
checks pass. Three inherited imported-bundle age warnings remain untouched.

Nick's event-size decision is resolved: fail explicitly at configurable limits,
preserve bytes, never silently rotate/delete history. The candidate reviewer and
parent verified the existing active-local-writer ancestor race limitation;
finite resource bounds still hold. Task-828 must independently assess public
guarantees and platform limitations, including bug-20 ACL/ownership behavior.

Remaining: root:bug-5, root:bug-6, root:bug-7, root:bug-10, root:bug-12,
root:bug-15, root:bug-16, root:bug-17, root:bug-18; full installed fixture matrix,
exact Node 24 qualification, draft 0.6.0 metadata/guidance, separate security
diff review, complete release ladder and immutable seal. NOT_READY.

Protected selected state, runtime DB and Demo 3 bundle hashes match the
bug-13 receipt. Tracked SQLite remains accepted generated custody, excluded
from this commit. No runtime lease acquired; transient locks released. Local
commit authority only: no fetch/push/tag/publish/deploy/provider action,
canonical migration, bundle/subgraph refresh or cross-project write.
New skill candidates: none; reuse goal pursuit and verification coverage.

## Follow-on Verification: root:bug-18

2026-09-08: extend this midpoint checkpoint rather than allocate another for a
single follow-on fix. Owner and authority remain mdkg-project-agent under
root:goal-84. Template selectors, contained streaming directory/schema reads,
body bounds, regression fixtures and troubleshooting guidance are verified.
Receipt: .mdkg/artifacts/goal-84/bug-18-verification.json.

92 focused, 55 installed and 924 full tests plus 26 contract checks pass;
CLI/docs/graph/diff checks pass with the same three inherited age warnings.
Eight security findings are locally fixed; remaining work is recorded in
goal-84. Selected Goal 73, runtime DB and protected Demo 3 bundle bytes remain
unchanged. SQLite is uncommitted generated custody; no runtime lease acquired.
Only a reviewed local commit is authorized. Final task-828 review, compatibility
matrix, release ladder and seal remain pending; no remote/publication action.

## Follow-on Verification: root:bug-10

2026-09-08: contained bounded configured-subgraph reads are locally verified.
Receipt: .mdkg/artifacts/goal-84/bug-10-verification.json. Sixteen focused,
33 installed, full source suite and 26 contract checks pass; CLI/docs/graph/diff
checks pass with the three inherited age warnings. The initial full-suite
cached-deletion failure was corrected while preserving the original test.
Nine security findings have local fixes; bug-12 is the next investigated lane.
Owner, local-only authority, preserved states, SQLite custody and final gates
remain as above. No runtime lease acquired; no new skill candidates.

## Follow-on Verification: root:bug-12

2026-09-08: archive schema/path/descriptor boundaries are locally verified.
Receipt: .mdkg/artifacts/goal-84/bug-12-verification.json. Twenty-five focused,
48 installed, 964 full source tests and 26 contract checks pass. Independent
prepatch/candidate source reviews and CLI/docs/graph/diff checks completed.
Ten security findings have local fixes; bugs 15–17 and all final gates remain.
Protected selection/runtime/bundle bytes, SQLite custody and local-only authority
are unchanged. No runtime lease acquired or new skill candidates proposed.

## Follow-on Verification: root:bug-16

2026-09-08: deepest workspace ownership is locally verified across exports,
derived discovery, historical snapshots and identity/legacy repair consumers.
Receipt: .mdkg/artifacts/goal-84/bug-16-verification.json. Forty-nine focused,
100 installed, 990 full source tests and 26 contract checks pass; CLI/docs/graph/
diff gates pass with three inherited age warnings. Three candidate-review gaps
were reproduced and corrected before closure. Eleven security findings now
have local fixes. Bug-15 awaits only its resource-limit compatibility decision;
bug-17 investigation and other independent qualification work can continue.
Protected states, SQLite custody and local-only authority remain unchanged.
No runtime lease acquired or new skill candidates proposed; final gates remain.

## Follow-on Verification: root:bug-5

2026-09-08: clock-independent source fingerprints and lossless SQLite JSON are
locally verified. Seven focused, 26 installed, 997 source tests and 26 contract
checks pass; CLI/docs/graph/diff gates pass. Receipt:
.mdkg/artifacts/goal-84/bug-5-verification.json. This is a non-security defect,
not an additional sealed security finding. Final verification remains task-828.
Protected selection/runtime/bundle bytes and generated SQLite custody remain
unchanged. No runtime lease, publication or new skill authoring is involved.

## Follow-on Verification: root:bug-6

2026-09-08: compact default and reviewed upgrade guidance corrected without
moving canonical instructions or editing skills. Three documentation tests,
35 installed tests and six CLI init/actual-0.5.2-upgrade scenario groups pass.
Full suite, 26 contract checks and CLI/docs/graph/diff checks pass. Receipt:
.mdkg/artifacts/goal-84/bug-6-verification.json. Preserved selection/runtime/
bundle bytes and uncommitted generated SQLite custody remain unchanged.
Bug-7 and final qualification stay open; no release approval or new skill candidate.
