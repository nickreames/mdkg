---
id: chk-61
type: checkpoint
title: 0.3.0 SPEC validation and misuse diagnostics
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-283]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-283]
created: 2026-06-06
updated: 2026-06-06
---
# Summary

Implemented optional 0.3.0 `spec_kind` validation and documentation-only SPEC
misuse diagnostics while preserving legacy SPEC compatibility.

# Scope Covered

- `task-283`: validation support, compatibility allowance, formatting order,
  and command-level tests for `test-107` and `test-108`.

# Decisions Captured

- `spec_kind` is optional so legacy SPEC files keep validating.
- Existing local templates that do not yet include `spec_kind` still accept the
  scalar key through a narrow compatibility allowance.
- Documentation-only `spec_kind` values fail validation with repair guidance
  instead of being treated as reusable capability surfaces.

# Implementation Summary

- Added `spec_kind` to SPEC frontmatter ordering.
- Added allowed value validation for `cli_tool`, `api`, `agent`,
  `runtime_agent`, `capability`, `tool`, `model`, `runtime_image`,
  `integration`, and `project_service`.
- Added diagnostics for `gap_register`, `checkpoint`, `roadmap`, `audit`,
  `go_no_go`, `planning_note`, and `launch_checklist`.
- Added tests proving no-SPEC repos still validate, zero SPEC capability lists
  are valid, all allowed kinds validate, and documentation-only misuse produces
  actionable guidance.

# Verification / Testing

- `npm run build`: passed.
- `npm run build:test`: passed.
- `node --test dist/tests/commands/agent_file_types.test.js`: passed, 25 tests.
- `npm run test`: passed, 413 tests.
- `node dist/cli.js index`: passed.
- `node dist/cli.js validate --json`: passed with no warnings or errors.
- `node dist/cli.js capability search "spec_kind" --json`: returned `dec-26`
  and `edd-15`.
- `git diff --check`: passed.

# Known Issues / Follow-ups

- `task-285` still needs `spec_kind` in capability index metadata.
- `task-287` still needs template updates so newly scaffolded SPEC files include
  `spec_kind` by default.
- `task-284` is next for the dogfood mdkg CLI SPEC.

# Links / Artifacts

- `task-283`
- `test-107`
- `test-108`
- `src/graph/agent_file_types.ts`
- `src/graph/node.ts`
- `src/graph/frontmatter.ts`
- `tests/commands/agent_file_types.test.ts`
