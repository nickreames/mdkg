---
id: chk-589
type: checkpoint
title: Verify installed graph recovery and record killed-writer limitation
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-7-graph-recovery.json]
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

Installed migration and reconciliation recover exactly from caught filesystem
errors at first/middle/last write boundaries on Node 24.15.0, 24.18.0 and 26.0.0.
Abrupt writer termination leaves a stale lock and requires further recovery work.
This milestone does not close bug-7, Goal 83 or publication readiness.

# Scope Covered

Bug-7 under the approved Goal 83/84 local qualification contract. Owner remains
mdkg-project-agent. Selected Goal 73, canonical graph identity and runtime state
are not changed to execute this work.

## Changed Surfaces

scripts/installed-graph-recovery.js, scripts/smoke-branch-conflicts.js, this
checkpoint, bug-7/Goal84 narratives, the graph-recovery artifact and required
index projections. No shipped runtime implementation changed.

## Boundaries

Synthetic disposable graphs, fixture-only local Git, installed package commands,
error injection and self-termination of an owned fixture child process. No
canonical migration, lock deletion, provider action, remote Git, publication,
consumer write or bundle refresh. No raw operational data in durable evidence.

# Decisions Captured

No new policy accepted. Preserve chk-588's outstanding version-adoption decision
and bug-17's public materialization decision. A dead-writer recovery route must
prove ownership safely; this milestone does not authorize automatic takeover.

# Implementation Summary

The existing manifest-backed branch smoke now executes a reusable installed-only
graph recovery helper. It interrupts real file creation, replacement or deletion
without changing package bytes or exposing a production failure flag. Exact
before/after content, Git index and unrelated files are checked after recovery.

# Test Proof

- Twelve cases per runtime: migration/reconciliation, resume/rollback, and three
  interruption boundaries. Migration has 14 operations; reconciliation has six,
  covering deletion, modification, creation, cross-links and receipt evidence.
- Midpoint user edits, dependency changes and Git-index movement refuse without
  writes. Interrupted rollback rejects resume, then finishes explicit rollback.
- Terminal repetition is observational; Unix journals retain mode 0600.
- A separate SIGKILL probe on Node 24.15.0/26.0.0 verifies the owned writer exited
  and its journal is inspectable. Resume times out on the preserved lock and
  changes no files. This is a recovery gap, not a passing crash-recovery case.

# Verification / Testing

## Command Evidence

Expanded installed smoke:branch-conflicts passes all three runtimes using the
same intermediate candidate SHA-256
5d72db2d486ab187eef8da487abd519e31700e6e41bb7420a18850216d3eba05.
Its transaction/migration/reconciliation modules match the current built files.

The six-file focused migration/reconciliation/baseline/release/security-contract
suite passes 118 tests with zero failures/skips. JavaScript syntax and diff checks
pass. Fresh CLI/docs, full/changed graph, SQLite and diff checks pass after
evidence writes. Full graph validation retains three bundle-age warnings. The prior
1341-test full-suite result is retained, not claimed as a new run here.

## Pass / Fail Status

Caught-error recovery milestone verified. Abrupt-termination recovery and legacy
writer compatibility remain open under bug-7; overall NOT_READY.

## Known Warnings

Fixture corrections: missing helper closing brace; staging new synthetic bytes
introduced a loose Git object into the harness inventory, so index perturbation
now toggles metadata only; temporary npm wrapper needed its explicit tool selector.
All final installed runs pass. These harness corrections are not shipped defects.

# Known Issues / Follow-ups

Source-ground the supported dead-writer recovery route without stealing a live
lock or assuming elapsed time proves abandonment. Continue the remaining installed
families, private migration rehearsal and scale checks. Final independent security
review, release documentation, coverage ladder and exact artifact seal remain.

## Follow-up Refs

bug-7, bug-17, task-826, task-827, task-828, task-829, task-830, goal-83, goal-84.

# Links / Artifacts

.mdkg/artifacts/goal-84/bug-7-graph-recovery.json; local diagnostics under
/private/tmp/mdkg-graph-recovery.lvWdKa. No remote evidence is asserted.

# Raw Content Safety

Compact synthetic case summaries, hashes and source pointers only. Canonical
skills reused: goal pursuit, pack-first execution and checkpoint verification.
No new skills authored; candidates none.
