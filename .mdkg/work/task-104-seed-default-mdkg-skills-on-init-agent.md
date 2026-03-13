---
id: task-104
type: task
title: seed default mdkg skills on init agent
status: done
priority: 1
epic: epic-16
tags: [0_0_6, agent, skills, init]
owners: []
links: []
artifacts: [src/commands/init.ts, src/commands/skill_mirror.ts, src/commands/skill_support.ts, scripts/copy-init-assets.js, assets/init/skills/default/select-work-and-ground-context/SKILL.md, assets/init/skills/default/build-pack-and-execute-task/SKILL.md, assets/init/skills/default/verify-close-and-checkpoint/SKILL.md]
relates: [dec-19, epic-16]
blocked_by: []
blocks: [test-58, test-61]
refs: []
aliases: []
skills: [author-mdkg-skill]
created: 2026-03-11
updated: 2026-03-11
---
# Overview

Seed the three core mdkg usage skills during `init --agent` so new repos get immediate skill value instead of empty registries and empty product mirrors.

# Acceptance Criteria

- init assets include seeded canonical skills separate from `SKILL.md.example`
- `mdkg init --agent` creates the three seeded canonical skills if missing
- seeded skills are mirrored into `.agents/skills/` and `.claude/skills/`
- `.mdkg/skills/registry.md` reflects the seeded skills after bootstrap
- `author-mdkg-skill` is not part of the seeded set

# Files Affected

- `src/commands/init.ts`
- `src/commands/skill_mirror.ts`
- `src/commands/skill_support.ts`
- `assets/init/skills/`

# Implementation Notes

- treat seeded skills as init assets, not as copies from this repo's live `.mdkg/skills/`
- preserve create-if-missing semantics unless `--force` is supplied

# Test Plan

- `test-58`
- `test-61`

# Links / Artifacts

- `dec-19`
