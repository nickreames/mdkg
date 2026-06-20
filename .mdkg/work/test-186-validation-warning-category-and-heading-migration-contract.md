---
id: test-186
type: test
title: validation warning category and heading migration contract
status: done
priority: 1
epic: epic-109
parent: goal-22
tags: [validation, warnings, migration]
owners: []
links: []
artifacts: []
relates: [task-420]
blocked_by: [task-420]
blocks: []
refs: []
aliases: [warning-migration-contract]
skills: []
cases: []
created: 2026-06-17
updated: 2026-06-17
---
# Overview

Validate warning category output and heading migration ergonomics.

# Target / Scope

- `mdkg validate --json` warning metadata.
- Changed-warning filtering.
- Heading migration dry-run and apply flow.

# Preconditions / Environment

- Temp repo with historical heading warnings and one real graph error.

# Test Cases

- Warning JSON includes id, category, severity, path, ref, and remediation.
- Changed-warning mode suppresses unchanged heading noise.
- Full graph errors still appear under changed-warning mode.
- Heading migration dry-run writes nothing; apply writes only planned heading updates.

# Results / Evidence

- Pending.

# Notes / Follow-ups

- Keep this strict enough that warning UX does not hide correctness issues.
