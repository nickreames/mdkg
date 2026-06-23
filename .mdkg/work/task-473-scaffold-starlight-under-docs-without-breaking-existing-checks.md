---
id: task-473
type: task
title: scaffold Starlight under docs without breaking existing checks
status: todo
priority: 1
epic: epic-138
parent: goal-28
tags: []
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
created: 2026-06-22
updated: 2026-06-22
---
# Overview

Add a Starlight/Astro docs app under `docs/` while preserving existing docs files and generated-reference checks.

# Acceptance Criteria

- `docs/package.json` defines `build`, `dev`, and `preview` scripts.
- `docs/astro.config.mjs` uses the Starlight integration with title `mdkg Docs`.
- `docs/src/content.config.ts` configures Starlight docs collections.
- Existing `docs/README.md`, `docs/SUMMARY.md`, and `docs/_generated/*` remain available for current scripts.
- `npm --prefix docs run build` passes.

# Files Affected

List files/directories expected to change.

- `docs/`

# Implementation Notes

- Use official Starlight project structure: content pages live under `docs/src/content/docs/`.
- Prefer copying/migrating content rather than moving existing files until docs smoke scripts are updated.

# Test Plan

- `npm --prefix docs run build`
- `npm run docs:check`

# Links / Artifacts

- `epic-138`
- `test-219`
