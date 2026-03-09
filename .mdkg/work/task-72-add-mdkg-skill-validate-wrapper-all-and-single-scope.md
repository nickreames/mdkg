---
id: task-72
type: task
title: add mdkg skill validate wrapper all and single scope
status: done
priority: 1
epic: epic-9
tags: [v0_5, skills, cli, validation]
owners: []
links: []
artifacts: [src/commands/skill.ts, src/graph/skills_indexer.ts, src/commands/validate.ts]
relates: [dec-12, edd-5, test-36, epic-9]
blocked_by: []
blocks: [test-36]
refs: []
aliases: []
created: 2026-03-08
updated: 2026-03-08
---

# Overview

Add `mdkg skill validate` as a first-class wrapper for all-skill and single-skill validation using the same underlying file/frontmatter rules as the repo skill validation pass.

# Acceptance Criteria

- `mdkg skill validate` checks all skills.
- `mdkg skill validate <slug>` checks one skill.
- Validation behavior stays aligned with existing skill file rules.

# Files Affected

- src/commands/skill.ts
- src/graph/skills_indexer.ts
- src/commands/validate.ts

# Implementation Notes

- Reuse existing skill validation logic instead of creating a parallel policy path.

# Test Plan

- Validate via `test-36`.

# Links / Artifacts

- epic-9
