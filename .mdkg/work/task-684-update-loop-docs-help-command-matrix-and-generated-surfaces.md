---
id: task-684
type: task
title: update loop docs help command matrix and generated surfaces
status: done
priority: 1
epic: epic-219
parent: goal-58
tags: [loop, docs, help, command-matrix]
owners: []
links: []
artifacts: [CLI_COMMAND_MATRIX.md, assets/init/CLI_COMMAND_MATRIX.md, README.md, docs/_generated/cli-reference.md, docs/_generated/command-contract-summary.json, scripts/cli_help_targets.js, scripts/generate-command-contract.js, scripts/check-doc-command-examples.js, src/cli.ts]
relates: []
blocked_by: [task-682, task-683]
blocks: []
refs: [goal-58, edd-66, dec-65, task-672, task-673, test-360, test-361, chk-388]
context_refs: []
evidence_refs: [chk-389]
aliases: []
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-06
updated: 2026-07-06
---
# Overview

Update user-facing and generated references for the new loop node and command
surface.

# Acceptance Criteria

- CLI help documents `loop` and relevant creation/discovery behavior.
- `CLI_COMMAND_MATRIX.md` and generated docs are synchronized with actual CLI
  behavior.
- Docs explain that loops are durable declarative graph process state, not
  runtime execution jobs.

# Files Affected

- `src/cli.ts`
- `CLI_COMMAND_MATRIX.md`
- generated docs/check fixtures and scripts as required

# Implementation Notes

- Public wording should preserve mdkg/runtime ownership boundaries.
- Keep CocoIndex out of loop docs except as explicit non-scope if needed.

# Test Plan

- `npm run cli:check`
- docs/generated command checks selected by repo convention.

# Links / Artifacts

- `task-672`
- `task-673`
- `test-360`
- `test-361`
