---
id: epic-11
type: epic
title: 0.0.4x structured output format expansion
status: done
priority: 1
tags: [0_0_4x, cli, json, xml, toon, markdown]
owners: []
links: []
artifacts: [epic-17-bootstrap-config-cleanup-discovery-exports-and-release.md]
relates: [dec-13, epic-10, epic-17]
blocked_by: []
blocks: [task-80, task-81, task-82]
refs: []
aliases: [output-format-expansion]
created: 2026-03-08
updated: 2026-03-08
---

# Goal

Historical planning record for extending discovery and show commands beyond JSON after the first structured-output wave stabilized.

# Scope

- This planning work was superseded by `epic-17`, which implemented XML / TOON / Markdown discovery/show output directly.

# Milestones

- M1: XML planning recorded
- M2: TOON planning recorded
- M3: Markdown planning recorded

# Out of Scope

- implementation in the `0.0.4` wave
- changes to tag-based stage discovery
- task lifecycle mutation commands

# Risks

- format expansion can fragment output contracts if it is not anchored to JSON first

# Links / Artifacts

- `dec-13`
- `epic-10`
- superseded by `epic-17`, `task-112`, and `task-113`
