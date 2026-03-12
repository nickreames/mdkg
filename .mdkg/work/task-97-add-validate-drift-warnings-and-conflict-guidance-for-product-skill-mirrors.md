---
id: task-97
type: task
title: add validate drift warnings and conflict guidance for product skill mirrors
status: done
priority: 1
epic: epic-14
tags: [0_0_5, skills, mirrors, validate]
owners: []
links: []
artifacts: [src/commands/validate.ts, src/commands/skill_mirror.ts, tests/commands/skill_mirrors.test.ts]
relates: [dec-18, epic-14]
blocked_by: []
blocks: [test-54]
refs: []
aliases: []
skills: []
created: 2026-03-10
updated: 2026-03-10
---

# Overview

Warn on stale or conflicting product-specific mirrors instead of mutating them silently.

# Acceptance Criteria

- `mdkg validate` warns when mirrors drift from canonical skills
- validate warns when mirror roots or manifests are missing
- guidance points users to `mdkg skill sync`

# Files Affected

- `src/commands/validate.ts`
- `src/commands/skill_mirror.ts`
- `tests/commands/skill_mirrors.test.ts`

# Implementation Notes

- warnings should preserve current successful validation behavior when mirrors merely drift
- unmanaged conflicts remain explicit guidance, not silent overwrite behavior

# Test Plan

- `test-54`

# Links / Artifacts

- `dec-18`
