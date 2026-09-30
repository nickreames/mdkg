---
id: chk-657
type: checkpoint
title: Bind installed CLI option qualification to owned fixtures and the release matrix
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/test-486-local-option-qualification.json]
relates: [test-486, bug-39, task-838, task-839, goal-86, dec-98]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [test-486]
created: 2026-09-28
updated: 2026-09-28
---
# Summary

Test486 has a current local installed-option qualification milestone. Its
existing refusal fixture is now executed by the manifest-backed command-matrix
smoke. Test486 remains progress; Goal86 remains active and NOT_READY.

# Scope Covered

One writer under Goal86/Dec98;150 inherited dirty paths accepted and preserved.
Main remains6d23981e70bc68798def73c81b9cd5fa7bc9f3df,69ahead cached origin/main.
No remote verification, staging or commit. The receipt binds exact owned hashes.

## Changed Surfaces

- scripts/qualification-smoke.js: expose immutable fixture identity/ownership.
- scripts/smoke-command-matrix.js: invoke installed option qualification.
- tests/fixtures/cli-options.cjs: owned process/Git dispatch and early admission.
- tests/installed-cli-options.test.mjs: controller and integration regressions.
- Test486, Goal86, requirement coverage, this checkpoint and required projections.

## Boundaries

- No shipped runtime or package-input change. No canonical branch/worktree,
  migration, bundle/subgraph refresh, provider, publication or blocked context.
- Disposable synthetic fixtures only; cleanup after supervised process shutdown.

# Decisions Captured

Dec98 remains governing. Bugs46/47 are DEFERRED / UNRESOLVED under paused
Goal87, not accepted/fixed. Goal85 remains paused with separate publication gate.

# Implementation Summary

Retain all existing refusals and positive controls while removing raw process
dispatch and hard-coded Git/null-device assumptions from the option fixture.
Bind the controller's actual live ownership root before any directory creation.
Keep API worker setup outside the no-effect inventory comparison window.

# Test Proof

- Node24.18.0/macOSarm64; normally packed and installed candidate0.6.0.
- SHA2566154e4ea920bfa09d57532171df808f3f406250b44b2b318f0bb48542f82cdca,
  identical to Task839's guidance-tested bytes. Both owned smoke fixtures removed.
-151 concrete commands,194 process refusals,388 direct-entrypoint refusals,
  41 unindexed-graph refusals and seven positive controls pass.166-entry
  fixture inventory, Git index and unknown-file sentinel are preserved.
- Four PATH traps record zero hits; this is not universal process instrumentation
  or a host-wide inventory. Exact final artifact and platform proof remain open.

# Verification / Testing

## Command Evidence

- Five focused harness files:107 tests pass,0fail/skip,7,757.713375ms.
- Installed command-matrix smoke passes before and after review correction;
  first run52,365.853292ms; final rerun elapsed time not instrumented.
- CI workflow and command-contract source checks, graph/SQLite and diff
  closeout results are bound in the receipt; no full-suite clearance inferred.

## Pass / Fail Status

- Local intermediate pass, not Test486 final acceptance or release readiness.
- One failing-before regression proves missing early controller admission.
- Independent narrow static review found mismatched controller/root admission;
  corrected with mismatch/released-controller tests and no remaining concrete
  defect evidenced on readback. Reviewer did not independently run the tests.

## Known Warnings

- Pre-existing imported-bundle freshness warnings remain; no refresh authority.

# Known Issues / Follow-ups

- Preserve selected Goal73, runtime DB, Demo3 bundle and draft-release hashes.
- No persistent lease acquired; transient mutation locks released at closeout.
- Do not turn the removed intermediate tarball into a final retained seal claim.

## Follow-up Refs

- Tests477-484/486-488, Tasks826/828/829/830 retain final qualification work.
- Skills reused: goal pursuit, pack-first execution and selective verification.
  New skill candidates:none.

# Links / Artifacts

- .mdkg/artifacts/goal-86/test-486-local-option-qualification.json
- Chk656, Task839, Bug39, Goal86, Dec98, paused Goals85/87.

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw secrets, raw prompts, raw payloads, or bulky execution traces.
