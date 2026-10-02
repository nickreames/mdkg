---
id: rule-6
type: rule
title: Templates and schema guidance
tags: [mdkg, guidance]
owners: []
links: []
artifacts: []
relates: []
refs: []
aliases: []
created: 2026-09-09
updated: 2026-09-09
---

# Purpose

Create coherent graph nodes without turning copied examples into a second schema.

# Scope

Templates guide authored content; schema and CLI validation enforce supported
fields. Project-specific conventions remain separate from generated guidance.

# Requirements

- Inspect current templates and `mdkg help new` before introducing a node type.
- Use structured reference fields for graph links and prose for supporting detail.
- Do not allocate fixed graph/node identities in reusable seeds or templates.
- Keep stable repository conventions in instructions, assignments in work nodes,
  repeatable procedures in skills, and capability contracts in manifests.
- Canonical project skills live under .mdkg/skills; native mirrors are adapters.
- Preserve customization and preview managed upgrades instead of overwriting
  existing templates or skill bodies without approval.

# Validation

Run graph validation and relevant template/skill checks. A well-formed Markdown
file alone does not prove reference closure, skill availability or execution safety.
