---
id: task-171
type: task
title: post publish sqlite handoff prompts
status: todo
priority: 2
epic: epic-20
tags: [0_1_3, handoff, sqlite, consumer-repos]
owners: []
links: []
artifacts: []
relates: [epic-20, task-148]
blocked_by: [task-170]
blocks: []
refs: []
aliases: [sqlite-consumer-handoffs]
skills: []
created: 2026-05-20
updated: 2026-05-20
---

# Overview

After `mdkg@0.1.3` is published, create focused upgrade prompts for
`omni-web`, `ochatr-ai-go`, and `omni-room-runtime` so each repo can opt into
SQLite mode only after mdkg's internal SQLite and parallel-call smokes pass.

# Acceptance Criteria

- Prompt for `omni-web` covers upgrade, init/upgrade parity, SQLite opt-in,
  and parallel mdkg command safety checks.
- Prompt for `ochatr-ai-go` covers upgrade, semantic mirror boundaries, SQLite
  opt-in, and release/test graph hygiene.
- Prompt for `omni-room-runtime` covers upgrade, runtime contract fixtures,
  SQLite opt-in, and bundle/capability cache handoff expectations.
- Prompts explicitly state that SQLite remains a rebuildable mdkg cache and
  must not become canonical execution storage.

# Files Affected

- mdkg graph task or handoff note only.

# Implementation Notes

Consumer repos must not be edited before the npm package is published and the
internal smokes are green.

# Test Plan

- Validate the mdkg graph after prompts are created.
- Run `mdkg pack task-171 --profile concise --dry-run --stats`.

# Links / Artifacts

- `epic-20`
- `task-148`
