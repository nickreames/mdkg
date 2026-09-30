---
id: chk-645
type: checkpoint
title: Isolate installed DB and SQLite fixtures from ambient Git state
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/task-838-db-smoke-caller-progress.json]
relates: [goal-86, task-838]
blocked_by: []
blocks: []
refs: [dec-97, chk-644, goal-85, bug-60, test-487, task-828, task-829, task-830]
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-838]
created: 2026-09-22
updated: 2026-09-22
---
# Summary

Seven installed DB/SQLite fixture callers now use shared owned Git/Node/npm
dispatch, verified candidate installation and cleanup. A reviewer-identified
ambient Git-ignore gap is reproduced, corrected and independently source-reviewed.
Goal86 remains active on Task838, 26/47 scoped records done, NOT_READY.

# Scope Covered

Task838 partial implementation/qualification milestone, not task or release closure.

## Changed Surfaces

- scripts/smoke-db.js, smoke-db-events.js, smoke-db-materializer.js,
  smoke-db-queue.js, smoke-db-queue-cli.js, smoke-db-snapshot.js and smoke-sqlite.js.
- scripts/qualification-git.js; tests/qualification-git.test.mjs and
  tests/qualification-smoke.test.mjs.
- Task838/Goal86, this checkpoint, sanitized evidence and required projections.

## Boundaries

One repository writer mdkg-project-agent, supported scoped goal claim; no
persistent runtime lease. Current continuation corrected the shared helper/test
and qualified the preserved seven-caller draft. Existing Bug60 source, skill
changes and unrelated custody stay untouched. No canonical build, package-input
change, native/Rust/Bun work, Linux/service/CI action, blocked-context recovery,
remote/provider/deployment, bundle refresh, staging, commit or publication.

# Decisions Captured

Dec97 and selective testing remain unchanged. Future native/Linux epics do not
waive current release gates. No new skills or skill candidates.

# Implementation Summary

- All seven legacy wrappers reproduced Git-index redirection into an owned
  synthetic sentinel rather than the intended fixture. No real external Git
  repository was mutated.
- Deferred offline installation now follows exact independent tarball admission;
  selected Node, private npm config/cache, Git custody, verified after-use bytes
  and finalization are shared with already-qualified callers.
- check-ignore accepts explicit contained paths only. Exit0 means ignored;
  exit1 means unignored. Fatal/error statuses are not commit-eligibility proof.
- The bounded reviewer found Git's default HOME/XDG excludes remain active even
  with global config disabled. Synthetic XDG, HOME-fallback and repository-local
  core.excludesFile cases reproduced false ignore acceptance without .gitignore.
- Pin core.excludesFile to os.devNull for fixture Git. Regression controls retain
  authored .gitignore/info-exclude rules, unchanged observational inventories,
  and successful SQL staging. Source follow-up found no remaining concrete gap
  in this correction; it is not Standard or Task828 acceptance.

# Test Proof

- Intermediate tarball SHA256:
  058e981a86fee0e3902ab262eeedc1ac6ac59f7593ffd1f3c5d7ed8b8fc4c951.
  Reused unchanged; no repack, canonical prepack/build or final seal.
- All seven installed smokes pass on macOS arm64 Node24.15.0,24.18.0,26.0.0:
  21 runs, with all original DB/event/reducer/materializer/queue/snapshot/index
  scenarios retained. Internal-helper scenarios import the installed package,
  not checkout source; they are not exclusively public CLI exercises.
- Eight affected fixture/artifact/output/coverage/CI/ladder files pass128/128
  per runtime, zero failures/skips. Exact case names, source/runtime/log hashes,
  structured script results and timings are in the durable JSON.
- All candidate hashes, source fingerprints and poisoned sentinel inventories
  match. Each owned execution root was cleaned after supervised work ended.
  Diagnostic logs remain under /private/tmp/mdkg-task838-db-smokes.pvzymz.
- Native Linux/Windows, actual pinned0.5.2 upgrade and final release acceptance
  are not established by these runs. Node supervision is not an OS sandbox.

# Verification / Testing

## Command Evidence

- The three new ambient-ignore regressions failed before the fix and pass after.
  A test-only missing .git/info setup directory was corrected before final runs;
  no failing source behavior was waived. Initial125-check runs predated the
  correction and are superseded by the final128-check receipts.
- Each runtime executed qualify.cjs against installed bytes, followed by the
  eight-file affected selection. Syntax checks and git diff --check pass.
- Full suite, coverage floors89/77/96, full ladder and exact final installed
  qualification remain required at their existing acceptance boundaries.

## Pass / Fail Status

PARTIAL / NOT_READY. Full graph validation passed with zero errors and three
existing stale-import warnings; changed-only validation passed with zero errors
or warnings. All five projections are fresh; SQLite index verification and
git diff --check pass. No Task838, Goal86 or publication completion is inferred.

## Known Warnings

Three existing stale imported-graph warnings remain; refresh is excluded.

# Known Issues / Follow-ups

Eighteen remaining legacy caller candidates are inventoried in the JSON; classify
their actual scenarios and preserve intentional hostile-environment tests rather
than counting search matches as defects. Task838 remains active for this inventory,
installed/final evidence and retained candidate custody.

Bug60's Node-only observation design remains pending; its known failing regression
is untouched. Bugs46/47, missing local published-baseline bytes, Linux evidence,
final release guidance/review/ladder/seal remain open. Goal85 stays paused.

## Follow-up Refs

Task838, Task839, Bug60, Test487, Task828, Task829, Task830; Goal85 paused.

# Links / Artifacts

.mdkg/artifacts/goal-86/task-838-db-smoke-caller-progress.json binds current
and pre-fix source hashes, synthetic reproductions, three runtime receipts,
case names, reviewer disposition, custody and remaining obligations.

Main remains c10113489381badf2845fc378c49b317376f953e; cached origin/main67
ahead/0 behind, not remotely verified. Selected Goal73/runtime DB/Demo3 bundle
and non-owned prior changes remain preserved. No commit or persistent lease.
Evidence artifact SHA256:
0d488a683d914ea591b4c65919e8271c09082136fd6405ea88af6222da0b94de.

# Raw Content Safety

Sanitized synthetic evidence only; no raw security reports, credentials,
operational payloads, blocked context or reconstructed historical bodies.
