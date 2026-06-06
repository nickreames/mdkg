---
id: task-268
type: task
title: define canonical SPEC frontmatter and compatibility rules
status: todo
priority: 1
epic: epic-46
parent: goal-8
tags: [spec, frontmatter, compatibility]
owners: []
links: []
artifacts: []
relates: [goal-8, epic-46, test-99]
blocked_by: [task-266, task-267]
blocks: [task-271, task-277]
refs: [edd-14]
aliases: [spec-frontmatter-contract]
skills: [author-mdkg-skill]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Define canonical SPEC frontmatter keys, optional extension keys, and backwards
compatibility rules.

# Acceptance Criteria

- Required keys and optional keys are separated.
- Unknown-key diagnostics are classified as warning or error.
- Existing template frontmatter has a migration path.
- Product-specific extension keys are allowed only in downstream repos.

# Test Plan

- `mdkg validate`
- future `SPEC frontmatter contract` capability search

# Files Affected

- mdkg planning nodes only.

# Implementation Notes

- Keep existing SPEC consumers compatible unless a future migration task says
  otherwise.

# Links / Artifacts

- `goal-8`
- `epic-46`
