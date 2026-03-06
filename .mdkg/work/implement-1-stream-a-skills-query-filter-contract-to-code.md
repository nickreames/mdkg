---
id: implement-1
type: task
title: implement stream a skills query filter contract to code
status: done
priority: 1
epic: epic-5
tags: [v0_4, implementation, skills, query, filters]
owners: []
links: []
artifacts: [cmd:npm_run_build_ok_2026_03_05, cmd:npm_run_test_ok_2026_03_05, cmd:mdkg_validate_ok_2026_03_05]
relates: [dec-10, edd-5, edd-7, task-50, task-51, test-20, epic-5]
blocked_by: []
blocks: [test-20]
refs: []
aliases: [stream-a, stage:plan]
created: 2026-03-05
updated: 2026-03-05
---

# Overview

Implement the Stream A runtime surface for skill discovery and filtering using existing mdkg command families.

# Acceptance Criteria

- `mdkg list --type skill` returns deterministic skill discovery output.
- `mdkg show skill:<slug>` resolves and renders a skill deterministically.
- `mdkg search` includes skill metadata in results.
- Tag filtering support is implemented with `--tags` and `--tags-mode any|all`.
- No `mdkg skills ...` namespace is introduced.

# Files Affected

- src/commands/list.ts
- src/commands/search.ts
- src/commands/show.ts
- src/graph/indexer.ts
- src/graph/index_cache.ts
- src/graph/workspace_files.ts
- src/util/filter.ts
- src/cli.ts
- tests/

# Implementation Notes

- Keep command semantics deterministic and local-first.
- Respect policy-level stage gating guidance while implementing query-time filters.

# Test Plan

- Run `npm run build`.
- Run `npm run test`.
- Run `mdkg validate`.
- Validate behavior against `test-20`.

# Links / Artifacts

- dec-10
- edd-5
- edd-7
- test-20
- cmd:npm_run_build_ok_2026_03_05
- cmd:npm_run_test_ok_2026_03_05
- cmd:mdkg_validate_ok_2026_03_05
