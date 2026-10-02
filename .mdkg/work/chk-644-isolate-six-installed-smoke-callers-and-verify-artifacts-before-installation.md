---
id: chk-644
type: checkpoint
title: Isolate six installed smoke callers and verify artifacts before installation
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/task-838-six-smoke-caller-progress.json]
relates: [goal-86, task-838]
blocked_by: []
blocks: []
refs: [dec-97, chk-643, goal-85, bug-60, test-487, task-828, task-829, task-830]
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-838]
created: 2026-09-22
updated: 2026-09-22
---
# Summary

Task838 makes verified partial progress without changing the Node.js/local-only
contract. Six remaining installed smoke callers now use the shared owned
Git/Node/npm boundary, private npm state, verified installation and safe cleanup.
Goal86 remains active on Task838,26/47 scoped records done, NOT_READY.

# Scope Covered

## Changed Surfaces

- scripts/smoke-fix-plan.js
- scripts/smoke-loop.js
- scripts/smoke-handoff.js
- scripts/smoke-command-docs.js
- scripts/smoke-integration-ux.js
- scripts/smoke-operator-health.js
- scripts/qualification-smoke.js and tests/qualification-smoke.test.mjs
- Task838/Goal86, this checkpoint, sanitized evidence and required projections.

## Boundaries

One writer mdkg-project-agent; supported goal claim, no persistent DB lease.
No Bug60 source changes, Rust/Bun/native implementation, Linux services/CI,
blocked-context access, old security report recovery, canonical build/migration,
bundle refresh, source feature work, remote/provider/deployment or publication.
No canonical branch switch, staging, commit or consumer/root/sibling writes.

# Decisions Captured

Dec97 and the selective validation policy remain unchanged. Future native/Linux
epics do not waive filesystem/platform acceptance. No new skill candidates.

# Implementation Summary

- All six legacy command wrappers reproduced inherited Git-index redirection:
  the intended fixture target was not staged, while its separate owned sentinel
  index changed. No real external repository was touched.
- Reuse shared literal-Git custody, selected Node/process supervision and private
  npm config/cache. Retain expected failure statuses and every original scenario.
- Pack/deliver from an owned cwd with explicit source; install offline into the
  fixture prefix. Normal standalone pack can still run source lifecycle scripts;
  actual qualification used the immutable-artifact proxy, not canonical prepack.
- Shared runInstalledSmoke admits independent tarball bytes before deferred
  installation and verifies them after installation/exercise, including errors.
  Compound errors remain visible; final success follows owned cleanup.
- A bounded reviewer found the initial standalone install-before-hash gap.
  Synthetic reproduction confirmed incorrect acceptance, and regressions verify
  successful/failed installer mutation is rejected. Source follow-up found no
  remaining concrete defect in the correction; this is not Task828 clearance.

# Test Proof

- Exact intermediate tarball SHA256:
  058e981a86fee0e3902ab262eeedc1ac6ac59f7593ffd1f3c5d7ed8b8fc4c951.
  Same bytes as chk643; no package-input edit, repack or final seal.
- Final installed six-smoke batch passes on macOS arm64 Node24.15.0,24.18.0
  and26.0.0. Eighteen script runs retain installed payload, CLI/help/docs,
  loop template/dry-run, graph/handoff/redaction, workflow/queue and operator
  lifecycle controls. Original actual0.5.2 upgrade is not part of these scripts.
- Every sentinel inventory and candidate hash matches. All owned execution
  roots were individually cleaned; diagnostics and compact receipts remain in
  /private/tmp/mdkg-task838-six-smokes.2aDixy and the durable JSON evidence.
- Source fingerprints in the final receipts match current code.

# Verification / Testing

## Command Evidence

- Thirteen smoke-helper unit tests pass after correction.
- Eight affected fixture/artifact/output/coverage/CI/ladder files pass122/122,
  zero failures/skips, per local runtime. Wall times7.003s/7.632s/6.599s.
- Real six-smoke installed batch times24.138s/29.134s/29.554s respectively
  (sum of script durations; setup and focused tests are separate).
- First Node24.18 run passed six scenarios and121 focused checks before the
  review correction; retained as intermediate, superseded by final receipts.
- Two mechanical trailing-whitespace errors were corrected before final runs.
  Initial checkpoint command refused root-qualified --scope; local IDs were used.
- Full suite/coverage/ladder deferred to stable integration/final readiness,
  existing floors89/77/96 and discovery obligations unchanged.

## Pass / Fail Status

PARTIAL / NOT_READY. Full graph validation passes with zero errors and three
preserved stale-import warnings; changed-only passes with zero errors/warnings.
All five projections are fresh and SQLite index verification passes.
git diff --check passes. No task/goal closure or publication readiness asserted.

## Known Warnings

Three preserved stale imported-graph warnings; bundle refresh remains excluded.

# Known Issues / Follow-ups

Remaining Task838 callers include DB/SQLite and other legacy fixture wrappers;
the search inventory is not a vulnerability count. Actual pinned0.5.2 upgrade,
submodule-specific proof and final durable candidate qualification remain open.
Bug60's Node-only design question, Bugs46/47, Linux evidence, final independent
acceptance, full ladder and exact artifact seal still block Goal86 completion.

## Follow-up Refs

Task838, Task839, Bug60, Test487, Task828, Task829, Task830; Goal85 paused.

# Links / Artifacts

.mdkg/artifacts/goal-86/task-838-six-smoke-caller-progress.json contains exact
source hashes, reproductions, scenario families, all three runtime receipts,
log hashes, reviewer disposition and preserved custody.

Main stays c10113489381badf2845fc378c49b317376f953e, cached67 ahead/0 behind.
Selected Goal73/runtime DB/Demo3 bundle and all non-owned prior changes preserved.
No commit, push or remote verification. No persistent writer lease acquired.

# Raw Content Safety

Synthetic fixtures and sanitized summaries only. No raw reports, credentials,
private operational payloads, blocked context or reconstructed historical bodies.
