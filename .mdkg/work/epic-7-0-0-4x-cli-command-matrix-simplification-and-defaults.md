---
id: epic-7
type: epic
title: 0.0.4x cli command matrix simplification and defaults
status: done
priority: 1
tags: [0_0_4x, cli, ux, defaults]
owners: []
links: []
artifacts: [CLI_COMMAND_MATRIX.md, src/cli.ts, .mdkg/skills/registry.md, implement-10, implement-11]
relates: [dec-10, dec-11, prd-1, edd-5, edd-9, epic-4, epic-6, epic-8, epic-10]
blocked_by: []
blocks: [task-60, task-61, task-62, task-65, task-66, implement-10, implement-11, test-28, test-29, test-30, test-31]
refs: []
aliases: [command-matrix, cli-simplification]
created: 2026-03-05
updated: 2026-03-08
---

# Goal

Track post-`0.0.4` simplification work to reduce unnecessary flags, clarify primary vs advanced commands, and strengthen sensible defaults around a pack-first workflow.

# Scope

- command/flag inventory and complexity audit
- compatibility map and deprecation roadmap
- primary-vs-advanced command tiering
- pack-first workflow centrality in help/docs
- skills dogfooding and tolerant `SKILLS.md` compatibility planning
- docs/help parity updates for simplified defaults

# Milestones

- M1: inventory and recommendations captured
- M2: compatibility/deprecation plan reviewed
- M3: implementation and parity checks complete

# Out of Scope

- blocking the `0.0.4` release cut

# Risks

- simplification can break scripts without explicit compatibility guidance

# Links / Artifacts

- `dec-10`
- `dec-11`
- `epic-10`
