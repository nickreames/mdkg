---
id: task-70
type: task
title: add mdkg skill new scaffold and registry update
status: done
priority: 1
epic: epic-9
tags: [v0_5, skills, cli, scaffold]
owners: []
links: []
artifacts: [src/commands/skill.ts, src/commands/skill_support.ts, src/cli.ts, README.md]
relates: [dec-12, edd-5, test-34, epic-9]
blocked_by: []
blocks: [test-34]
refs: []
aliases: []
created: 2026-03-08
updated: 2026-03-08
---

# Overview

Implement `mdkg skill new` so users can scaffold valid skills quickly and get deterministic registry updates automatically.

# Acceptance Criteria

- `skill new` creates `SKILL.md`, `references/`, and `assets/`.
- `scripts/` is opt-in via `--with-scripts`.
- Existing skills are not overwritten unless `--force` is passed.
- Registry output updates automatically after scaffold creation.

# Files Affected

- src/commands/skill.ts
- src/commands/skill_support.ts
- src/cli.ts

# Implementation Notes

- Keep skill scaffolding root-owned.
- Use the built-in template rather than hard-coded scattered strings.

# Test Plan

- Validate via `test-34`.

# Links / Artifacts

- epic-9
