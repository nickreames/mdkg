---
id: test-31
type: test
title: 0.0.4x skills dogfooding and skills md compatibility contract
status: done
priority: 1
epic: epic-7
tags: [v0_5, skills, compatibility, dogfood]
owners: []
links: []
artifacts: [.mdkg/skills/registry.md, .mdkg/skills/select-work-and-ground-context/SKILL.md, .mdkg/skills/build-pack-and-execute-task/SKILL.md, .mdkg/skills/verify-close-and-checkpoint/SKILL.md, src/graph/skills_indexer.ts, src/commands/validate.ts, edd-5, edd-9]
relates: [dec-11, edd-5, edd-9, task-65, epic-7]
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-03-05
updated: 2026-03-06
---

# Overview

Validate the planned skills product-polish contract: dogfooded internal skills plus tolerant `SKILLS.md` compatibility while keeping `SKILL.md` canonical.

# Cases

- Canonical filename remains `SKILL.md`.
- Tolerant `SKILLS.md` behavior is documented as compatibility, not as canonical output.
- Conflict behavior for both files in one skill directory is defined.
- Dogfooding plan identifies internal skills that explain the simplified mdkg CLI workflow.

# Evidence

- dec-11
- edd-5
- edd-9

# Exit Criteria

- Skills product guidance is specific enough to implement without reopening filename policy.
