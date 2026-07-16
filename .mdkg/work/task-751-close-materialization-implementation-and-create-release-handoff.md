---
id: task-751
type: task
title: close materialization implementation and create v0.5.2 release handoff
status: done
priority: 1
parent: goal-66
prev: test-450
tags: [goal-66, closeout, release-handoff, 0.5.2]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [test-450]
blocks: []
refs: [goal-66]
context_refs: [edd-73, dec-75, dec-76, dec-77, dec-78]
evidence_refs: [chk-530, chk-531, chk-532]
aliases: [materialize-implementation-closeout]
skills: [verify-close-and-checkpoint]
created: 2026-07-11
updated: 2026-07-15
---

# Overview

Consume the completed implementation and `test-450` audit, record the local
release-candidate checkpoint, close `goal-66`, and hand exact sanitized inputs
to the fixed `mdkg@0.5.2` release lane.

# Acceptance Criteria

- Every scoped implementation task and test is done with command evidence.
- Source, generated contract, docs, package, and installed-tarball behavior
  agree; clone compatibility and no-push invariants pass.
- Built-in security verification and focused materialization regressions have
  zero unresolved known findings, and every local gate in `test-450` passes.
- The failed Codex Security attempt is recorded as out of scope and is not
  represented as a completed clean scan.
- Checkpoint records baseline and implementation commits, package/tarball hash,
  request/receipt schema refs, changed surfaces, validation, dirty state,
  no-push/no-publish/no-version-bump status, known warnings, and residual risks.
- Final recommendation is exactly `ready for goal-67 v0.5.2 release execution`
  or `not ready` with blocking gaps.
- Goal evaluation is achieved only for the ready outcome.

# Implementation Notes

Do not bump version, publish, push, tag, deploy, replace the global install, or
apply the real-root upgrade.

# Test Plan

- `test-450`
- `node dist/cli.js goal evaluate goal-66 --json`
- final graph validation and `git diff --check`

# Completion Evidence

- Baseline planning commit:
  `d78892a53c72c85f1c74489e5b057074f5a1b8bb`.
- Goal-66 implementation commit:
  `f657a1b3e82388050aeeef39a188d4eaca0a2bf9`.
- Version-neutral package: `mdkg@0.5.1`, 191 files, 425438 packed bytes,
  npm dry-run shasum `9a667d7b7a2e331e43e772219ccb4430212ed1e3`,
  and actual tarball SHA-256
  `3bb169fa58ee28553f40fc5f224fa8d617b863c5173c608c8842a02c19af9728`.
- Generated command-contract hash:
  `35e7a82190d09c19eb3c8823980d8f2b33b6a3aadfc4cf7f8c6f8249fadcdd71`.
- Public schemas: `mdkg.git.materialize.request.v1` and
  `mdkg.git.materialize.receipt.v1`.
- Final gate replay passed `npm ci`, `npm run prepublishOnly` including 658/658
  source tests and 13/13 public-release/security tests, docs build with 33
  pages, built-in security verification, focused 17/17 materialization tests,
  isolated pack dry-run, prior equivalent-payload publish dry-run, installed
  tarball materialization and clone compatibility, graph validation, and diff
  checks.
- Failed Codex Security scan
  `4956a227-c1c0-4309-98d0-1e65687fab71` is retained only as partial discovery
  evidence in `chk-530`; the operator removed the broken plugin from scope.
- No version bump, real publish, push, tag, deployment, global replacement, or
  real-root upgrade occurred. The implementation commit remains local on
  `main`; Goal 67 owns all `0.5.2` release mutations and final gate replay.
- Residual risk: registry/version-specific proof is necessarily deferred until
  Goal 67 prepares `0.5.2`; post-publication failures remain fix-forward.
- Final recommendation: `ready for goal-67 v0.5.2 release execution`.

# Files Affected

- Goal-66 closeout state, release-handoff evidence, and one milestone
  checkpoint only.

# Links / Artifacts

- `goal-67`, `test-450`, and the final packed-package/security receipts.
