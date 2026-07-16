---
id: test-413
type: test
title: contained atomic destination cancellation and cleanup contract
status: done
priority: 1
parent: goal-66
tags: [goal-66, test, containment, atomicity]
owners: []
links: []
artifacts: []
relates: [task-748]
blocked_by: [task-748]
blocks: []
refs: [goal-66, dec-76]
context_refs: [edd-73]
evidence_refs: []
aliases: [materialize-atomic-destination-test]
skills: []
cases: [existing-target, dirty-target, path-escape, symlink-escape, partial-clone, cancellation, atomic-rename]
created: 2026-07-11
updated: 2026-07-15
---

# Overview

Prove no unsafe or partial source tree can be mistaken for an accepted
destination.

# Target / Scope

- Destination resolver, temporary workspace, cleanup, and acceptance rename.

# Preconditions / Environment

- Temporary filesystem fixtures with symlink and interruption controls.

# Test Cases

- Absolute, parent, symlink, and root escape rejection.
- Existing empty/nonempty/dirty destination rejection without repair.
- Git failure, timeout, SIGINT/SIGTERM, and post-clone mismatch cleanup.
- Successful same-parent atomic rename and no leftover temp paths.

# Results / Evidence

- Focused compiled tests reject absolute, parent, linked-parent, existing-empty,
  and existing-nonempty destinations; Git/ref/revision/policy failures leave no
  accepted destination or bounded temporary source path.
- Success publishes only through a same-parent rename after every check passes.
  A controlled SIGTERM cancellation terminates the Git process group, reports
  `cancelled`, removes temporary state, and leaves no accepted destination.
- V1 has no internal timeout request field. Caller timeouts are enforced through
  the same cancellation signal path proven by the interruption fixture.

# Notes / Follow-ups

- Receipts must distinguish cleanup-complete from cleanup-failed.
