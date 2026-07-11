---
id: task-700
type: task
title: Use loop descriptors for help command contract and docs generation
status: done
priority: 1
epic: epic-223
parent: goal-59
tags: [loop, cli, contract, docs]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-59, edd-69, dec-66, task-699, task-692, test-366, test-372]
context_refs: []
evidence_refs: [chk-404]
aliases: []
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-06
updated: 2026-07-06
---
# Overview

Use loop command descriptors as the explicit metadata source for loop help,
command-contract, and generated documentation surfaces.

# Acceptance Criteria

- Loop command contract records are sourced from descriptor metadata where
  descriptors exist.
- Flag descriptions for loop commands are explicit and not inferred from
  unrelated help prose.
- Help output remains compatible unless intentionally and additively improved.
- Generated docs and command matrix remain in sync.

# Files Affected

- `scripts/generate-command-contract.js`
- `scripts/cli_help_targets.js` if descriptor enumeration affects loop targets
- `CLI_COMMAND_MATRIX.md`
- `docs/_generated/cli-reference.md`
- `tests/commands/command_contract.test.ts`

# Implementation Notes

- Use `task-692` as the contract-quality context.
- Keep current top-level command contract shape stable.
- Do not migrate non-loop command families.

# Test Plan

- `node scripts/generate-command-contract.js --check`
- `npm run cli:check`
- `npm run docs:check`
- `test-372`

# Links / Artifacts

- `task-692`
- `test-366`
