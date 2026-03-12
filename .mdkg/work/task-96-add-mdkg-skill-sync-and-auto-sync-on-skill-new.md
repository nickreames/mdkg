---
id: task-96
type: task
title: add mdkg skill sync and auto sync on skill new
status: done
priority: 1
epic: epic-14
tags: [0_0_5, skills, sync, cli]
owners: []
links: []
artifacts: [src/commands/skill.ts, src/commands/skill_mirror.ts, src/cli.ts, tests/commands/skill_mirrors.test.ts]
relates: [dec-18, epic-14]
blocked_by: []
blocks: [test-53]
refs: []
aliases: []
skills: []
created: 2026-03-10
updated: 2026-03-10
---

# Overview

Add explicit skill sync plus automatic sync after `mdkg skill new` when agent bootstrap is active.

# Acceptance Criteria

- `mdkg skill sync` exists and is documented
- `mdkg skill new` updates mirrors automatically when mirror maintenance is enabled
- sync supports explicit `--force` override for managed collision replacement

# Files Affected

- `src/commands/skill.ts`
- `src/commands/skill_mirror.ts`
- `src/cli.ts`
- `tests/commands/skill_mirrors.test.ts`

# Implementation Notes

- canonical skills remain under `.mdkg/skills/`
- sync should be deterministic across both mirror targets

# Test Plan

- `test-53`

# Links / Artifacts

- `dec-18`
