---
id: test-418
type: test
title: published v0.5.2 registry installs commands and real-root upgrade contract
status: todo
priority: 1
parent: goal-67
next: task-790
tags: [goal-67, test, publish, install, upgrade, root, 0.5.2]
owners: []
links: []
artifacts: []
relates: [task-756, task-789]
blocked_by: [task-789]
blocks: [task-790]
refs: [goal-67, goal-66]
context_refs: [goal-66, goal-71]
evidence_refs: []
aliases: [published-materialize-install-test]
skills: []
cases: [registry-integrity, temp-install, global-install, materialize-matrix, clone-compatibility, init-loop-pack, root-upgrade-preview-apply, root-validation]
created: 2026-07-11
updated: 2026-07-15
---

# Overview

Prove immutable registry identity, clean installed-package behavior, global CLI
replacement, and safe managed upgrade of the real root graph before any push.

# Test Cases

- Registry version, latest/dist-tags, publication time, integrity, shasum,
  package size/count, and downloaded tarball agree with the publication receipt.
- Isolated-prefix install reports `0.5.2`; source/package help and generated
  contract agree.
- Disposable fixtures pass materialize success, representative strict failures,
  clone compatibility, init/status/validate, loop list/plan, goal next, pack
  dry-run, and Git inspect.
- `/opt/homebrew/bin/mdkg` resolves to the global `0.5.2` installation.
- Real-root upgrade preview is safe with no blocking conflicts before apply;
  local customizations are preserved and every write/skip/conflict is recorded.
- Post-apply index, status, skill validation, full/changed-only validation,
  doctor, read-only command probes, and diff checks pass.
- No push, tag, deployment, unpublish, rollback, or unrelated root mutation.

# Results / Evidence

- Pending post-publish execution. Any failure blocks `task-790`.
