---
id: task-543
type: task
title: add valid frontmatter examples and common mistakes sections to major concept and guide docs
status: todo
priority: 1
epic: epic-176
parent: goal-34
tags: [mdkg-dev, docs, examples]
owners: []
links: []
artifacts: []
relates: [goal-34, test-264]
blocked_by: [task-539, task-540, task-541]
blocks: [task-544]
refs: [archive://archive.mdkg-dev-preview-audit-pass-4-2026-06-24]
context_refs: [edd-45]
evidence_refs: []
aliases: []
skills: []
created: 2026-06-24
updated: 2026-06-24
---
# Overview

Make concept docs more concrete by showing valid node frontmatter and common mistakes.

# Acceptance Criteria

- Work Node Types includes at least three valid examples.
- Reference Types includes a complete refs/context/evidence example.
- Major concept/guide pages include concise common mistakes or avoid sections.
- Examples use supported fields only and avoid secret-like raw content.

# Files Affected

- `docs/src/content/docs/concepts/**`
- `docs/src/content/docs/guides/**`
- docs smoke scripts if examples are validated

# Implementation Notes

- Common mistakes should be concrete: scope_refs vs context_refs, queue state vs history, raw prompts, child graph mutation, and expecting mdkg to execute checks.

# Test Plan

Docs build, command/example checks, and frontmatter example validation where feasible.

# Links / Artifacts

- `test-264`
