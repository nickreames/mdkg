---
id: epic-11
type: epic
title: 0.0.4x structured output format expansion
status: todo
priority: 1
tags: [0_0_4x, cli, json, xml, toon, markdown]
owners: []
links: []
artifacts: []
relates: [dec-13, epic-10]
blocked_by: []
blocks: [task-80, task-81, task-82]
refs: []
aliases: [output-format-expansion]
created: 2026-03-08
updated: 2026-03-08
---

# Goal

Extend discovery and show commands beyond JSON after the first structured-output wave is stable.

# Scope

- add tracked plans for XML, TOON, and Markdown discovery/show output
- preserve the JSON envelopes as the reference starting point

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
