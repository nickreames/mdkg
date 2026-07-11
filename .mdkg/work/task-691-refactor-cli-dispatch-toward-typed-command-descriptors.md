---
id: task-691
type: task
title: Refactor CLI dispatch toward typed command descriptors
status: backlog
priority: 2
parent: loop-4
tags: [cli, refactor, bloat, residual-simplification]
owners: []
links: []
artifacts: []
relates: [loop-4, prop-4]
blocked_by: []
blocks: []
refs: [loop-4, prop-4, spike-29, task-690]
context_refs: []
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-06
updated: 2026-07-06
---
# Overview

Refactor CLI routing incrementally toward typed command descriptors while
preserving all public command names, flags, help output, JSON envelopes, and
exit-code behavior.

# Acceptance Criteria

- A minimal descriptor type captures command path, args, flags, help notes,
  output formats, safety metadata, and handler binding.
- At least one low-risk command family is migrated to descriptors without
  changing public behavior.
- `src/cli.ts` dispatch logic becomes smaller for the migrated family.
- Global parser behavior remains compatible, including aliases such as
  `--profile` to `--pack-profile`.
- Generated command contract and CLI help checks remain green.
- No public command, flag, JSON schema ref, danger level, or side-effect
  classification is removed without an accepted decision.

# Files Affected

- `src/cli.ts`
- `src/util/argparse.ts`
- `scripts/generate-command-contract.js`
- `scripts/cli_help_targets.js`
- `CLI_COMMAND_MATRIX.md`
- `docs/_generated/cli-reference.md`
- `tests/commands/cli_help_matrix.test.ts`
- `tests/commands/command_contract.test.ts`
- focused command-family tests for the migrated family

# Implementation Notes

- Recommended first migration candidates: `loop`, `skill`, or `task`.
- Avoid starting with `work`, `db queue`, `subgraph`, or `git push`; they have
  higher compatibility and safety metadata blast radius.
- Keep descriptors boring. The goal is fewer drift points, not a command
  framework.
- Preserve current CLI behavior before improving UX.

# Test Plan

- `npm run build`
- `npm run cli:check`
- `npm run cli:contract`
- `npm run docs:check`
- focused command-family tests for the migrated family
- `node dist/cli.js validate --changed-only --json`

# Links / Artifacts

- `loop-4`
- `prop-4`
- `spike-29`
- `test-366`
