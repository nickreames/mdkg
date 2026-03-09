---
id: test-33
type: test
title: skill template registry and dogfood parity contract
status: done
priority: 1
epic: epic-9
tags: [v0_5, skills, template, registry]
owners: []
links: []
artifacts: [assets/skills/SKILL.md.example, .mdkg/skills/registry.md, tests/commands/skills.test.ts]
relates: [task-68, task-69, dec-12, epic-9]
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-03-08
updated: 2026-03-08
---

# Overview

Validate that the built-in skill template, registry guidance, and dogfood skills all describe and enforce the same minimum authoring contract.

# Cases

- Built-in scaffold matches the documented required section shape.
- Registry guidance reflects the canonical `SKILL.md` contract and first-class skill UX.
- Dogfood skills remain valid exemplars of the generated default shape.

# Evidence

- task-68
- task-69

# Exit Criteria

- Template, registry, docs, and dogfood skills are source-truth aligned.
