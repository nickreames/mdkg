---
id: task-35
type: task
title: plan skills metadata indexing
status: done
priority: 1
epic: epic-4
tags: [v0_4, skills, index]
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

Define deterministic local metadata indexing requirements for skill packages under root `.mdkg/skills/`.

# Acceptance Criteria

- Skill indexing output is specified as `.mdkg/index/skills.json` separate from `global.json`.
- Root-owned skills scan scope is explicit (`.mdkg/skills/**/SKILL.md`).
- Required and optional skill metadata fields are documented, including flattened optional `ochatr_*` keys.
- Generic per-skill `tags` semantics are documented for filtering (no stage allowlist validation in v0.4).
- Gap between current index scope and v0.4 target is explicit.

# Files Affected

- src/graph/workspace_files.ts
- src/graph/indexer.ts
- src/core/config.ts
- .mdkg/design/prd-1-mdkg-product-spec-v0-4-deterministic-agent-memory-and-skills.md
- .mdkg/design/edd-2-mdkg-v0-4-architecture-indexing-validation-packs-skills.md

# Implementation Notes

- Keep skill body loading progressive; index metadata only in baseline path.
- Keep all behavior file-based and reproducible.
- Keep node graph and skills index as separate artifacts for clear boundaries.

# Test Plan

Future implementation should cover discovery, indexing determinism, flattened metadata compatibility, and missing/malformed skill handling (`test-10`, `test-18`).

# Links / Artifacts

- prd-1
- dec-8
- dec-9
- edd-2
- edd-3
- edd-5
- epic-4
