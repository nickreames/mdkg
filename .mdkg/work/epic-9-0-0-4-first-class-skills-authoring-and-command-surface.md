---
id: epic-9
type: epic
title: 0.0.4 first class skills authoring and command surface
status: done
priority: 1
tags: [0_0_4, skills, cli, template]
owners: []
links: []
artifacts: [assets/skills/SKILL.md.example, src/commands/skill.ts, src/commands/skill_support.ts, .mdkg/skills/author-mdkg-skill/SKILL.md]
relates: [dec-12, dec-13, edd-5, edd-7, epic-10]
blocked_by: []
blocks: [task-68, task-69, task-70, task-71, task-72, test-33, test-34, test-35, test-36]
refs: []
aliases: [first-class-skills]
created: 2026-03-08
updated: 2026-03-08
---

# Goal

Make skills first-class authorable and discoverable inside the `0.0.4` release line.

# Scope

- built-in Anthropic-aligned skill template
- first-class `mdkg skill` namespace
- dogfooded authoring workflow and registry alignment

# Milestones

- M1: template and registry parity
- M2: skill scaffold command
- M3: skill namespace and validation complete

# Out of Scope

- runtime execution of skill scripts

# Risks

- docs and templates can drift if dogfood skills stop being the source truth

# Links / Artifacts

- `dec-12`
- `dec-13`
- `edd-5`
- `edd-7`
