---
id: task-266
type: task
title: audit current SPEC template and default spec surfaces
status: todo
priority: 1
epic: epic-46
parent: goal-8
tags: [audit, spec, templates]
owners: []
links: []
artifacts: [.mdkg/templates/specs, .mdkg/templates/default/spec.md]
relates: [goal-8, epic-46, test-98]
blocked_by: []
blocks: [task-267, task-268]
refs: [edd-14]
aliases: [current-spec-surface-audit]
skills: [select-work-and-ground-context]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Audit the current SPEC templates, default `spec.md`, capability indexing, and
authoring guidance before expanding the design.

# Acceptance Criteria

- Current template families are listed.
- Gaps between `.mdkg/templates/specs` and `.mdkg/templates/default/spec.md` are
  recorded.
- Existing discovery and validation behavior is summarized.
- No source implementation is changed.

# Test Plan

- `mdkg capability search "SPEC template taxonomy" --json`
- `mdkg validate`

# Files Affected

- mdkg planning nodes only.

# Implementation Notes

- Inspect current template and default surfaces before proposing implementation.

# Links / Artifacts

- `goal-8`
- `epic-46`
