---
id: task-137
type: task
title: implement bundle public private filtering
status: done
priority: 1
epic: epic-22
tags: [bundle, privacy, visibility]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
created: 2026-05-17
updated: 2026-05-17
---
# Overview

Enforce profile filtering so public bundles are useful for orchestration
handoffs without silently leaking private workspace or archive context.

# Acceptance Criteria

- Private bundles include selected enabled workspaces except explicit unsafe or
  derived exclusions.
- Public bundles include only workspaces configured with `visibility: public`.
- Public bundles fail clearly when no selected workspaces are public.
- Public bundles include public archive sidecars and committed ZIP caches only.
- Public bundle creation fails when included public nodes reference private
  graph nodes or private archive nodes.
- Raw `.mdkg/archive/**/source/`, `.mdkg/pack/`, `.mdkg/index/`, and nested
  `.mdkg/bundles/` entries are excluded from all profiles.

# Files Affected

- `src/commands/bundle.ts`
- `tests/commands/bundle.test.ts`
- `scripts/smoke-bundle.js`

# Implementation Notes

- Archive visibility is read from indexed `archive` sidecars and applied to
  both sidecar `.md` files and adjacent committed ZIP caches.
- Public filtering checks graph edge fields plus archive URI references in
  node attributes, links, refs, and artifacts.
- Public profile intentionally omits raw config files because workspace config
  can contain private child topology.

# Test Plan

- `node --test dist/tests/commands/bundle.test.js`
- `npm run smoke:bundle`
- `npm publish --dry-run`

# Links / Artifacts

- `src/commands/bundle.ts`
- `scripts/smoke-bundle.js`
