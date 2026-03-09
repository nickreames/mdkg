---
id: test-35
type: test
title: skill command alias parity and discovery contract
status: done
priority: 1
epic: epic-9
tags: [v0_5, skills, cli, discovery]
owners: []
links: []
artifacts: [src/cli.ts, src/commands/skill.ts, tests/commands/skill_namespace.test.ts]
relates: [task-71, dec-12, epic-9]
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-03-08
updated: 2026-03-08
---

# Overview

Validate that the focused `mdkg skill` command aliases produce the same discovery results as the existing generic skill flows.

# Cases

- `skill list` matches `list --type skill`.
- `skill show <slug>` matches `show skill:<slug>`.
- `skill search` matches `search --type skill`.
- Help output teaches the focused skill UX without breaking compatibility.

# Evidence

- task-71

# Exit Criteria

- Skill-specific discovery is first-class and behaviorally consistent.
