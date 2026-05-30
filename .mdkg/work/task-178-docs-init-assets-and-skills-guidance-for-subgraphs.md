---
id: task-178
type: task
title: docs init assets and skills guidance for subgraphs
status: todo
priority: 2
epic: epic-21
tags: [subgraph, docs, init, skills, onboarding]
owners: []
links: []
artifacts: []
relates: [epic-21, task-173, task-174, task-176, task-177]
blocked_by: [task-173, task-174, task-177]
blocks: [task-180]
refs: []
aliases: [subgraph-docs-guidance]
skills: []
created: 2026-05-27
updated: 2026-05-27
---

# Overview

Update public docs, generated init assets, and local skills so subgraphs and
capability resolution are the canonical orchestration path.

# Acceptance Criteria

- README, command matrix, `AGENT_START`, and init assets describe `mdkg subgraph`
  and `mdkg capability resolve`.
- Public onboarding no longer points users to `mdkg bundle import ...`.
- Skills explain that bundles are transport artifacts, subgraphs are
  orchestration records, and SQLite is a local rebuildable read model.
- Docs preserve the boundary that child repos own mutation and root graphs use
  read-only subgraph views for planning.

# Files Affected

- README and command matrix docs
- `AGENT_START.md`
- `assets/init/*`
- `.mdkg/skills/*/SKILL.md`

# Implementation Notes

Keep public docs generic. Consumer-specific handoff prompts belong in follow-up
tasks such as `task-171`, not in npm-facing docs.

# Test Plan

- CLI command parity check.
- Init smoke proves generated docs reference `subgraph` and not `bundle import`.
- Text audit for stale public `mdkg bundle import` onboarding references.

# Links / Artifacts

- `task-171`
- `task-173`
- `task-176`
