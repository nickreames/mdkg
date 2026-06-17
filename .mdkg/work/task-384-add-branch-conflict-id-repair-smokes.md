---
id: task-384
type: task
title: add branch conflict id repair smokes
status: done
priority: 2
epic: epic-91
parent: goal-17
tags: [0.3.4, smoke, branch-conflict]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-383]
blocks: [test-162, test-163, test-164, task-385]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Add temp-repo smokes that create duplicate IDs across branches and repair them.

# Acceptance Criteria

- Two-branch smoke creates deterministic duplicate IDs.
- Repair preserves links.
- Conflict-stage scenario is covered.

# Files Affected

- scripts/**
- package.json

# Implementation Notes

- Use real git operations in temp dirs.
- Do not mutate the current repo graph.

# Test Plan

- Run smoke directly and through prepublish.

# Links / Artifacts

- Add command receipts, validation output, and checkpoint ids during execution.
