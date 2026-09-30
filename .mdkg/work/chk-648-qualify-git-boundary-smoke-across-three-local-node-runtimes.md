---
id: chk-648
type: checkpoint
title: Qualify Git boundary smoke across three local Node runtimes
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/task-838-git-boundary-progress.json]
relates: [goal-86, task-838]
blocked_by: []
blocks: []
refs: [chk-647, goal-85, bug-60, test-487, task-828, task-829, task-830]
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-838]
created: 2026-09-22
updated: 2026-09-22
---
# Summary

The hostile Git boundary caller and its shared observation matrix now run under
an owned temporary fixture with supervised native Git and Node processes.
Installed qualification passed on local macOS arm64 Node 24.15.0, 24.18.0 and
26.0.0. Task838 remains progress; Goal86 remains active and 0.6.0 is NOT_READY.

# Scope Covered

Partial Task838 fixture custody and intermediate installed qualification. This
checkpoint does not seal the candidate or accept Task828 security review.

# Decisions Captured

Dec97's Node-only, local-only execution boundary still applies. The existing
288-case matrix, four topology controls and removed-command refusal probes
remain required. Selective tests were used during iteration; full release gates
are deferred to their owned acceptance boundary. New skill candidates: none.

# Implementation Summary

Migrated scripts/smoke-git-boundary.js, tests/fixtures/git-observation.cjs and
tests/commands/git_observation.test.ts to owned execution, private npm state,
artifact admission before installation, exact cleanup and preserved diagnostic
output. The shared Git fixture gained explicit native refresh, file URL backed
submodule setup and a bounded regular-file rename.

Read-only review found that the draft rename allowed moving submodule
directories. An owned synthetic reproduction showed that native Git could then
rewrite a gitdir outside the accepted root. The helper now refuses directories,
hard-linked files and existing destinations before invoking Git. A regression
binds the outside gitdir case; the regular-file positive control still passes.
This was a fixture-helper defect in the draft, not a new shipped finding.

# Verification / Testing

Each runtime passed the 288 observation cases across standalone, worktree,
submodule and separate Git-dir layouts, plus 153 affected tests with zero
failures or skips. Runtime smoke durations were 209773, 231386 and 223636 ms.
The same unsealed intermediate tarball SHA256
058e981a86fee0e3902ab262eeedc1ac6ac59f7593ffd1f3c5d7ed8b8fc4c951
was verified. Each receipt reports unchanged source/sentinel and completed
owned-root cleanup. The correction's two focused positive/negative tests passed.

Git diff --check and TypeScript no-emit typecheck passed. After this checkpoint
was created, full graph validation passed with zero errors and three existing
stale imported-graph warnings; changed-only validation passed with zero errors
or warnings, and all five SQLite index projections verified fresh.
Evidence includes source hashes and exact private temporary receipt hashes in
.mdkg/artifacts/goal-86/task-838-git-boundary-progress.json.

HEAD main remains c10113489381badf2845fc378c49b317376f953e, 67 ahead of
cached origin/main with no remote verification. At the milestone, the initial
110 dirty paths remained unchanged except three directly owned helper/test
paths; three previously clean caller/test paths became dirty. Staged paths:0.
Selected Goal73, runtime DB and private Demo3 bundle hashes match Chk647.

# Known Issues / Follow-ups

The asynchronous MCP installed smoke is the last distinct Task838 caller. Its
server lifecycle and cleanup must be bounded without dropping JSON/SQLite and
read-only parity scenarios. Bug60, Bugs46/47, Linux qualification, final
guidance, independent review, full ladder and artifact seal remain open.

# Links / Artifacts

.mdkg/artifacts/goal-86/task-838-git-boundary-progress.json.
No local commit, remote action or publication.
