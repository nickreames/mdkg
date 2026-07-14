---
id: test-428
type: test
title: Public packs cannot consume external private cache bodies
status: done
priority: 1
epic: epic-242
tags: [security, regression, v0.5.0]
owners: []
links: []
artifacts: []
relates: [goal-69]
blocked_by: []
blocks: []
refs: [edd-75, dec-80]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-07-12
updated: 2026-07-12
---
# Overview

Prove forged/stale graph or skills cache paths and visibility labels cannot pull
external or private body content into packs or public projections.

# Target / Scope

`task-767`, graph/skills caches, body readers, packs, and visibility.

# Preconditions / Environment

Disposable public/private graph plus adjacent unique sentinels and forged caches.

# Test Cases

- Out-of-root, linked, missing, malformed, and stale cache paths fail/rebuild from
  canonical state without reading the sentinel.
- Public pack rejects private canonical refs despite forged public cache labels.
- Valid private/local and public packs remain deterministic.
- No read-only repair persists cache state.

# Results / Evidence

- `cand-review-010-005` forges graph-cache path and visibility fields toward an
  adjacent Markdown sentinel; the public pack rebuilds canonical state in
  memory and contains the canonical body only.
- `cand-review-010-006` forges a skills-cache path toward an adjacent SKILL.md;
  full-depth public packing includes the canonical procedure and excludes the
  external sentinel.
- Cache readers validate structure, workspace/skill-root containment, and
  identity. Node and skill body reads use no-link contained file access and
  verify frontmatter identity before returning bodies.
- Passed 618 package tests, 8 public-release tests, and visibility, bundle, MCP,
  and capability packaged smokes. See `chk-502`.

# Notes / Follow-ups

- Closed. Valid stale `--no-reindex` metadata behavior remains compatible while
  unsafe accepted caches fail closed; no read-only repair is persisted.
