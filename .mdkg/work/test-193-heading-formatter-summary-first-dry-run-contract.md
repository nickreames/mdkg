---
id: test-193
type: test
title: heading formatter summary-first dry-run contract
status: done
priority: 1
epic: epic-114
parent: goal-23
tags: [format, headings, test]
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
cases: []
created: 2026-06-21
updated: 2026-06-21
---
# Overview

Prove heading formatter previews are safe and bounded for large historical migrations.

# Target / Scope

- format command
- heading migration dry-run
- summary and truncation metadata

# Preconditions / Environment

- Temp repo or fixture with many files missing recommended headings.

# Test Cases

- `format --headings --dry-run --summary --json --limit 20` returns summary-first metadata.
- Change samples are bounded.
- Truncation metadata reports omitted changes.
- Files are not mutated without `--apply`.

# Results / Evidence

- Pending.

# Notes / Follow-ups

- If formatter output grows unbounded, keep `task-431` open.
