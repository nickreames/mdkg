---
id: test-59
type: test
title: event logs committed by default and manual delete tolerated
status: done
priority: 1
epic: epic-16
tags: [0_0_6, events, init, validate]
owners: []
links: []
artifacts: [tests/commands/init.test.ts, tests/commands/validate_events.test.ts]
relates: [task-105, task-108, epic-16]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
cases: [no-gitignore-events, enable-no-ignore-mutation, manual-delete-tolerated]
created: 2026-03-11
updated: 2026-03-11
---
# Overview

Validate the committed-by-default event policy and the tolerance for user-managed deletion or ignore choices.

# Target / Scope

- `task-105`
- `task-108`

# Preconditions / Environment

- fresh temp repo
- init and event enable coverage

# Test Cases

- init does not add `.mdkg/work/events/*.jsonl` to `.gitignore`
- `mdkg event enable` does not mutate `.gitignore`
- deleting `events.jsonl` manually still leaves `mdkg validate` green

# Results / Evidence

- capture tests and temp-repo command output

# Notes / Follow-ups

- none once green
