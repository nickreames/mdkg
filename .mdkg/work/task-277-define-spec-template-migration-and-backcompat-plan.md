---
id: task-277
type: task
title: define SPEC template migration and backcompat plan
status: todo
priority: 1
epic: epic-51
parent: goal-8
tags: [spec, migration, compatibility, templates]
owners: []
links: []
artifacts: []
relates: [goal-8, epic-51, test-105]
blocked_by: [task-268, task-276]
blocks: [task-278]
refs: [edd-14]
aliases: [spec-backcompat-plan]
skills: [author-mdkg-skill]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Define migration and compatibility behavior for existing templates and seeded
assets.

# Acceptance Criteria

- Existing `spec` nodes and template consumers remain valid or receive clear
  warnings.
- Template upgrades are previewable before apply.
- Downstream product-specific extensions are not rewritten by mdkg defaults.

# Test Plan

- Future upgrade dry-run contract references SPEC template changes.

# Files Affected

- mdkg planning nodes only.

# Implementation Notes

- Preserve existing template consumers unless a future migration is explicit.

# Links / Artifacts

- `goal-8`
- `epic-51`
