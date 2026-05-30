---
id: task-161
type: task
title: bundle bundle import and visibility audit
status: done
priority: 1
epic: epic-28
tags: [release, audit, bundle, import, visibility]
owners: []
links: []
artifacts: [src/commands/bundle.ts, src/commands/bundle_import.ts, src/graph/visibility.ts]
relates: [epic-28, epic-22, epic-23, epic-27]
blocked_by: []
blocks: [task-163, task-164]
refs: [rule-3, rule-4, edd-8]
aliases: [bundle-visibility-audit]
skills: []
created: 2026-05-19
updated: 2026-05-19
---

# Overview

Audit deterministic full-graph bundles, read-only bundle imports, lazy imported
graph loading, and fail-closed visibility behavior before release.

# Acceptance Criteria

- Private bundles include authored mdkg content, archive sidecars, ZIP caches,
  and generated indexes while excluding pack outputs, bundle outputs, source
  caches, and raw archive sources.
- Public bundles include only public-safe records and fail closed on private or
  internal graph, archive, or import refs.
- Bundle imports project child nodes under import-alias qids and remain
  read-only.
- Stale imports remain readable with warnings, while `bundle import verify`
  exits nonzero.
- Public/internal imports require public bundle profiles.
- Mutating task and work commands reject imported qids with explicit source
  workspace guidance.

# Files Affected

Read-only audit targets:
- `src/commands/bundle.ts`
- `src/commands/bundle_import.ts`
- `src/graph/bundle_imports.ts`
- `src/graph/visibility.ts`
- `scripts/smoke-bundle.js`
- `scripts/smoke-bundle-import.js`
- `scripts/smoke-visibility.js`

# Implementation Notes

Do not implement bundle import write-through or automatic submodule scanning.
Imported bundles are read-only planning views in this release.

# Test Plan

- Run `npm run smoke:bundle`.
- Run `npm run smoke:bundle-import`.
- Run `npm run smoke:visibility`.
- Run targeted bundle, import, and visibility unit tests if any smoke fails.

# Links / Artifacts

- `epic-22`
- `epic-23`
- `epic-27`

# Audit Evidence

- `npm run smoke:bundle` passed with packaged `mdkg@0.1.4`.
- `npm run smoke:bundle-import` passed with packaged `mdkg@0.1.4`.
- `npm run smoke:visibility` passed with packaged `mdkg@0.1.4`.
- `npm run test` passed coverage for:
  - deterministic private bundles with generated indexes and exclusions
  - public bundle fail-closed behavior for private archive refs
  - bundle verification of stale and malformed bundles
  - read-only import projection and imported qids
  - stale imports warning during reads and failing `bundle import verify`
  - public bundle rejection when public local nodes reference private imports
  - rejecting public/internal imports backed by private bundle profiles
  - effective visibility across workspace nodes, archive sidecars, and imports
  - `pack --visibility public` filtering and fail-closed private ref audits
- Package dry-run contents include bundle/import/visibility compiled modules:
  `dist/commands/bundle.js`, `dist/commands/bundle_import.js`,
  `dist/graph/bundle_imports.js`, and `dist/graph/visibility.js`.

# Result

Bundle creation, bundle verification, read-only bundle imports, stale import
diagnostics, and public/internal/private visibility enforcement are
release-ready.
