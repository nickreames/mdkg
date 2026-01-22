---
id: chk-2
type: checkpoint
title: v1 progress: tasks 1-9 + other done tasks
status: done
priority: 9
tags: [checkpoint, progress, v1]
owners: []
links: [cmd:checkpoint, cmd:format, cmd:index, cmd:list, cmd:next, cmd:pack, cmd:search, cmd:show, cmd:validate]
artifacts: []
relates: [epic-1, epic-2]
blocked_by: []
blocks: []
refs: [dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, dec-7, edd-1, rule-1, rule-2, rule-3, rule-4, rule-5, rule-6, rule-guide]
aliases: []
scope: [task-1, task-11, task-12, task-13, task-14, task-15, task-16, task-17, task-18, task-19, task-2, task-20, task-3, task-4, task-5, task-6, task-7, task-8, task-9]
created: 2026-01-20
updated: 2026-01-21
---
# Summary

This checkpoint captures the work now marked `done` through the v1 bootstrap plus deterministic context-pack generation.

mdkg can now:
- index registered workspaces into a global cache
- query nodes (`search`, `list`, `show`)
- validate + format strict frontmatter
- pick the next work item by chain/priority
- generate deterministic packs (md/json/toon/xml) with stable ordering and limits

# Scope Covered

Work items covered are listed in `scope` frontmatter:

- Bootstrap + core CLI: `task-1`..`task-6`, `task-8`, `task-9`, `task-11`
- Packs: `task-7`, `task-12`..`task-20`

# Decisions Captured

- Rules: `rule-1`..`rule-6`, `rule-guide`
- Designs/decisions: `edd-1`, `dec-1`..`dec-7`

# Implementation Summary

- Root-only CLI using `.mdkg/config.json` + registered workspaces
- Strict frontmatter parsing + template-schema enforcement for node types
- Global index + cache (`.mdkg/index/global.json`) with staleness detection + auto-reindex
- Deterministic pack engine (BFS traversal, ordering per `rule-2`, max-nodes/bytes truncation)
- Pack exporters for Markdown, JSON, TOON, and XML
- Test harness using Node’s built-in test runner (`npm test`)

# Verification / Testing

- Unit tests cover frontmatter parsing, node parsing, indexing, pack ordering/limits, and exporters
- CLI behavior exercised in-repo via `mdkg pack`, `mdkg validate`, and `mdkg next`

# Known Issues / Follow-ups

- Update `chk-1` placeholder content once v1 is shipped
- Keep adding checkpoints to reduce pack size as the graph grows

# Links / Artifacts

- See `scope` for completed tasks and `refs` for rules/design docs
