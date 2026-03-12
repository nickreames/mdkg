---
id: task-95
type: task
title: add safe agents and claude skill mirror bootstrap to init agent
status: done
priority: 1
epic: epic-14
tags: [0_0_5, skills, mirrors, init]
owners: []
links: []
artifacts: [src/commands/init.ts, src/commands/skill_mirror.ts, tests/commands/init.test.ts, tests/commands/skill_mirrors.test.ts]
relates: [dec-18, epic-14]
blocked_by: []
blocks: [test-53, test-54]
refs: []
aliases: []
skills: []
created: 2026-03-10
updated: 2026-03-10
---

# Overview

Teach `init --agent` to create safe product-specific skill mirror roots without corrupting preexisting directories.

# Acceptance Criteria

- `.agents/skills/` and `.claude/skills/` are created if missing
- unrelated existing folders remain untouched
- same-slug unmanaged collisions fail clearly

# Files Affected

- `src/commands/init.ts`
- `src/commands/skill_mirror.ts`
- `tests/commands/init.test.ts`
- `tests/commands/skill_mirrors.test.ts`

# Implementation Notes

- bootstrap is append-focused, not destructive
- mirror ownership is tracked through mdkg-managed metadata

# Test Plan

- `test-53`
- `test-54`

# Links / Artifacts

- `dec-18`
