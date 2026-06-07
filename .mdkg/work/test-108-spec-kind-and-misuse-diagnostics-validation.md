---
id: test-108
type: test
title: SPEC spec_kind and misuse diagnostics validation
status: done
priority: 1
epic: epic-54
parent: goal-9
prev: test-107
next: test-109
tags: [spec, diagnostics, misuse]
owners: []
links: []
artifacts: []
relates: [goal-9, task-282, task-283]
blocked_by: [task-283]
blocks: []
refs: [dec-26]
aliases: [spec-kind-diagnostics-validation]
skills: []
cases: [allowed-spec-kind, disallowed-doc-spec]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Validate allowed `spec_kind` values and actionable warnings for documentation
misuse.

# Test Cases

- All allowed `spec_kind` fixtures validate.
- Disallowed documentation-only values produce repair guidance.
- Legacy agent-style SPEC fixtures remain compatible for 0.3.0.

# Evidence

Completed by `task-283` on 2026-06-06.

- Added command-level coverage in `tests/commands/agent_file_types.test.ts`:
  `validate accepts all allowed SPEC spec_kind values`.
- Added command-level coverage in `tests/commands/agent_file_types.test.ts`:
  `validate reports actionable diagnostics for documentation-only SPEC
  spec_kind values`.
- The allowed-kind test covers `cli_tool`, `api`, `agent`, `runtime_agent`,
  `capability`, `tool`, `model`, `runtime_image`, `integration`, and
  `project_service`.
- The misuse diagnostic test covers `gap_register`, `checkpoint`, `roadmap`,
  `audit`, `go_no_go`, `planning_note`, and `launch_checklist`, and asserts the
  validation output explains that `SPEC.md` must define a reusable invocable
  capability surface.
- Existing valid legacy agent fixtures without `spec_kind` still pass in the
  same test file.
- `npm run test`: passed, 413 tests.
- `node dist/cli.js validate --json`: passed with no warnings or errors.
