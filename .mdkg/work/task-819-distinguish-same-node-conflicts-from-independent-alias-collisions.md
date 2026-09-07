---
id: task-819
type: task
title: Distinguish same-node conflicts from independent alias collisions
status: done
priority: 1
epic: epic-83
parent: goal-82
tags: [alignment-002, execution-authorized]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
blocked_by: [task-363]
blocks: []
refs: [edd-81, dec-93, goal-17]
context_refs: []
evidence_refs: [chk-565]
aliases: []
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-09-05
updated: 2026-09-06
---

# Overview

First collaboration correctness increment: distinguish independently created
nodes from conflicting edits to one ancestor node before proposing alias repair.
This is not the complete identity slice. Execution authorized by the user's
explicit Goal 82 Run instruction; owned by mdkg-project-agent.

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

src/commands/fix.ts, tests/commands/fix.test.ts, src/cli.ts, CLI command matrix,
packaged repair smoke and the mirrored graph-movement documentation.

# Implementation Notes

Baseline behavior reproduced before implementation, including same-node splitting
and implicit Git staging. The corrected classifier and 27 focused fixtures pass;
see chk-565 for exact evidence and remaining identity-slice boundaries.

# Test Plan

Same alias different creation, same node disjoint/conflicting edits, deleted side,
renamed side, unresolved input, no-side-effect preview and unchanged Git index.
Covered further by test-476 and test-151.

# Links / Artifacts

- edd-81, goal-17, goal-82; test proof: chk-565.
