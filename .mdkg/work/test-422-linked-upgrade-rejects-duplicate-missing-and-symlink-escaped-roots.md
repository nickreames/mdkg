---
id: test-422
type: test
title: linked upgrade rejects duplicate missing and symlink escaped roots
status: todo
priority: 1
parent: goal-68
tags: [goal-68, test, containment, identity]
owners: []
links: []
artifacts: []
relates: [task-758, task-759]
blocked_by: [task-759]
blocks: []
refs: [goal-68]
context_refs: [edd-73, dec-79]
evidence_refs: []
aliases: [linked-upgrade-containment-test]
skills: []
cases: [duplicate-canonical-root, missing-git, missing-mdkg, nested-root, symlink-escape, absolute-include]
created: 2026-07-11
updated: 2026-07-11
---

# Overview

Prove repository identity and containment are validated before planning or
apply.

# Target / Scope

- Selector path normalization and repository preflight.

# Preconditions / Environment

- Temporary nested, duplicate, missing, and symlinked path fixtures.

# Test Cases

- Duplicate aliases/paths resolving to one root fail.
- Missing Git root or `.mdkg/config.json` fails.
- Absolute, parent, nested, and symlink escapes fail.
- Failure emits bounded target identity and no external absolute path.

# Results / Evidence

- Pending implementation.

# Notes / Follow-ups

- No automatic repair or registration.
