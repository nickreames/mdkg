---
id: test-139
type: test
title: writer lock and atomic mutation audit contract
status: done
priority: 1
epic: epic-71
parent: goal-13
tags: [multi-writer, locking, atomic-writes, 0-3-7]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-343]
blocks: []
refs: []
aliases: []
skills: []
cases: []
created: 2026-06-09
updated: 2026-06-09
---
# Overview

Validate repo-local writer lock and atomic write expectations across mutating
commands.

# Target / Scope

- `task-343`
- `edd-21`

# Preconditions / Environment

- Temp repo with SQLite id reservation enabled.
- Parallel command execution harness.

# Test Cases

- Parallel `mdkg new task` calls do not produce duplicate ids.
- Parallel checkpoint creation allocates unique ids.
- Mutating commands either use the shared mutation lock or are documented as
  safe exceptions.
- Interrupted or failing writes do not leave truncated Markdown/config files.

# Results / Evidence

Pending implementation.

# Notes / Follow-ups

- Exact interruption simulation may be limited to controlled helper-level tests.
