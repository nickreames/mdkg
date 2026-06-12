---
id: test-151
type: test
title: future graph upgrade dry-run no-mutation contract
status: todo
priority: 3
epic: epic-83
tags: [future, graph-upgrade, dry-run, no-mutation]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-363]
blocks: []
refs: []
aliases: []
skills: []
cases: [upgrade plan is dry run, graph mutation is explicit, no publish dependency]
created: 2026-06-11
updated: 2026-06-11
---
# Overview

Validate the future graph update train's dry-run and no-mutation contract before
any compatibility automation is activated.

# Target / Scope

- `task-363`
- future graph upgrade planning
- downstream compatibility boundaries

# Preconditions / Environment

- Fresh temp repo or copied fixture repo.
- Current mdkg CLI available.
- Dirty child/downstream fixture when mutation refusal is being tested.

# Test Cases

- Run graph upgrade planning in dry-run mode and assert no files are modified.
- Assert generated receipts list intended changes, risks, and rollback notes.
- Assert dirty downstream repos are refused unless explicitly in-scope.
- Assert follow-up apply behavior, when later implemented, remains local to the
  selected repo.

# Results / Evidence

- Pending.

# Notes / Follow-ups

- Lower priority than spike support and mdkg.dev launch readiness.
