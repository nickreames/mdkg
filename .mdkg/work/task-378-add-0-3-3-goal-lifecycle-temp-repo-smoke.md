---
id: task-378
type: task
title: add 0.3.3 goal lifecycle temp-repo smoke
status: todo
priority: 1
epic: epic-88
parent: goal-16
tags: [0.3.3, smoke, temp-repo]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-374, task-375, task-376, task-377]
blocks: [test-159, test-160, test-161, task-379]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Add a temp-repo smoke proving single-active, archived-goal, subgraph, and strict doctor behavior from a packed CLI.

# Acceptance Criteria

- Smoke creates a fresh repo and exercises goal activation.
- Smoke proves archived goals are non-actionable but readable.
- Smoke proves subgraph active goals remain independent.
- Smoke is included in prepublish gates.

# Files Affected

- scripts/**
- package.json
- tests/**

# Implementation Notes

- Use installed packed CLI, not internal imports.
- Keep stdout JSON clean for JSON commands.

# Test Plan

- Run new smoke directly.
- Run `npm run prepublishOnly`.

# Links / Artifacts

- Add command receipts, validation output, and checkpoint ids during execution.
