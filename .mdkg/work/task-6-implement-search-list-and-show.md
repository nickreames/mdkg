---
id: task-6
type: task
title: implement search, list, and show commands using global index
status: todo
priority: 2
epic: epic-1
tags: [search, list, show]
links: [cmd:search, cmd:list, cmd:show]
artifacts: [show-output, list-filters, search-index]
relates: [rule-3]
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-01-06
updated: 2026-01-06
---

# Overview

Provide basic graph read functionality: show a node, list nodes by filters, and keyword search across nodes.

# Acceptance Criteria

- `mdkg show <id-or-qid>` loads and prints a node summary (and optional body)
- `mdkg list` supports filters: type, status, ws, epic, priority, blocked
- `mdkg search "<query>"` searches IDs, titles, tags, filename tokens (from path)
- ambiguous IDs require qid suggestions

# Files Affected

- src/commands/show.ts
- src/commands/list.ts
- src/commands/search.ts
- src/util/sort.ts

# Implementation Notes

- Use the cached index for speed.
- Keep output readable and stable for agents.
- Use a consistent “node card” output:
  - qid, type, status/priority, title, path

# Test Plan

- list tasks and show task-1
- search for “pack” and verify rule-2 appears

# Links / Artifacts

- rule-3
