---
id: task-367
type: task
title: harden spike validation failure-mode and fix-plan UX
status: done
priority: 1
epic: epic-84
parent: goal-14
tags: [spike, validation, fix-plan, ux]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-348]
blocks: []
refs: []
aliases: []
skills: []
created: 2026-06-11
updated: 2026-06-15
---
# Overview

Harden validation and repair-planning UX for spike records so malformed spikes
fail clearly and dry-run repair guidance remains useful.

# Acceptance Criteria

- Missing or invalid spike frontmatter fails `mdkg validate --json` with
  actionable diagnostics.
- Invalid spike ids, statuses, priorities, edge refs, and template shape are
  covered by tests.
- `mdkg fix plan --json` remains non-mutating and reports relevant template,
  index, duplicate-id, or reference guidance for spike-related failures where
  existing repair families apply.
- JSON output remains parseable; diagnostics stay out of JSON stdout.
- Help/docs steer users to edit Markdown body sections for research evidence.

# Files Affected

- Validation tests.
- Fix-plan tests and docs/help text where needed.

# Implementation Notes

- Do not invent automatic spike repair apply behavior in this release.
- Prefer clear diagnostics over broad mutation.
- Reuse existing dry-run receipt shape for repair plans.

# Test Plan

- `npm run test`
- `node dist/cli.js validate --json`
- temp-repo malformed spike checks
- `mdkg fix plan --json` fixture checks

# Results / Evidence

- Added spike recommended headings to `runValidateCommand`, so skeletal spike
  bodies now emit template-shape warnings for missing research/planning
  sections while preserving Markdown-body flexibility.
- Added `tests/commands/validate.test.ts` coverage for malformed spikes:
  invalid spike id, invalid status, invalid priority, missing edge refs,
  missing recommended spike headings, parseable JSON stdout, and empty
  diagnostics stderr in the command helper.
- Extended `fix plan refs` planning to inspect indexed `links`, `artifacts`,
  and `refs` fields in addition to custom attributes. This makes missing
  archive refs in normal spike `artifacts` visible in read-only repair plans.
- Added `tests/commands/fix.test.ts` coverage for spike-specific repair
  guidance:
  - missing graph refs from spike edges,
  - missing archive refs from spike artifacts,
  - duplicate spike IDs with deterministic `spike-*-dup-*` candidate guidance,
  - no mutation and `apply_supported: false`.
- Extended `scripts/smoke-spike.js` with a second packed installed CLI temp repo
  for malformed spike UX. It verifies `validate --json` failure output,
  `fix plan --family refs --target spike-2 --json`, and `fix plan --family ids
  --target spike-2 --json`.
- Updated `mdkg help new` to tell users to record spike research evidence by
  editing Markdown body sections.
- Verification passed:
  - `npm run build`
  - `npm run build:test`
  - `node --test dist/tests/commands/validate.test.js dist/tests/commands/fix.test.js dist/tests/commands/cli_help_matrix.test.js dist/tests/graph/node.test.js`
  - `npm run cli:check`
  - `npm run test`
  - `npm run smoke:fix-plan`
  - `npm run smoke:spike`; malformed temp repo:
    `/private/tmp/mdkg-spike.WRqi2V/malformed-repo`
  - `npm run cli:contract`
  - `node dist/cli.js index`
  - `node dist/cli.js validate --json`
  - `git diff --check`

# Closeout Notes

- No `fix apply` behavior was added.
- No automatic spike body repair, web search, follow-up node creation, or
  `SKILL.md` generation was added.
- No publish, tag, or push was performed.

# Links / Artifacts

- `task-348`
- `test-155`
