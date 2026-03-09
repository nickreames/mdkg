---
id: test-34
type: test
title: skill new scaffold registry and opt in scripts contract
status: done
priority: 1
epic: epic-9
tags: [v0_5, skills, scaffold, registry]
owners: []
links: []
artifacts: [src/commands/skill.ts, tests/commands/skill_new.test.ts]
relates: [task-69, task-70, dec-12, epic-9]
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-03-08
updated: 2026-03-08
---

# Overview

Validate that `mdkg skill new` scaffolds the right files and directories, updates the registry, and only creates `scripts/` when explicitly requested.

# Cases

- Default scaffold creates `SKILL.md`, `references/`, and `assets/`.
- `--with-scripts` adds `scripts/`.
- Registry updates deterministically after scaffold creation.
- Existing skills require `--force` before overwrite.

# Evidence

- task-69
- task-70

# Exit Criteria

- Skill creation is fast, deterministic, and registry-aware.
