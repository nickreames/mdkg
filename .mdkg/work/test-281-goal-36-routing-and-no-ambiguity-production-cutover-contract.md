---
id: test-281
type: test
title: goal-36 routing and no-ambiguity production-cutover contract
status: done
priority: 1
epic: epic-189
parent: goal-36
tags: []
owners: []
links: []
artifacts: [chk-255]
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: [chk-255]
aliases: []
skills: []
cases: []
created: 2026-06-24
updated: 2026-06-24
---
# Overview

Validate that goal-36 is a production custom-domain implementation goal with clean routing and no ambiguity between graph creation and execution.

# Target / Scope

- `goal-36`
- `task-563`
- `task-564`

# Preconditions / Environment

- Goal-36 nodes have been created.
- No source/site/docs/Vercel/DNS mutation occurred during the creation pass.

# Test Cases

- `goal show goal-36 --json` returns the full production cutover contract.
- `goal next goal-36 --json` returns `task-563` before graph-only closeout.
- After `task-563` closes, `goal claim goal-36 task-564 --json` makes `task-564` the next executable node.
- Scope refs include only actionable epics, spike, tasks, and tests.
- Context records the current DNS/Vercel evidence and untracked banner-file boundary.

# Results / Evidence

- Passed on 2026-06-24.
- `node dist/cli.js validate --summary --json --limit 20` returned `ok: true` with zero warnings and zero errors.
- `node dist/cli.js goal next goal-36 --json` returned `task-563` with no warnings before closeout.
- `node dist/cli.js task done test-281 --json` marked this test done.
- `node dist/cli.js task done task-563 --checkpoint "goal-36 production domain cutover planning" --json` created `chk-255`.
- `node dist/cli.js goal claim goal-36 task-564 --json` made `task-564` the next executable implementation node.

# Notes / Follow-ups

- Future implementation begins at `task-564`.
