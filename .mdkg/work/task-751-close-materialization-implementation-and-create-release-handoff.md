---
id: task-751
type: task
title: close materialization implementation and create v0.5.2 release handoff
status: todo
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
evidence_refs: [chk-530, chk-531]
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

- Create one milestone checkpoint linked from both goals.

# Files Affected

- Goal-66 closeout state, release-handoff evidence, and one milestone
  checkpoint only.

# Links / Artifacts

- `goal-67`, `test-450`, and the final packed-package/security receipts.
