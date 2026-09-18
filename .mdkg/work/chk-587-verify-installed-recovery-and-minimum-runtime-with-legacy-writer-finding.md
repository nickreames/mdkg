---
id: chk-587
type: checkpoint
title: Verify installed recovery and minimum runtime with legacy writer finding
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-7-recovery-runtime.json]
relates: [goal-83, goal-84]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [bug-7]
created: 2026-09-09
updated: 2026-09-09
---
# Summary

Installed upgrade recovery and delete/evidence conflict checks pass on Node
24.15.0, 24.18.0 and 26.0.0. An actual old-client probe also confirmed a remaining
v2-adoption hazard. This checkpoint is test proof, not bug-7 or release closure.

# Scope Covered

Owned bug-7 installed qualification, public minimum-runtime download, synthetic
local clones, reviewed CLI operations and fixture-only filesystem fault injection.

## Changed Surfaces

scripts/installed-upgrade-recovery.js, scripts/installed-identity-collaboration.js,
scripts/smoke-upgrade.js and owned mdkg evidence/projections. No shipped runtime
implementation or canonical graph migration.

## Boundaries

No remote Git, push, tag, publication, provider/deployment, consumer changes,
bundle refresh or live runtime/selection writes. Public Node checksum/archive
downloads used explicit approved authority and isolated temporary locations.

# Decisions Captured

No new compatibility policy adopted. Bug-7 records old-client partial writes
against v2 and requires explicit disposition before publication. Bug-17's separate
legacy public-bundle decision is unchanged.

# Implementation Summary

Six installed upgrade interruptions per runtime exercise resume and rollback
after the first, middle and last writes of a real 40-operation historical upgrade.
Unknown files and Git bytes survive; changed user bytes block recovery. Three
additional branch cases cover both delete/modify directions and evidence conflicts.

# Test Proof

Official Node 24.15.0 darwin-arm64 archive and extracted executable match the
recorded hashes. Both expanded installed smokes pass on all three runtimes.
Minimum-runtime availability is resolved, not the full final-runtime matrix.

Old published 0.5.2 creates a legacy node and changes SQLite before returning
an error in a v2 fixture. Candidate validation detects the missing identities and
candidate mutation then refuses without writes. Reproduced on Node 24.15.0/26.0.0.
Existing authored nodes were not destroyed. No automatic risk waiver.

# Verification / Testing

## Command Evidence

- scripts/test-built.js: 1341 tests passed, no failures/skips.
- Baseline/release/security-contract subset: 20 passed, not security clearance.
- CLI/docs parity: pass, 494 examples and zero failures.
- Expanded smoke:upgrade and smoke:branch-conflicts: pass on three runtimes.
- Full/changed-only graph validation, SQLite verification and git diff --check:
  pass after evidence updates; full validation retains three bundle-age warnings.

## Pass / Fail Status

Qualification milestone verified; old-client compatibility finding remains open.
Bug-7 stays progress. Overall publication NOT_READY.

## Known Warnings

Three preserved canonical imported-bundle age warnings. Graph-only probe fixtures
also report absent native mirrors; these warnings are not counted as failures or
as full graph-only qualification.

# Known Issues / Follow-ups

Evaluate an enforceable old-writer compatibility barrier before v2 adoption, or
obtain explicit Nick acceptance of an all-writers-upgraded/no-mixed-writes policy.
Do not choose silently. Complete graph transaction recovery, remaining installed
families, private graph rehearsal, independent security review, release ladder,
metadata and exact artifact seal.

## Follow-up Refs

bug-7, bug-17, task-826, task-827, task-828, task-829, task-830, goal-83, goal-84.

# Links / Artifacts

.mdkg/artifacts/goal-84/bug-7-recovery-runtime.json binds checks, source and runtime
hashes. Compact local logs/harnesses and minimum runtime remain under
/private/tmp/mdkg-bug7-recovery.YDpsrx; disposable fixtures are removed.

# Raw Content Safety

Synthetic test inputs and compact hashes only; no credentials, real application
payloads, private scan reports or consumer operational receipts.
