---
id: task-287
type: task
title: reconcile default and canonical SPEC templates with the 0.3.0 contract
status: done
priority: 2
epic: epic-60
parent: goal-9
prev: task-286
next: task-288
tags: [spec, templates, upgrade, init]
owners: []
links: []
artifacts: [.mdkg/templates/default/spec.md, .mdkg/templates/specs]
relates: [goal-9, epic-60, test-116]
blocked_by: [task-286]
blocks: [task-288, test-116]
refs: [dec-26]
aliases: [spec-template-reconciliation]
skills: [author-mdkg-skill]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Align the default scaffold and rich SPEC templates with the implemented 0.3.0
validation behavior.

# Acceptance Criteria

- Default SPEC template is minimal and valid.
- Rich templates include `spec_kind` and reusable capability sections.
- Templates avoid downstream product naming.

# Files Affected

- `.mdkg/templates/default/spec.md`
- `.mdkg/templates/specs`

# Implementation Notes

- Keep the default scaffold smaller than the rich template family.

# Test Plan

- Template fixture validation.
- `node dist/cli.js upgrade --dry-run --json`
- `node dist/cli.js validate`

# Links / Artifacts

- `test-116`
