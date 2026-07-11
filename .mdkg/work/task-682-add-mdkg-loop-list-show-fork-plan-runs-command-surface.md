---
id: task-682
type: task
title: add mdkg loop list show fork plan runs command surface
status: done
priority: 1
epic: epic-217
parent: goal-58
tags: [loop, cli, json, fork]
owners: []
links: []
artifacts: [src/cli.ts, src/commands/loop.ts, tests/commands/loop.test.ts, tests/commands/cli.test.ts, tests/commands/cli_runtime.test.ts]
relates: []
blocked_by: [task-677, task-678, task-680, task-681]
blocks: []
refs: [goal-58, edd-66, dec-65, task-672, test-353, test-354, test-355]
context_refs: []
evidence_refs: [chk-388]
aliases: []
skills: [select-work-and-ground-context, service-boundary-ownership-check, verify-close-and-checkpoint]
created: 2026-07-06
updated: 2026-07-06
---
# Overview

Add a semantic `mdkg loop` command family for humans and agents.

# Acceptance Criteria

- Commands include `list`, `show`, `fork`, `plan`, and `runs` or equivalent run
  evidence inspection.
- Structured output is available through `--json` where existing command
  conventions support it.
- Command wording keeps execution ownership clear: mdkg defines process state;
  runtimes execute agents/tools.

# Files Affected

- `src/cli.ts`
- new or existing command module under `src/commands/`
- CLI dispatch/help tests

# Implementation Notes

- CLI should not expose raw graph edge mechanics as the primary UX.
- `fork` should support dry-run/preview behavior where feasible before graph
  mutation.

# Test Plan

- Command dispatch/help tests.
- JSON receipt tests for list/show/fork/plan/runs.
- Error tests for missing loop refs and invalid fork options.

# Links / Artifacts

- `task-672`
- `test-353`
- `test-354`
- `test-355`
