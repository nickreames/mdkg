---
id: test-178
type: test
title: import-template selected-goal activation and competing-goal pause contract
status: done
priority: 1
epic: epic-104
parent: goal-19
tags: [0.3.6, graph-import, selected-goal]
owners: []
links: []
artifacts: []
relates: [task-411]
blocked_by: [task-411]
blocks: []
refs: []
aliases: []
skills: []
cases: [Dry-run reports planned activation and paused goals without writes., Apply activates rewritten imported start goal and pauses competing active goals., Achieved or archived selected start goals fail before writing., Active imported goals without select-goal fail before writing.]
created: 2026-06-17
updated: 2026-06-17
---
# Overview

Validate that same-repo template import cannot leave invalid multiple-active-goal state.

# Target / Scope

- task-411

# Preconditions / Environment

- Unit tests use temp mdkg repos and public CLI command execution through the built test CLI.

# Test Cases

- Dry-run with an active local goal and active imported start goal reports planned activation and pauses with no file writes.
- Apply activates the rewritten imported goal, pauses the old active goal, selects the imported goal, and validates.
- Selecting an achieved or archived imported start goal fails before writes.
- Importing active template goals without `--select-goal` fails before writes with actionable guidance.

# Results / Evidence

- Record `npm run test` and focused test output during closeout.

# Notes / Follow-ups

- Keep broader validation rollback out of this test; this contract closes the known active-goal conflict path.
