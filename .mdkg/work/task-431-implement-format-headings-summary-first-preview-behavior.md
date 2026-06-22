---
id: task-431
type: task
title: implement format headings summary-first preview behavior
status: done
priority: 1
epic: epic-114
parent: goal-23
tags: [format, headings, warnings]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-21
updated: 2026-06-21
---
# Overview

Make `mdkg format --headings --dry-run --json` usable for repos with many historical heading warnings.

# Acceptance Criteria

- Format receipts include summary fields before or alongside full `changes`.
- `--summary --json --limit <n>` limits emitted change samples and includes truncation metadata.
- `--apply` remains opt-in and unchanged.
- Tests prove summary mode does not mutate files.

# Files Affected

- src/commands/format.ts
- tests/commands/format.test.ts

# Implementation Notes

- Prefer one shared summary helper when practical, but avoid over-abstracting if command shapes differ.

# Test Plan

- `npm run test -- tests/commands/format.test.ts`
- `npm run smoke:warning-ux`

# Links / Artifacts

- test-193
