---
id: task-63
type: task
title: manual core command behavior audit for human and agent loops
status: done
priority: 1
epic: epic-8
tags: [v0_4x, audit, ux, cli]
owners: []
links: []
artifacts: []
relates: [dec-11, edd-9, test-32, epic-8]
blocked_by: []
blocks: [test-32]
refs: []
aliases: []
created: 2026-03-05
updated: 2026-03-05
---

# Overview

Run and document manual behavior audits for the simplified primary mdkg workflow from both a human-builder and agent perspective.

# Acceptance Criteria

- Audit covers `init`, `new`, `search/show`, `next`, `pack`, and `validate`.
- Empty-state and failure-state UX notes are captured.
- Findings are usable as inputs to coverage hardening.

# Files Affected

- README.md
- src/cli.ts

# Implementation Notes

- Manual-first; no coverage thresholds should be locked before this audit.

# Test Plan

- Validate completion with `test-32`.

# Links / Artifacts

- epic-8
