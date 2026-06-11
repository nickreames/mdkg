---
id: test-129
type: test
title: 0.3.1 release hygiene and roadmap alignment contract
status: done
priority: 1
epic: epic-69
parent: goal-13
tags: [release, hygiene, roadmap, 0-3-1, test]
owners: []
links: []
artifacts: []
relates: [goal-13, task-323, task-148]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
cases: []
created: 2026-06-09
updated: 2026-06-09
---
# Overview

Validate that the `0.3.1` hygiene alignment pass changed release bookkeeping
and mdkg graph state only, without functional CLI implementation.

# Target / Scope

- `CHANGELOG.md`
- `goal-13`
- `epic-69`
- `task-148`
- `task-323`

# Preconditions / Environment

- Clean preflight graph validation.
- No real npm publish, tag, or push.

# Checks

- `node dist/cli.js validate --json`
- `node dist/cli.js goal next goal-13 --json`
- `git diff --check`

Document environment, data, and setup requirements.

# Test Cases

- case 1
- case 2

# Results / Evidence

Record outcomes and link evidence in `artifacts` or `links`.

# Notes / Follow-ups

- follow-up 1
- follow-up 2
