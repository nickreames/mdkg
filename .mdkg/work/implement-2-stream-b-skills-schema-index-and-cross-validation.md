---
id: implement-2
type: task
title: implement stream b skills schema index and cross validation
status: done
priority: 1
epic: epic-5
tags: [v0_4, implementation, skills, schema, index, validation]
owners: []
links: []
artifacts: [cmd:npm_run_build_ok_2026_03_05, cmd:npm_run_test_ok_2026_03_05, cmd:node_dist_cli_validate_ok_2026_03_05]
relates: [dec-10, edd-2, edd-3, edd-5, task-35, task-42, test-10, test-12, test-13, epic-5]
blocked_by: [implement-1]
blocks: [test-10, test-12, test-13]
refs: []
aliases: [stream-b, skills-json]
created: 2026-03-05
updated: 2026-03-05
---

# Overview

Implement Stream B skills data model and deterministic indexing/validation behavior, including node-to-skill references.

# Acceptance Criteria

- Skills index artifact is generated and consumed deterministically.
- Work-item `skills: []` references are parsed and validated.
- Missing skill references fail validation deterministically.
- Skill metadata is queryable without full skill-body loading.

# Files Affected

- src/graph/frontmatter.ts
- src/graph/node.ts
- src/graph/indexer.ts
- src/commands/index.ts
- src/commands/validate.ts
- src/templates/
- tests/

# Implementation Notes

- Keep optional metadata flattened for 0.0.4 compatibility.
- Preserve existing node/schema behavior outside new skills fields.

# Test Plan

- Run `npm run build`.
- Run `npm run test`.
- Run `mdkg validate`.
- Validate behavior against `test-10`, `test-12`, and `test-13`.

# Links / Artifacts

- edd-2
- edd-3
- edd-5
- test-10
- test-12
- test-13
- cmd:npm_run_build_ok_2026_03_05
- cmd:npm_run_test_ok_2026_03_05
- cmd:node_dist_cli_validate_ok_2026_03_05
