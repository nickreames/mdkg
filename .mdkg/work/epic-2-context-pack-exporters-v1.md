---
id: epic-2
type: epic
title: context pack exporters v1
status: todo
priority: 2
tags: [pack, exporters, context]
links: [cmd:pack, format:md, format:json, format:toon, format:xml]
artifacts: []
relates: [epic-1, rule-2, rule-3]
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-01-13
updated: 2026-01-13
---

# Goal

Deliver deterministic context pack generation with traversal, ordering, limits, and exports for md/json/toon/xml.

# Scope

- pack engine (selection, ordering, truncation metadata)
- CLI wiring for `mdkg pack`
- exporters for Markdown, JSON, TOON, XML
- tests for traversal, ordering, limits, and exporter output

# Milestones

- M1: pack engine + CLI wiring
- M2: md/json/toon exporters
- M3: xml exporter + tests

# Out of Scope

- alternative traversal strategies (`--prefer-checkpoints`, etc.)
- non-pack CLI commands
- workspace template overrides

# Risks

- ordering determinism and limit handling regressions
- missing format specs causing inconsistent outputs
- pack size enforcement for large graphs

# Links / Artifacts

- rule-2
- rule-3
