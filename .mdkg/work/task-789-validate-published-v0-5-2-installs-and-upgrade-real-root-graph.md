---
id: task-789
type: task
title: validate published v0.5.2 installs and upgrade the real root graph
status: done
priority: 1
parent: goal-67
prev: task-756
tags: [goal-67, postpublish, install, upgrade, root, 0.5.2]
owners: []
links: []
artifacts: [/private/tmp/mdkg-0.5.2-postpublish, /private/tmp/mdkg-0.5.2-installed-validation-4VIviC]
relates: [goal-67]
blocked_by: [task-756]
blocks: [test-418]
refs: [goal-67, goal-66, test-418, chk-535]
context_refs: [goal-71]
evidence_refs: []
aliases: [v0-5-2-installed-consumer-validation]
skills: [verify-close-and-checkpoint]
created: 2026-07-15
updated: 2026-07-15
---

# Overview

Prove the published package from clean temporary state, replace the real global
installation, then safely preview/apply and validate the managed upgrade of
this repository's real mdkg graph.

# Acceptance Criteria

- Install `mdkg@0.5.2` under `/private/tmp/mdkg-0.5.2-postpublish` with an
  isolated prefix and cache; verify version, `git`/`materialize` help, generated
  contract, and package provenance.
- In disposable workspaces, pass init, status, validate, loop list/plan, goal
  next, pack dry-run, Git inspect/clone compatibility, materialization success,
  and representative identity/auth/containment/submodule failures.
- Install `mdkg@0.5.2` globally and prove `/opt/homebrew/bin/mdkg` resolves to
  version `0.5.2`.
- Capture a clean real-root baseline, run `mdkg upgrade --json`, and apply only
  when `safe_to_apply` is true and `blocking_conflicts` is empty. Preserve all
  local customizations and classify every write, skip, or non-blocking conflict.
- Rebuild indexes and run status, skill validation, full/changed-only graph
  validation, doctor, read-only goal/loop/pack/Git commands, and diff checks.
- Commit only intended managed upgrade or graph evidence changes; do not push in
  this task.

# Test Plan

- `test-418`

# Completion Evidence

- Attach temp/global install, command-probe, root before/after, upgrade, and
  validation receipts without raw local secrets or bulky payloads.

# Files Affected

- Temporary/global npm installation state, safe managed real-root upgrade
  outputs, intended graph evidence, and generated ignored indexes.

# Implementation Notes

- Preview first and apply only the receipt approved by `safe_to_apply` with no
  blocking conflicts; preserve unrelated dirtiness and local customizations.

# Links / Artifacts

- `test-418` and the published npm integrity receipt.
