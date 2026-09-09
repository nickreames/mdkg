---
id: bug-26
type: bug
title: Require explicit legacy recreation provenance before identity migration
status: done
priority: 1
tags: [release-0.6.0, behavioral-audit]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-83/task-824-contract-audit.json, .mdkg/artifacts/goal-84/bug-26-verification.json]
relates: [task-824, goal-84, test-483]
blocked_by: []
blocks: []
refs: []
context_refs: [goal-84, goal-83, task-824]
evidence_refs: []
aliases: []
skills: []
created: 2026-09-09
updated: 2026-09-09
---
# Overview

Legacy migration silently unifies a recreated node with its historical ancestor when the numeric alias, file path and type match. Functional severity: medium; identity/provenance corruption risk blocks publication. This is an unpublished v2 migration defect, not a claim against published 0.5.2.

Owner: mdkg-project-agent. Goal: bounded root:goal-84 remedy discovered by root:task-824. Current intake authors evidence only. Future implementation stays within this bug, regression tests and required mdkg projections; use one writer, exact custody, and failing-before/passing-after installed proof. No canonical migration, protected bundle refresh, Git history action, remote/provider access, publication, unrelated source or cross-project writes. Preserve selected Goal 73, runtime DB, existing dirty state and source snapshot until audit closeout. Materially new policy needs Nick; no automatic risk waiver.

# Reproduction Steps

1. Create a valid synthetic legacy graph and commit an accepted ancestor containing task-1.
2. Commit deletion of task-1. Later recreate a different task at the same alias/path and commit it. Validate the current graph successfully.
3. Preview graph migrate with the earlier accepted --ancestor, fixed --graph-id and --origin.
4. Actual: safe_to_apply true, no blockers, and origin_kind accepted-ancestor for the recreated node. An ordinary-edit control receives the same classification. Both previews preserve all fixture/Git bytes.

# Expected vs Actual

A recorded deletion/recreation interval is ambiguous identity provenance, not proof of continuity from matching labels. Preserve the existing ordinary-edit mapping; refuse the ambiguous recreation until explicit reviewed provenance distinguishes restoration/revert from a new entity. Do not silently choose either old or new identity.

# Suspected Cause

src/graph/identity_migration.ts planLegacyIdentityMigration looks up current QIDs in the accepted ancestor and checks only path/type. It does not examine intervening deletion/recreation history before deriving accepted-ancestor identity. Existing renamed-path tests do not cover reuse of the same path.

# Fix Plan

Add bounded, read-only ancestor-to-current lineage inspection and report ambiguous disappearance/reintroduction before any mutation. Extend existing migration provenance/decision machinery only as needed; no numeric-offset workaround and no Git history rewriting. Handle committed and working-tree recreation, branch ancestry, renames, cherry-picks/reverts, shallow or incomplete history and unclassifiable histories explicitly. Source scope: src/graph/identity_migration.ts, identity_history.ts, identity_snapshot.ts and directly required migration CLI/provenance helpers, tests and docs. Do not add federation or reinterpret accepted v2 identities.

# Test Plan

- Same-path/alias deletion and distinct recreation blocks without writes.
- Genuine uninterrupted edits retain one ancestor identity.
- Explicitly proven restoration/revert preserves historical identity; intentional recreation gets a distinct identity only through approved mapping.
- Independent branch additions still receive origin-distinct identities; cross-links remain bound.
- Deterministic previews, stale decisions/history inputs, missing/shallow ancestry, Git-index preservation and bounded recovery.
- Verify exact installed candidate in test-483 and independent task-828. No fix is claimed at intake.

# Links / Artifacts

- .mdkg/artifacts/goal-83/task-824-contract-audit.json
- root:edd-81; root:test-483; root:task-828
- Private deep-contract receipt hash and frozen candidate identity are bound in the audit artifact.

## 2026-09-09 Local Remediation and Verification

Completed under Goal 84's existing local-only authority; owner mdkg-project-agent.
Migration now inventories full ancestor-to-HEAD DAG and boundary parents, staged
nodes and current authored state. Recorded disappearance, alias/path/type
excursions and contradictory merge lineage require a hash-bound per-QID choice:
restore-ancestor or new-identity. The latter derives a distinct origin-scoped
identity; both bind current structured references and preserve historical bodies.
Missing/shallow/grafted/partial history fails closed without fetching. Unrecorded
filesystem replacement with no Git trace remains explicitly unprovable.

Application/resume verifies lineage evidence; exact custody-checked rollback of
older journals remains possible. Compact per-QID observations avoid retained
full-history bodies and quadratic alias scans. Generated receipts must fit the
configured per-file, aggregate and count budgets before any application writes.
CLI --decisions help, command matrix and both graph-movement guides are aligned.

Evidence: chk-583 and .mdkg/artifacts/goal-84/bug-26-verification.json.
The corrected prepatch harness reproduced seven lineage/history failures with
15 passing controls. Final checks: 1271 ordinary tests on Node 26.0.0, 36 focused
tests on Node 24.18.0, 22 installed tests each runtime, and 26 release/security
contract tests pass. CLI/docs, full/changed graph, SQLite and diff checks pass;
three pre-existing stale-subgraph warnings remain. Independent functional review
found no directly introduced residual after its five findings were corrected.
This is not final task-828 security clearance or a 0.6.0 seal.

Bug-27 still owns full migration candidate/dependency validation, including
per-file bounds on expanded node content. Bugs 7/17/32 and final qualification
remain open. Protected Demo 3 bundle, runtime database, selection and unrelated
bundle work are unchanged. No new skill candidate, canonical migration, remote,
publication or provider action. Scoped local commit only; SQLite stays excluded.
