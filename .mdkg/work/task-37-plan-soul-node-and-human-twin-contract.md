---
id: task-37
type: task
title: plan soul and human core node contract
status: done
priority: 1
epic: epic-4
tags: [v0_4, soul, human]
owners: []
links: []
artifacts: []
relates: [prd-1, dec-8, dec-9, edd-2, edd-3, edd-4]
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-02-27
updated: 2026-03-05
---

# Overview

Define 0.0.4 documentation contracts for `.mdkg/core/SOUL.md` and `.mdkg/core/HUMAN.md` as strict nodes.

# Acceptance Criteria

- `SOUL.md` node constraints are explicit and schema-safe.
- `HUMAN.md` is defined as a core strict node (not `.mdkg/twin/`).
- Core pin semantics remain ID-only.
- Path conventions are documented as planned structure without creating scaffolding yet.

# Files Affected

- src/graph/workspace_files.ts
- src/graph/indexer.ts
- src/commands/init.ts
- src/pack/verbose_core.ts
- .mdkg/core/rule-1-mdkg-conventions.md
- .mdkg/design/edd-2-mdkg-v0-4-architecture-indexing-validation-packs-skills.md
- .mdkg/design/edd-4-mdkg-init-agent-specification-0-0-5.md

# Implementation Notes

- Keep determinism and strict frontmatter expectations for indexed markdown nodes.
- Clarify that this pass is docs/planning only.

# Test Plan

Future implementation should verify indexing behavior for valid/invalid SOUL and HUMAN core nodes and init scaffolding expectations (`test-9`).

# Links / Artifacts

- prd-1
- dec-8
- dec-9
- edd-2
- edd-3
- edd-4
- epic-4
