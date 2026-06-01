---
id: task-173
type: task
title: remove public bundle import surface
status: done
priority: 1
epic: epic-21
tags: [subgraph, bundle-import, cli, docs, migration]
owners: []
links: []
artifacts: []
relates: [epic-21, task-139, task-172]
blocked_by: []
blocks: [task-174, task-178]
refs: []
aliases: [remove-bundle-import-surface]
skills: []
created: 2026-05-27
updated: 2026-05-30
---

# Overview

Move users immediately to `mdkg subgraph ...` and remove `mdkg bundle import ...`
from the public CLI, generated docs, and onboarding surface.

# Acceptance Criteria

- Public help, README, command matrix, init assets, and skills no longer direct
  users to `mdkg bundle import ...`.
- CLI dispatch no longer exposes `mdkg bundle import ...` as a public command.
- Legacy `bundle_imports` config receives explicit upgrade/migration guidance.
- Existing bundle creation and verification commands remain under `mdkg bundle`.

# Files Affected

- `src/cli.ts`
- `src/commands/bundle_import.ts`
- README and command matrix docs
- init assets and mdkg skills

# Implementation Notes

This is intentionally not a soft alias. The public concept is `subgraph`; bundle
imports were the lower-level transport implementation and should not continue
to shape the user-facing orchestration model.

# Test Plan

- CLI help snapshots prove `bundle import` is absent and `subgraph` is present.
- Command matrix parity check proves docs match dispatch.
- Upgrade tests prove old `bundle_imports` configs are detected and receive
  actionable migration guidance.

# Verification Evidence

Completed in the 0.1.4 implementation pass.

- Replaced the public command surface with `mdkg subgraph ...`.
- Legacy `mdkg bundle import ...` now exits with explicit guidance to use
  `mdkg subgraph ...` and run `mdkg upgrade --apply` for legacy config.
- Updated README, command matrix, init docs, seeded skills, and core rules.
- Verified with CLI help tests, `npm run cli:check`, upgrade tests, init smoke,
  and `npm publish --dry-run`.

# Links / Artifacts

- `task-139`
- `task-172`
