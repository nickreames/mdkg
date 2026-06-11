---
id: test-136
type: test
title: fix plan no mutation temp repo contract
status: done
priority: 1
epic: epic-70
parent: goal-13
tags: [fix, temp-repo, no-mutation, 0-3-3]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-339]
blocks: []
refs: []
aliases: []
skills: []
cases: []
created: 2026-06-09
updated: 2026-06-09
---
# Overview

Validate that `mdkg fix plan --json` is safe to run in a dirty or damaged temp
repo because it does not mutate files.

# Target / Scope

- `task-339`
- `edd-19`

# Preconditions / Environment

- Fresh `/private/tmp` repo.
- Generated-cache, missing-reference, and duplicate-id planning fixtures.

# Test Cases

- Capture repo file hashes before `mdkg fix plan --json`.
- Run `mdkg fix plan --family all --json`.
- Capture repo file hashes afterward and assert no changes.
- Confirm dirty git state is reported in the receipt instead of hidden.
- Confirm no `fix apply` command is exposed.

# Results / Evidence

- Passed.
- `npm run smoke:fix-plan` used a packed install and fresh temp repo, then
  verified file hashes before and after `fix plan` runs.
- `npm run prepublishOnly` passed and included `smoke:fix-plan`.
- Evidence checkpoint: `chk-109`.

# Notes / Follow-ups

- This test becomes the guardrail before any future apply design.
