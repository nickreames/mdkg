---
id: task-151
type: task
title: archive visibility and bundle integration closeout
status: done
priority: 1
epic: epic-24
tags: [archive, visibility, bundle, pack, closeout]
owners: []
links: []
artifacts: []
relates: [epic-24, epic-22, epic-23, epic-27, task-149, task-150]
blocked_by: [task-149, task-150]
blocks: []
refs: [edd-3, edd-8, rule-4]
aliases: [archive-bundle-visibility-closeout]
skills: []
created: 2026-05-18
updated: 2026-05-18
---

# Overview

Close the archive integration loop across public/private pack output, snapshot
bundles, bundle imports, doctor, and validation.

# Acceptance Criteria

- Private archive sidecars remain private by default and are available to local
  private packs and private bundles.
- Public archive sidecars can be included in public packs and public bundles
  only when references do not cross into less-visible graph or archive records.
- Bundle creation includes eligible sidecar `.md` and ZIP cache files while
  excluding raw `.mdkg/archive/**/source/` copies.
- Imported bundle references involving archives remain read-only and respect
  visibility diagnostics.
- `doctor`, `validate`, `pack`, `bundle`, and `bundle import` tests prove the
  same visibility policy is used consistently.

# Files Affected

- `src/commands/archive.ts`
- `src/commands/bundle.ts`
- `src/commands/bundle_import.ts`
- `src/commands/pack.ts`
- `src/graph/visibility.ts`
- `tests/commands/bundle.test.ts`
- `tests/commands/bundle_import.test.ts`
- `tests/commands/pack.test.ts`

# Implementation Notes

This task should close archive integration without changing the public rule that
visibility is an export-safety layer, not content redaction or secret scanning.

Closeout evidence:
- Archive sidecars remain private by default and can be made public only through
  explicit `mdkg archive add --visibility public` intent.
- Public/internal pack and public bundle paths reuse the shared visibility
  policy and fail closed on less-visible archive references.
- Bundle creation includes archive sidecar `.md` files and ZIP caches while
  excluding raw `.mdkg/archive/**/source/` copies.
- Bundle import and visibility smoke coverage proves read-only imported graph
  views continue to respect archive/export safety diagnostics.
- Docs and core rules now describe strict archive ZIP verification, outside-repo
  source redaction, large-cache warnings, and pre-commit archive/bundle refresh.

# Test Plan

- Run focused pack, bundle, bundle-import, and visibility tests.
- Run `npm run smoke:bundle`.
- Run `npm run smoke:bundle-import`.
- Run `npm run smoke:visibility`.
- Run `node dist/cli.js validate`.
- Run `git diff --check`.

# Links / Artifacts

- `epic-24`
- `epic-22`
- `epic-23`
- `epic-27`
- `task-149`
- `task-150`
- `npm run smoke:bundle` passed.
- `npm run smoke:bundle-import` passed.
- `npm run smoke:visibility` passed.
- `npm run cli:check` passed.
