---
id: task-557
type: task
title: expand generated command reference frontmatter examples common mistakes advanced alpha structure and diagrams
status: todo
priority: 1
epic: epic-185
parent: goal-35
tags: [mdkg-dev, docs, reference, diagrams]
owners: []
links: []
artifacts: []
relates: [test-277]
blocked_by: [task-556]
blocks: [task-558]
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-24
updated: 2026-06-24
---
# Overview

Deepen docs so users can recover from common mistakes and understand generated references without maintainer context.

# Acceptance Criteria

- Generated command reference has user-facing entrypoints and maintainer-facing details separated.
- Major concept and guide docs include valid frontmatter examples and common mistakes where relevant.
- Advanced alpha structure is coherent and not a dumping ground.
- Plan -> Work -> Evidence diagrams are deterministic accessible HTML/CSS/SVG.

# Test Plan

- `npm run docs:check`
- `npm run docs:check-commands`
- Pass-5 docs smoke.

# Files Affected

# Implementation Notes

# Links / Artifacts
