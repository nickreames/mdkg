---
id: test-35
type: test
title: skill command surface and discovery contract
status: done
priority: 1
epic: epic-9
tags: [v0_5, skills, cli, discovery]
owners: []
links: []
artifacts: [src/cli.ts, src/commands/skill.ts, tests/commands/skill_namespace.test.ts]
relates: [task-71, dec-12, dec-13, epic-9, epic-10]
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-03-08
updated: 2026-03-08
---

# Overview

Validate that the focused `mdkg skill` commands remain the only supported skill discovery surface.

# Cases

- `skill list`, `skill show`, and `skill search` cover the supported skill discovery surface.
- Generic `list/show/search` skill access fails with explicit migration guidance.
- Help output teaches the focused skill UX.

# Evidence

- task-71

# Exit Criteria

- Skill-specific discovery is first-class and unambiguous.
