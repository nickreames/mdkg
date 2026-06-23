---
id: test-219
type: test
title: Starlight docs local build nav metadata and generated reference contract
status: todo
priority: 1
epic: epic-138
parent: goal-28
tags: []
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-06-22
updated: 2026-06-22
---
# Overview

Validate that the future Starlight docs project builds locally and preserves generated reference behavior.

# Target / Scope

- `task-473`
- `task-474`
- `docs/`

# Preconditions / Environment

- Starlight has been scaffolded under `docs/`.
- Current docs/generated reference files remain available or scripts have been intentionally updated.

# Test Cases

- `npm --prefix docs run build` passes.
- Starlight nav includes start-here, concepts, guides, advanced alpha, reference, and project sections.
- Generated CLI reference remains linked and `npm run docs:check` passes.
- Metadata is appropriate for the future `docs.mdkg.dev` surface.

# Results / Evidence

Pending future implementation.

# Notes / Follow-ups

- Do not manually duplicate the full CLI reference; preserve generated-docs source of truth.
