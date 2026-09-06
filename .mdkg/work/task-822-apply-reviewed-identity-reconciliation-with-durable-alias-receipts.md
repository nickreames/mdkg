---
id: task-822
type: task
title: Apply reviewed identity reconciliation with durable alias receipts
status: todo
priority: 1
epic: epic-83
parent: goal-82
tags: [alignment-002, implementation-unapproved]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-821]
blocks: []
refs: [edd-81, dec-93, goal-17, test-151]
context_refs: []
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-09-05
updated: 2026-09-05
---

# Overview

Complete the identity slice with reviewed reconciliation, durable mappings,
strict graph validation and recoverable application. Future implementation only.

# Acceptance Criteria

- Fixed ancestor/target/incoming inputs produce deterministic classification and
  an exact authored-path plan. Preserve target aliases for distinct identities.
- Same-identity divergent lifecycle/evidence changes need explicit decisions.
- Bind apply to the reviewed plan/hash and unchanged revisions/worktree/index
  fingerprints. Preflight full mapping/reference safety before any write.
- Rewrite only proven identity-bound references; ambiguous legacy references block.
  Do not alter immutable external receipt bodies or arbitrary text substrings.
- Persist alias/path/origin mappings and strict validation results in receipts.
  Repeated integration/cherry-pick is idempotent; reverts do not silently resurrect.
- Generated indexes are rebuilt from authored results, bundles excluded.
  A tolerant rebuild is not success proof.
- No implicit Git stage/merge/rebase/commit/push or history rewrite.

# Files Affected

Future repair/reconcile implementation, shared reference rewriting, receipt
schema and disposable integration fixtures.

# Implementation Notes

Before applying, classify every path as authored in-scope, generated, immutable
evidence or unrelated. Inject failures to prove bounded recovery and custody.
Repeated mappings must not allocate another alias for already integrated identity.
No current Demo graph repair or canonical Git integration is part of this task.

# Test Plan

test-476 and test-151: offline cross-linked branches, same-node conflicts, repeated
integration, cherry-pick/revert, external receipt refs, stale plan, ambiguity,
partial failure, index rebuild and no staging. Goal 82 requires the full matrix.

# Links / Artifacts

- edd-81, goal-17, goal-82; evidence pending.
