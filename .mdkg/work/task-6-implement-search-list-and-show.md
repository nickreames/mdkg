---
id: task-6
type: task
title: implement search, list, and show commands using global index
status: done
priority: 2
epic: epic-1
tags: [list, search, show]
owners: []
links: [cmd:list, cmd:search, cmd:show]
artifacts: [list-filters, search-index, show-output]
relates: [rule-3]
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-01-06
updated: 2026-01-14
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
- src/commands/node_card.ts
- src/graph/index_cache.ts
- src/util/filter.ts
- src/util/qid.ts
- src/util/errors.ts
- src/util/sort.ts
- src/util/argparse.ts
- src/cli.ts
- tests/util/filter.test.ts
- tests/util/sort.test.ts
- tests/README.md

# Implementation Notes

- Use the cached index for speed.
- Keep output readable and stable for agents.
- Use a consistent “node card” output:
  - qid, type, status/priority, title, path

# Test Plan

- list tasks and show task-1
- search for “pack” and verify rule-2 appears

# Completion Notes

- Implemented list/search/show with cached index reads and consistent node cards.
- Added unit coverage for filter/sort helpers.
- Deferred CLI end-to-end tests until `mdkg new` exists and added a test matrix note.

# Links / Artifacts

- rule-3
