---
id: test-36
type: test
title: skill validate all and single scope contract
status: done
priority: 1
epic: epic-9
tags: [v0_5, skills, validation]
owners: []
links: []
artifacts: [src/commands/skill.ts, src/graph/skills_indexer.ts, tests/commands/skill_validate.test.ts]
relates: [task-72, dec-12, epic-9]
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-03-08
updated: 2026-03-08
---

# Overview

Validate that `mdkg skill validate` supports both all-skill and single-skill scope while staying aligned to the existing skill file validation rules.

# Cases

- All-skill validation succeeds on valid skills.
- Single-skill validation succeeds on valid target skill.
- Missing or malformed skill files fail deterministically.
- Legacy `SKILLS.md` compatibility produces the expected warning in both scopes.

# Evidence

- task-72

# Exit Criteria

- Focused skill validation is trustworthy and consistent with repo-wide skill checks.
