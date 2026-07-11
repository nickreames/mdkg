---
id: task-692
type: task
title: Improve command contract flag extraction and descriptions
status: backlog
priority: 2
parent: loop-4
tags: [cli, contract, docs, residual-simplification]
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

Improve command-contract flag metadata so generated contract consumers get
precise flag descriptions instead of best-effort descriptions inferred from
help prose.

# Acceptance Criteria

- Command-contract flag descriptions are sourced from explicit option metadata
  for at least one migrated command family.
- Help prose lines no longer become misleading flag descriptions for migrated
  commands.
- The generated contract remains stable and deterministic.
- Existing consumers continue receiving the same top-level command contract
  fields.
- Tests cover at least one flag whose current description is inferred from a
  note or usage line.

# Files Affected

- `scripts/generate-command-contract.js`
- `dist/command-contract.json`
- `tests/commands/command_contract.test.ts`
- descriptor files or `src/cli.ts`, depending on the implementation path

# Implementation Notes

- Source evidence: `scripts/generate-command-contract.js` currently extracts
  flags from help text and uses the matched help line as the description.
- Source evidence: `git push` contract currently describes `--message` from the
  note about `--stage-all`, not from a dedicated option description.
- This should be fixed as contract quality work, not as a public CLI change.

# Test Plan

- `node scripts/generate-command-contract.js --check`
- `npm run cli:contract`
- `npm run docs:check`
- focused assertion in `tests/commands/command_contract.test.ts` for the
  improved flag-description source

# Links / Artifacts

- `loop-4`
- `prop-4`
- `test-366`
