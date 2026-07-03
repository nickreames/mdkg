---
id: task-637
type: task
title: ground 0.4.1 contract-profile implementation from goal-48 and current source
status: done
priority: 1
parent: goal-49
tags: [0.4.1, contract-profile, grounding, source-audit]
owners: []
links: []
artifacts: [src/graph/agent_file_types.ts, src/commands/validate.ts, src/commands/work.ts, src/commands/new.ts, src/cli.ts, .mdkg/templates/default/manifest.md, .mdkg/templates/default/work.md, .mdkg/templates/default/work_order.md, .mdkg/templates/default/receipt.md, tests/commands/agent_file_types.test.ts, tests/commands/archive_work.test.ts, tests/helpers/templates.ts]
relates: []
blocked_by: []
blocks: [task-639]
refs: [goal-48, task-631, task-632, task-634, task-635, task-636, test-330, test-331, test-332]
context_refs: []
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context, build-pack-and-execute-task]
created: 2026-07-02
updated: 2026-07-03
---
# Overview

Ground the implementation pass in the completed `goal-48` plan and current
source, then produce the executable file map for the first coding node.

# Acceptance Criteria

- Read `goal-48`, `task-631` through `task-636`, and `test-330` through
  `test-332`.
- Inspect current validator, CLI, work-helper, template, upgrade, docs,
  generated-reference, changelog, and package surfaces before editing.
- Confirm the accepted fields, rejected bare `profile`, Omni Room runtime
  boundary, full default/init asset scope, and `0.4.1` target.
- Record exact implementation file groups and any discovered blockers.

# Files Affected

- mdkg source, tests, templates, init assets, docs, generated references, and
  release files are read during this task; functional edits begin in later
  nodes only.

# Implementation Notes

- Start from live source, not only the planning text.
- Prefer existing validator and diagnostic patterns over introducing a parallel
  schema system.
- Keep `goal-50` blocked during this task.

# Test Plan

- `node dist/cli.js pack task-637 --profile concise --dry-run --stats`
- `git status --short --branch`
- source-grounding note added to task evidence before `task-639` starts

# Links / Artifacts

- `goal-48`
- `task-631`
- `task-632`
- `task-634`
- `task-635`
- `task-636`
- `test-330`
- `test-331`
- `test-332`
