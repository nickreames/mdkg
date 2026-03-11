---
id: task-71
type: task
title: add mdkg skill list show search focused discovery surface
status: done
priority: 1
epic: epic-9
tags: [v0_5, skills, cli, aliases]
owners: []
links: []
artifacts: [src/commands/skill.ts, src/cli.ts, README.md, CLI_COMMAND_MATRIX.md]
relates: [dec-12, dec-13, edd-5, test-35, epic-9, epic-10]
blocked_by: []
blocks: [test-35]
refs: []
aliases: []
created: 2026-03-08
updated: 2026-03-08
---

# Overview

Add focused `mdkg skill list/show/search` discovery commands as the public skill surface.

# Acceptance Criteria

- Skill-specific discovery is the only supported skill surface before publish.
- Help and README present the skill namespace as the primary skill UX.
- Generic `list/show/search` skill access is removed.

# Files Affected

- src/commands/skill.ts
- src/cli.ts
- README.md

# Implementation Notes

- Keep skill loading and filtering logic consistent even though generic skill access is removed.

# Test Plan

- Validate via `test-35`.

# Links / Artifacts

- epic-9
