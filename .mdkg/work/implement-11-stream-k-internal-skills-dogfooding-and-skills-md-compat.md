---
id: implement-11
type: task
title: implement stream k internal skills dogfooding and skills md compat
status: done
priority: 1
epic: epic-7
tags: [v0_5, implementation, skills, dogfood]
owners: []
links: []
artifacts: [.mdkg/skills/registry.md, .mdkg/skills/select-work-and-ground-context/SKILL.md, .mdkg/skills/build-pack-and-execute-task/SKILL.md, .mdkg/skills/verify-close-and-checkpoint/SKILL.md, src/graph/skills_indexer.ts, src/commands/validate.ts]
relates: [dec-11, edd-5, edd-9, task-65, test-31, epic-7]
blocked_by: [implement-10]
blocks: [test-31]
refs: []
aliases: [stream-k, skills-dogfood]
created: 2026-03-05
updated: 2026-03-06
---

# Overview

Add real internal mdkg skills for the simplified workflow and implement tolerant `SKILLS.md` compatibility with canonical `SKILL.md`.

# Acceptance Criteria

- Three internal skills exist and are usable in the repo.
- `SKILL.md` remains canonical.
- `SKILLS.md` read-compat and conflict behavior are implemented and documented.

# Files Affected

- .mdkg/skills/
- src/graph/skills_indexer.ts
- src/commands/validate.ts

# Implementation Notes

- Dogfood the simplified CLI story, not the old matrix.

# Test Plan

- Satisfy `test-31` and command-level skill discovery/pack checks.

# Links / Artifacts

- epic-7
