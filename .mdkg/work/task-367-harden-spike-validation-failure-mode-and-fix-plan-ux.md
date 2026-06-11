---
id: task-367
type: task
title: harden spike validation failure-mode and fix-plan UX
status: todo
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
updated: 2026-06-11
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

# Links / Artifacts

- `task-348`
- `test-155`
