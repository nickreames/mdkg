---
id: chk-649
type: checkpoint
title: Qualify remaining release smoke callers and retain intermediate candidate custody
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: []
links: []
artifacts: [.mdkg/artifacts/goal-86/task-838-tail-smoke-progress.json]
relates: [task-838, goal-86]
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

The last three identified release-manifest smoke callers use owned fixture
cleanup. All pass with their original cases on three local macOS arm64 Node
runtimes. The exact intermediate candidate has a hash-verified, Git-ignored
private local copy; it remains unsealed and uncommitted.

# Scope Covered

`root:task-838` fixture qualification; no package runtime behavior changed.

## Changed Surfaces

- `scripts/smoke-capabilities.js`, `scripts/smoke-parallel.js`, and
  `scripts/smoke-visibility.js`: owned runners and machine-readable receipts.
- `tests/qualification-smoke.test.mjs`: focused structural regression.
- Task838, this checkpoint, and sanitized progress JSON.
- Ignored private copy of the unsealed tarball under
  `.mdkg/artifacts/goal-86/private/`.

## Boundaries

- In scope: local release fixture custody, installed candidate admission,
  poisoned ambient Git controls and owned cleanup.
- Out of scope: blocked historical security context, full ladder, final
  artifact seal, hosted/Linux qualification, publication and remote Git.
- No raw secrets, provider payloads or bulky traces were added to Git.

# Decisions Captured

Dec97 keeps this pass Node-only and local-only. The user's instruction not to
recover or rerun inaccessible historical findings remains in force.

# Implementation Summary

Capabilities keeps root/child registry and observational-cache checks;
visibility keeps archive/pack/subgraph refusal checks against verified
installed bytes; parallel keeps 32 SQLite and16 JSON concurrent writers inside
one supervised worker. Source inventory now finds no raw spawnSync/mkdtempSync
in release-manifest smoke entrypoints except deliberate generated hostile-Git
shim text already qualified under chk648.
The independent read-only review found a directly invocable parallel worker;
supervisor and per-run token admission now refuses it before graph writes.
The reviewer also limited the visibility no-repack claim to the proxy-qualified
release run; standalone invocation may run canonical package prepack.

# Test Proof

- Test target: three release smokes and 101 focused checks on each of
  Node24.15.0, Node24.18.0, and Node26.0.0, macOS arm64.
- Fixture: three owned execution roots under `/private/tmp`, each with a
  poisoned ambient Git sentinel; every nested and outer root removed.
- Candidate SHA256: `058e981a86fee0e3902ab262eeedc1ac6ac59f7593ffd1f3c5d7ed8b8fc4c951`.
- Coverage gaps: full release ladder, independent final security review,
  Linux qualification, and Task830 seal remain separate gates.

# Verification / Testing

## Command Evidence

- Per runtime: run the bounded `qualify.cjs` receipt driver against the three
  smoke entrypoints and four affected test files. All three returned exit0,
  101/101 tests, zero failures/skips, stable candidate/source/sentinel hashes,
  and successful inner/outer cleanup.
- Exact corrected local receipt SHA256 by runtime: 24.15.0
  `994b20cd7cddc733182ce2d70be4adcacc99604fced51a65358cd9c865bde286`;
  24.18.0 `a1ad7f28019d1260681cd73a8cef4468a2abf61df86e6741409bfab1b6ca0bf1`;
  26.0.0 `cdb1ae9b47a4486e64a051e957cfce3a7c9d8e3a4b3db520a2748327808ea059`.
- The earlier 100-check runs are superseded by this correction and rerun.
- Intermediate tarball copy and original both hash to the candidate SHA256.
- After index refresh, full graph validation passed with zero errors and three
  pre-existing stale imported-subgraph warnings; changed-only validation passed
  with zero errors/warnings, all five DB index projections verified fresh, and
  `git diff --check` passed. Nothing was staged.

## Pass / Fail Status

- status: LOCAL_FIXTURE_PASS, RELEASE_NOT_READY.

## Known Warnings

- Three preserved stale imported-subgraph age warnings are not refreshed.
- Direct standalone visibility smoke is not certified as a no-repack run;
  only the release npm-proxy execution is covered here.

# Known Issues / Follow-ups

- Task838 must still assess its complete acceptance contract; local fixture
  success is not final release acceptance.
- Fresh Standard security coverage, independent diff review, final platform
  evidence and exact artifact seal remain prerequisites for Goal86 closeout.

## Follow-up Refs

- `root:task-838`, `root:task-828`, `root:task-829`, `root:task-830`,
  `root:test-487`, `root:goal-86`.

# Links / Artifacts

- `.mdkg/artifacts/goal-86/task-838-tail-smoke-progress.json`.
- No PR, commit, push, tag, release or provider action.

# Raw Content Safety

This checkpoint records paths and hashes only; raw execution logs stay local
under the private disposable-receipt root.
