---
id: task-71
type: task
title: add mdkg skill list show search focused aliases
status: done
priority: 1
epic: epic-9
tags: [v0_5, skills, cli, aliases]
owners: []
links: []
artifacts: [src/commands/skill.ts, src/cli.ts, README.md]
relates: [dec-12, edd-5, test-35, epic-9]
blocked_by: []
blocks: [test-35]
refs: []
aliases: []
created: 2026-03-08
updated: 2026-03-08
---

# Overview

Add focused `mdkg skill list/show/search` aliases while preserving the existing generic skill-capable discovery flows.

# Acceptance Criteria

- Skill aliases reuse the same underlying behavior as generic skill discovery.
- Help and README present the skill namespace as the primary skill UX.
- Existing generic compatibility remains intact.

# Files Affected

- src/commands/skill.ts
- src/cli.ts
- README.md

# Implementation Notes

- Do not fork list/show/search skill logic.

# Test Plan

- Validate via `test-35`.

# Links / Artifacts

- epic-9
