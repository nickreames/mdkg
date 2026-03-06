---
id: task-42
type: task
title: plan node skill references and cross validation
status: done
priority: 1
epic: epic-4
tags: [v0_4, skills, validation]
owners: []
links: []
artifacts: []
relates: [prd-1, dec-8, dec-9, edd-2, edd-3, edd-5]
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-02-27
updated: 2026-03-05
---

# Overview

Define schema and validation contracts for optional node `skills: [...]` references and cross-check those references against indexed skills.

# Acceptance Criteria

- Target node schema extension (`skills`) is documented for work-item nodes.
- Cross-validation behavior is documented for dangling/missing skill references.
- Validation severity model is defined for required vs optional skill metadata checks.
- Skill usage guidance remains portable with flattened optional metadata keys.
- Parser/template/schema update implications are documented explicitly.

# Files Affected

- src/graph/frontmatter.ts
- src/graph/template_schema.ts
- src/graph/node.ts
- src/commands/validate.ts
- .mdkg/design/edd-2-mdkg-v0-4-architecture-indexing-validation-packs-skills.md

# Implementation Notes

- Keep v0.4 optional metadata extensibility compatible with strict frontmatter constraints.
- Prefer deterministic failure messaging for missing skill references.

# Test Plan

Future implementation should validate node-skill reference integrity and error/warning behavior (`test-13`).

# Links / Artifacts

- prd-1
- dec-8
- dec-9
- edd-2
- edd-3
- edd-5
- epic-4
