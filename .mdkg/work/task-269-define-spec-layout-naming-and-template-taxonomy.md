---
id: task-269
type: task
title: define SPEC layout naming and template taxonomy
status: todo
priority: 1
epic: epic-47
parent: goal-8
tags: [spec, layout, naming, templates]
owners: []
links: []
artifacts: [.mdkg/templates/specs]
relates: [goal-8, epic-47, test-100]
blocked_by: [task-267]
blocks: [task-270]
refs: [edd-14, dec-23, dec-24]
aliases: [spec-template-taxonomy]
skills: [author-mdkg-skill]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Define canonical template locations, filenames, headings, and naming rules.

# Acceptance Criteria

- Canonical mdkg templates remain under `.mdkg/templates/specs`.
- Default node template behavior is reconciled with specialized SPEC templates.
- Template names remain generic.
- Optional capability URI examples use generic schemes only.

# Test Plan

- `mdkg capability search "SPEC template taxonomy" --json`
- Product-name grep over template paths and contents.

# Files Affected

- mdkg planning nodes only.

# Implementation Notes

- Keep public template names generic and open-source friendly.

# Links / Artifacts

- `goal-8`
- `epic-47`
