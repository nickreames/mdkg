---
id: task-819
type: task
title: Distinguish same-node conflicts from independent alias collisions
status: todo
priority: 1
epic: epic-83
parent: goal-82
tags: [alignment-002, implementation-unapproved]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-363]
blocks: []
refs: [edd-81, dec-93, goal-17]
context_refs: []
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-09-05
updated: 2026-09-05
---

# Overview

First collaboration correctness increment: distinguish independently created
nodes from conflicting edits to one ancestor node before proposing alias repair.
This is not the complete identity slice. Future implementation, unclaimed.

# Acceptance Criteria

- Reproduce add/add and modify/modify with matching aliases in disposable Git
  fixtures, including stage 1 ancestry. Modify/modify never becomes two nodes.
- Handle missing/ambiguous ancestry, delete/modify and rename cases explicitly.
- Stage roles are positional inputs, not an assumption that ours always means main.
- Unsupported/ambiguous cases are blocked with evidence; no speculative rewrites.
- Preserve prior Goal 17 success as history while adding missing regression proof.
- Reconciliation never stages automatically; audit existing fix apply's git-add
  side effect and make explicit authority visible in its compatibility behavior.

# Files Affected

Future src/commands/fix.ts and tests/commands/fix.test.ts; CLI contract if needed.

# Implementation Notes

Current source at baseline 9652b855 selects stages 2/3 and matching ids without
checking a shared ancestor first. This is static evidence, not a reproduced test
result. Complete the fixtures before changing classification.

# Test Plan

Same alias different creation, same node disjoint/conflicting edits, deleted side,
renamed side, unresolved input, no-side-effect preview and unchanged Git index.
Covered further by test-476 and test-151.

# Links / Artifacts

- edd-81, goal-17, goal-82; proof pending.
