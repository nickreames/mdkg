---
id: chk-643
type: checkpoint
title: Isolate installed smoke callers and separate published baseline provenance
checkpoint_kind: implementation
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/task-838-smoke-caller-progress.json]
relates: [goal-86, task-838, dec-97]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-838]
created: 2026-09-22
updated: 2026-09-22
---
# Summary

Verified another bounded Task838 caller increment on local Node24.15.0,
24.18.0 and26.0.0/macOS arm64. Final affected checks pass117/117 per runtime;
installed branch/collaboration and12 graph-recovery cases pass per runtime.
Seven current-upgrade scenarios pass per runtime. Actual published0.5.2 upgrade
remains unverified: the smoke intentionally stops at an absent local baseline,
without a download. Task838/Goal86 remain active; publication NOT_READY.

# Scope Covered

Explicit Goal86 local Node-only continuation, owner mdkg-project-agent. The
preceding goal turn verified status without implementation; this turn advances
the active Task838. No blocked historical security context was accessed.

## Changed Surfaces

- scripts/qualification-smoke.js, qualification-fixture.js, qualification-process.js
- scripts/smoke-branch-conflicts.js and smoke-upgrade.js
- scripts/installed-identity-collaboration.js, installed-graph-recovery.js,
  installed-upgrade-recovery.js and npm-smoke-proxy.js
- tests/qualification-smoke.test.mjs and qualification-artifact.test.mjs
- Task838, Goal86, this checkpoint, sanitized evidence and required projections.

## Boundaries

- In scope: trusted local qualification tooling, synthetic disposable repos,
  installed intermediate package, selective checks and one read-only reviewer.
- Out of scope: shipped-runtime changes, Bug60 redesign, Rust/Bun/native bridges,
  Linux/hosted work, blocked-context recovery, source/package regeneration,
  remote Git, publication/providers, canonical branch/history/bundle changes,
  consumer/root/sibling writes and unrelated cleanup.
- No credentials, operational payloads or recovered Demo3 application payloads.

# Decisions Captured

Dec97 and Task840's selective-test cadence remain in force. Deferral is not a
security waiver or Linux proof. No new product or runtime decision was made.

# Implementation Summary

Both legacy direct callers staged into an ambient sentinel index in a bounded
before-fix probe of their actual function bodies. They now use explicit owned
Git roots, isolated npm config/cache and selected-runtime Node dispatch.

# Implementation Details

- Installed helper children also use shared process supervision. Fault preloads
  and ordinary nonzero refusals remain valid; timeout/signal cannot masquerade
  as an expected semantic refusal. Cleanup waits for supervised shutdown.
- Published0.5.2 consumption now has its own source-pinned size/digest checks and
  before/after receipt, separate from current-candidate delivery. Exact declared
  artifact/offline argument admission rejects extra packages and option overrides.
- Synthetic test-only pin injection exercises the real proxy path; production
  cannot accept environment-supplied replacement pins. Synthetic evidence is
  not a real published-package installation.
- No public mdkg Git wrapper or new runtime capability was introduced.

# Verification / Testing

## Command Evidence

- Eight focused fixture/artifact/output/coverage/CI/ladder files pass117/117 on
  each runtime, no failures/skips:6.373s,6.344s,6.398s wall time. Full discovery
  remains172 files; full suite/coverage ladder was not rerun, floors89/77/96 unchanged.
- Installed branch smoke passes in136.080s,142.198s,141.961s respectively with
  the original identity/reconciliation and12 recovery cases. Each poisoned
  ambient sentinel remains unchanged. Owned execution roots were cleaned.
- Current-upgrade scenarios pass before the deliberate missing-baseline stop:
  missing managed files, custom root guidance, old templates, legacy SPEC,
  sibling manifest conflict, custom spike template and ignored events.
- Same intermediate tarball SHA256
  058e981a86fee0e3902ab262eeedc1ac6ac59f7593ffd1f3c5d7ed8b8fc4c951;
  no repack or canonical build. Installed runs predate only the final baseline
  argument parser correction, a path those runs do not reach. Final focused
  tests cover that correction and the actual fixed baseline caller arguments.
- One bounded read-only reviewer identified transitive/process and baseline
  provenance gaps, then the parser gap. Regressions cover corrections; the final
  source follow-up found no remaining defect in that bounded correction.
- One test cleanup-order error was corrected. A local inventory trim bug omitted
  one mirror hash; corrected parsing and prior snapshot/canonical parity prove
  that mirror unchanged. These harness errors are not release evidence.

## Pass / Fail Status

Executed graph validation: full zero errors/three preserved stale-import
warnings; changed-only zero errors/warnings. All five index projections are
fresh and SQLite verification passes. git diff --check passes. Final custody
is69 dirty paths, nothing staged, unchanged HEAD; no mutation/Git-index locks.
All prior non-owned changes and the three protected selection/runtime/Demo3
hashes match their entry evidence. Only the enumerated Task838 code/evidence
and required projection paths changed in this increment.

PARTIAL / NOT_READY. Full installed upgrade/recovery, complete Task838 caller
coverage, final review, ladder and seal remain required.

## Known Warnings

Three preserved stale imported-graph warnings; no bundle refresh authorized.

# Known Issues / Follow-ups

- Continue the remaining fixture inventory; begin fix-plan/loop/handoff/
  command-docs/integration-ux/operator-health and then DB/SQLite callers. Retain
  intentional hostile-environment controls, not blanket environment suppression.
- The pinned published baseline was not supplied locally. No old blocked
  artifact was searched or recovered and no download was attempted.
- Bug60's failing regression/design question, Bugs46/47, Linux, independent
  final acceptance, full ladder and seal still prevent completion/publication.

## Follow-up Refs

Task838, Task839, Bug60, Test487, Task828, Task829, Task830; Goal85 remains paused.

# Links / Artifacts

- .mdkg/artifacts/goal-86/task-838-smoke-caller-progress.json binds exact source,
  installed/focused receipts, scenario results, timings, limitations and custody.
- /private/tmp/mdkg-task838-smoke-qual.DekR6L retains diagnostics, reproduction
  scripts and compact receipts; all owned execution roots were removed. The
  prior intermediate tarball is not a sealed release artifact.
- main stays c10113489381badf2845fc378c49b317376f953e, cached67 ahead/0 behind;
  no remote verification, staging or commit. All prior partial source/skill work,
  selected Goal73, runtime DB and Demo3 bundle remain preserved.
- Skills: grounded goal pursuit, pack-first execution, source-grounded diagnosis,
  selective verification/checkpointing. New skill candidates:none. No persistent
  runtime lease acquired; no selection change.

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw secrets, raw prompts, raw payloads, or bulky execution traces.
