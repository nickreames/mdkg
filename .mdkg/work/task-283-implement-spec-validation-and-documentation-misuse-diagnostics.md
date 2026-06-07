---
id: task-283
type: task
title: implement SPEC validation and documentation misuse diagnostics
status: done
priority: 1
epic: epic-54
parent: goal-9
prev: task-282
next: task-284
tags: [spec, validation, diagnostics]
owners: []
links: []
artifacts: [src/graph/agent_file_types.ts, src/graph/validate_graph.ts]
relates: [goal-9, epic-54, test-107, test-108]
blocked_by: [task-282]
blocks: [task-284, test-107, test-108]
refs: [dec-26]
aliases: [spec-misuse-diagnostics]
skills: []
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Add implementation support for optional SPEC validation and misuse warnings.

# Acceptance Criteria

- Validation accepts repos with no SPEC files.
- New SPEC files support `spec_kind`.
- Misuse examples such as `gap_register`, `checkpoint`, `roadmap`, `audit`, `go_no_go`, `planning_note`, and `launch_checklist` produce actionable diagnostics.

# Files Affected

- `src/graph/agent_file_types.ts`
- `src/graph/validate_graph.ts`
- `tests`

# Implementation Notes

- Prefer warnings/diagnostics where needed to preserve 0.3.0 compatibility.

# Test Plan

- Unit fixtures for no SPEC, valid SPEC kinds, and misuse diagnostics.
- `npm run test`
- `node dist/cli.js validate`

# Links / Artifacts

- `test-107`
- `test-108`

# Implementation Evidence

Completed on 2026-06-06.

## Source Changes

- `src/graph/agent_file_types.ts`
  - Added optional `spec_kind` to SPEC attribute ordering.
  - Added allowed SPEC kind validation for `cli_tool`, `api`, `agent`,
    `runtime_agent`, `capability`, `tool`, `model`, `runtime_image`,
    `integration`, and `project_service`.
  - Added actionable documentation-only diagnostics for `gap_register`,
    `checkpoint`, `roadmap`, `audit`, `go_no_go`, `planning_note`, and
    `launch_checklist`.
- `src/graph/node.ts`
  - Added narrow compatibility allowance for scalar `spec.spec_kind` so
    existing workspaces with older local SPEC templates can validate new SPEC
    records without first vendoring updated templates.
- `src/graph/frontmatter.ts`
  - Added `spec_kind` to default formatting order after `version`.
- `tests/commands/agent_file_types.test.ts`
  - Added no-SPEC validation and zero SPEC capability-list coverage.
  - Added all-allowed-kind validation coverage.
  - Added documentation-only misuse diagnostics coverage for every value named
    in the task.

## Verification Evidence

- `npm run build`: passed.
- `npm run build:test`: passed.
- `node --test dist/tests/commands/agent_file_types.test.js`: passed, 25 tests.
- `npm run test`: passed, 413 tests.
- `node dist/cli.js index`: passed.
- `node dist/cli.js validate --json`: passed with no warnings or errors.
- `git diff --check`: passed.

## Follow-ups

- `task-285` still needs to include `spec_kind` in concrete capability index
  metadata.
- `task-287` still needs to add `spec_kind` to default and canonical templates.
