---
id: task-544
type: task
title: deepen generated CLI reference into user-facing command docs while keeping command contract maintainer-facing
status: todo
priority: 1
epic: epic-176
parent: goal-34
tags: [mdkg-dev, cli-reference, docs]
owners: []
links: []
artifacts: []
relates: [goal-34, test-265]
blocked_by: [task-537, task-540, task-542, task-543]
blocks: [task-547]
refs: [archive://archive.mdkg-dev-preview-audit-pass-4-2026-06-24]
context_refs: [edd-43, dec-42]
evidence_refs: []
aliases: []
skills: []
created: 2026-06-24
updated: 2026-06-24
---
# Overview

Turn generated CLI reference into a useful user-facing command reference while keeping the command contract clearly maintainer-facing.

# Acceptance Criteria

- CLI Reference starts with user command selection and beginner-safe command groups.
- Generated command docs include purpose, usage, flags, mutating/read-only status, formats, examples, related docs, and alpha labels for core commands.
- Command Contract is labeled maintainer/integration-facing.
- Docs fail or warn when generated reference drifts from `dist/command-contract.json`.
- `test-265` passes.

# Files Affected

- `scripts/generate-docs-reference.js`
- `docs/_generated/**`
- `docs/src/content/docs/reference/**`

# Implementation Notes

- Do not manually duplicate the full command matrix.

# Test Plan

`npm run docs:check`, command docs smoke, generated-reference freshness checks.

# Links / Artifacts

- `test-265`
