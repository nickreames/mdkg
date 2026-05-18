---
id: task-141
type: task
title: integrate imported bundles into read commands
status: done
priority: 1
epic: epic-23
tags: [bundle-import, search, show, pack, capability]
owners: []
links: []
artifacts: []
relates: [task-140]
blocked_by: []
blocks: [task-142, test-83]
refs: []
aliases: [bundle-import-read-paths]
skills: []
created: 2026-05-17
updated: 2026-05-17
---
# Overview

Make imported bundle nodes available to planning and discovery commands without
making them mutable local workspace nodes.

# Acceptance Criteria

- `list`, `search`, `show`, `pack`, and `capability` include enabled imports by
  default.
- `show` and `pack` load imported bodies from ZIP entries through shared body
  loading logic.
- Human output labels imported nodes as read-only and stale when applicable.
- JSON output exposes import/source metadata for imported records.
- `next` remains local-actionable only and does not select imported work.

# Files Affected

- `src/commands/list.ts`
- `src/commands/search.ts`
- `src/commands/show.ts`
- `src/commands/pack.ts`
- `src/commands/capability.ts`
- `src/commands/next.ts`
- `src/pack/pack.ts`

# Implementation Notes

- Read paths merge enabled imports into the in-memory index by default.
- Imported bodies are loaded from ZIP entries only when a command needs to
  render or pack the body.

# Test Plan

- CLI tests cover imported list/search/show/pack/capability behavior, stale
  warnings, disabled imports, and imported body loading from ZIP entries.

# Results / Evidence

- `npm run test`
- `npm run smoke:bundle-import`
- `npm publish --dry-run`

# Links / Artifacts

- `mdkg search <query>`
- `mdkg show <import-alias>:<id>`
- `mdkg pack <import-alias>:<id>`
