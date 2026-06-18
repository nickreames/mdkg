---
id: test-179
type: test
title: packed graph clone smoke active-goal import contract
status: done
priority: 1
epic: epic-104
parent: goal-19
tags: [0.3.6, graph-import, smoke]
owners: []
links: []
artifacts: []
relates: [task-412]
blocked_by: [task-412]
blocks: []
refs: []
aliases: []
skills: []
cases: [Packed smoke imports an active template start goal into a repo with an active local goal., Smoke proves selected current goal, paused old goal, search, pack, and validate.]
created: 2026-06-17
updated: 2026-06-17
---
# Overview

Validate the packed tarball graph clone/import smoke covers active-goal import behavior.

# Target / Scope

- task-412

# Preconditions / Environment

- `scripts/smoke-graph-clone.js` packs mdkg, installs it in a temp prefix, and runs public CLI commands against temp repos.

# Test Cases

- Activate a local goal before import.
- Import an activated template start goal with `--select-goal --apply`.
- Assert receipt `activated_goal`, `paused_goals`, current selected goal, validation, search, and pack output.

# Results / Evidence

- Record `npm run smoke:graph-clone` during closeout.

# Notes / Follow-ups

- This smoke remains publish-gate coverage and should stay in `prepublishOnly`.
