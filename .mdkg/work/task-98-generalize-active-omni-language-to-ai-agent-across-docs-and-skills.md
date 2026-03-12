---
id: task-98
type: task
title: generalize active omni language to ai agent across docs and skills
status: done
priority: 1
epic: epic-14
tags: [0_0_5, docs, agent, skills]
owners: []
links: []
artifacts: [README.md, AGENT_START.md, .mdkg/skills/select-work-and-ground-context/SKILL.md, .mdkg/skills/build-pack-and-execute-task/SKILL.md, .mdkg/skills/verify-close-and-checkpoint/SKILL.md, .mdkg/skills/author-mdkg-skill/SKILL.md]
relates: [dec-16, dec-17, epic-14]
blocked_by: []
blocks: [test-52, test-55]
refs: []
aliases: []
skills: []
created: 2026-03-10
updated: 2026-03-10
---

# Overview

Remove current-language product specificity from the active docs and skill guidance.

# Acceptance Criteria

- active onboarding docs talk about AI agents, not Omni-specific behavior
- first-step skills and closeout skills use generic agent language
- historical records may remain historically accurate, but current guidance must be generic

# Files Affected

- `README.md`
- `AGENT_START.md`
- internal skills under `.mdkg/skills/`

# Implementation Notes

- keep historical `0.0.4` records intact where they are clearly historical
- update active design docs where they still describe current behavior incorrectly

# Test Plan

- `test-52`
- `test-55`

# Links / Artifacts

- `dec-16`
