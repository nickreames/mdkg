---
id: task-254
type: task
title: add Markdown SPEC SKILL template taxonomy
status: done
priority: 1
epic: epic-41
parent: goal-6
tags: [templates, spec, skill]
owners: []
links: []
artifacts: [.mdkg/templates/specs, .mdkg/templates/skills]
relates: [goal-6, epic-41, test-90]
blocked_by: [task-252]
blocks: [task-255]
refs: [dec-23, dec-24, edd-14]
aliases: [template-taxonomy-task]
skills: []
created: 2026-06-04
updated: 2026-06-04
---
# Overview

Add canonical Markdown-first templates for SPEC and SKILL authoring.

# Acceptance Criteria

- Base SKILL template exists.
- Base and specialized SPEC templates exist.
- Templates include checks, evidence, security, and projection sections.

# Files Affected

- `.mdkg/templates/skills/`
- `.mdkg/templates/specs/`

# Implementation Notes

- Templates are Markdown standards, not generators.

# Test Plan

- Template coverage review.

# Closeout Evidence

- Added base SKILL and base/project/agent/tool/model/runtime image/capability/
  integration/API/OmniRuntime agent SPEC templates.

# Links / Artifacts

- `.mdkg/templates/skills/base.SKILL.md`
- `.mdkg/templates/specs/base.SPEC.md`
