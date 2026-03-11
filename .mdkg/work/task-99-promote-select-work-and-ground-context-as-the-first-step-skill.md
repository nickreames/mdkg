---
id: task-99
type: task
title: promote select work and ground context as the first step skill
status: done
priority: 1
epic: epic-14
tags: [0_0_5, skills, onboarding, plan]
owners: []
links: []
artifacts: [AGENT_START.md, .mdkg/skills/select-work-and-ground-context/SKILL.md, .mdkg/skills/registry.md, README.md]
relates: [dec-17, epic-14]
blocked_by: []
blocks: [test-55]
refs: []
aliases: []
skills: []
created: 2026-03-10
updated: 2026-03-10
---

# Overview

Make the planning skill the explicit first procedural step for agents that do not yet know the active task.

# Acceptance Criteria

- `AGENT_START.md` points to `select-work-and-ground-context`
- skill registry explains that this is the first-step planning skill
- stage-tagged discovery examples lead agents to planning skills first

# Files Affected

- `AGENT_START.md`
- `.mdkg/skills/select-work-and-ground-context/SKILL.md`
- `.mdkg/skills/registry.md`
- `README.md`

# Implementation Notes

- no new bootstrap skill is added in this wave
- prefer one strong first-step skill over many weak startup options

# Test Plan

- `test-55`

# Links / Artifacts

- `dec-17`
