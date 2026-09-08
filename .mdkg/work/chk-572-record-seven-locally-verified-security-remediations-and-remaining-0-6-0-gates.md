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
