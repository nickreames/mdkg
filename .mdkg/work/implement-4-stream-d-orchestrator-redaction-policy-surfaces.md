---
id: implement-4
type: task
title: implement stream d orchestrator redaction policy surfaces
status: done
priority: 1
epic: epic-5
tags: [v0_4, implementation, orchestrator, redaction, contracts]
owners: []
links: []
artifacts: [cmd:npm_run_build_ok_2026_03_05, cmd:npm_run_test_ok_2026_03_05, cmd:node_dist_cli_validate_ok_2026_03_05]
relates: [dec-10, edd-6, edd-8, task-53, task-54, test-23, test-24, epic-5]
blocked_by: [implement-3]
blocks: [test-23, test-24]
refs: []
aliases: [stream-d, safe-strict]
created: 2026-03-05
updated: 2026-03-05
---

# Overview

Implement Stream D documentation-facing schema hooks for orchestrator run/event/artifact contracts and redaction policy levels.

# Acceptance Criteria

- Minimal structured contract fields are represented in mdkg surfaces without over-scoping runtime protocol.
- Redaction policy semantics remain policy-level (`safe`/`strict`) for 0.0.4.
- Validation hooks align with documentation contracts where applicable.

# Files Affected

- src/commands/validate.ts
- src/graph/frontmatter.ts
- src/graph/node.ts
- tests/
- README.md

# Implementation Notes

- Maintain docs-first boundary for runtime enforcement.
- Keep contracts transport-agnostic and deterministic.

# Test Plan

- Run `npm run build`.
- Run `npm run test`.
- Run `mdkg validate`.
- Validate behavior against `test-23` and `test-24`.

# Links / Artifacts

- dec-10
- edd-6
- edd-8
- test-23
- test-24
- cmd:npm_run_build_ok_2026_03_05
- cmd:npm_run_test_ok_2026_03_05
- cmd:node_dist_cli_validate_ok_2026_03_05
