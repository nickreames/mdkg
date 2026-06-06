---
id: epic-43
type: epic
title: safe projection export design
status: done
priority: 2
tags: [projection, exporter, no-secret, codex]
owners: []
links: []
artifacts: []
relates: [goal-6, edd-14]
blocked_by: []
blocks: [task-256, test-92]
refs: [dec-21, dec-22]
aliases: [safe-exporter-design]
skills: []
created: 2026-06-04
updated: 2026-06-04
---
# Overview

Design `.codex/agents` export doctrine without implementing the exporter.

# Goal

Define safe exporter constraints before implementation.

# Scope

Source links, drift policy, and no-secret export policy.

# Milestones

- Exporter deferral recorded.
- Manual edit policy recorded.

# Out of Scope

- Exporter source code.

# Risks

- Generated projections overwrite local edits silently.

# Links / Artifacts

- `edd-14`
