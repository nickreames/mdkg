---
id: epic-9
type: epic
title: v0.5 first class skills authoring and command surface
status: done
priority: 1
tags: [v0_5, skills, cli, authoring]
owners: []
links: []
artifacts: [assets/skills/SKILL.md.example, src/commands/skill.ts, src/commands/skill_support.ts, README.md, .mdkg/skills/registry.md]
relates: [dec-11, dec-12, edd-5, edd-7, epic-7]
blocked_by: []
blocks: [task-68, task-69, task-70, task-71, task-72, test-33, test-34, test-35, test-36]
refs: []
aliases: [skills-authoring, skill-command-surface]
created: 2026-03-08
updated: 2026-03-08
---

# Goal

Make mdkg skills first-class for authoring as well as consumption.

# Scope

- built-in Anthropic-aligned skill template
- `mdkg skill` command family
- deterministic registry updates
- doc and dogfood parity for skill authoring

# Milestones

- M1: authoring contract and template locked
- M2: scaffold + registry update implemented
- M3: focused skill command aliases and validation wrapper implemented

# Out of Scope

- runtime execution of skill scripts
- nested metadata map support
- removal of existing generic skill-compatible commands

# Risks

- duplicate logic between generic and skill-specific commands
- skill docs drifting from the actual generated scaffold

# Links / Artifacts

- dec-12
- task-68
- task-69
- task-70
- task-71
- task-72
