---
id: task-342
type: task
title: implement reference rewrite receipts and stale goal repair planning
status: done
priority: 1
epic: epic-71
parent: goal-13
tags: [branches, refs, receipts, 0-3-6]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
created: 2026-06-09
updated: 2026-06-09
---
# Overview

Design and implement reference rewrite planning that makes duplicate-id repair
reviewable before any future apply mode exists.

# Acceptance Criteria

- Frontmatter refs are discovered for `epic`, `parent`, `prev`, `next`,
  `relates`, `blocked_by`, `blocks`, `scope_refs`, `active_node`, workflow refs,
  and archive/work refs.
- Markdown references to local qids/ids are reported with path/count metadata
  and manual-review confidence when replacement is ambiguous.
- Stale selected-goal state is planned separately from id rewrite and never
  silently repaired.
- Receipts include before/after ids, affected paths, replacement counts,
  blockers, and deterministic plan hash.

# Files Affected

- `src/commands/fix.ts`
- `src/graph/validate_graph.ts`
- goal selected-state helpers/tests

# Implementation Notes

- Keep reference rewrite as planning only.
- Separate exact structured frontmatter rewrites from fuzzy Markdown text
  mentions.
- Treat unknown or ambiguous locations as blockers, not low-confidence
  automatic rewrites.

# Test Plan

- Reference fixture unit tests.
- Stale selected-goal fixture tests.
- `node dist/cli.js validate --json`

# Links / Artifacts

- `edd-21`
- `task-341`
