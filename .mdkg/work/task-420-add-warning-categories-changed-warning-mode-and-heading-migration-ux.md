---
id: task-420
type: task
title: add warning categories changed-warning mode and heading migration UX
status: done
priority: 1
epic: epic-109
parent: goal-22
tags: [validation, warnings, migration]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-414]
blocks: [test-186, task-423]
refs: []
aliases: [validation-warning-ux]
skills: []
created: 2026-06-17
updated: 2026-06-17
---
# Overview

Make validation output useful in large historical graphs without weakening correctness.

# Acceptance Criteria

- Validation JSON includes typed warning ids, categories, severity, paths, refs, and remediation text.
- A changed-warning mode limits noisy template/heading warnings to changed files while full graph errors still run.
- Heading migration supports dry-run and apply modes with receipts.
- Docs explain when to use full validation versus focused warning views.

# Files Affected

- Validation diagnostics.
- Format or upgrade migration command surface.
- CLI command matrix and docs.

# Implementation Notes

- Filtering applies to warning presentation, not graph error execution.
- Heading migration needs dry-run receipts before apply behavior.

# Test Plan

- Unit tests for category filters and changed-warning behavior.
- Heading migration temp-repo fixture.
- test-186

# Links / Artifacts

- test-186
