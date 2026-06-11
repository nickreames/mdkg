---
id: task-329
type: task
title: harden subgraph sync materialize audit and upgrade plan
status: done
priority: 1
epic: epic-75
parent: goal-13
tags: [subgraph, audit, upgrade-plan, 0-3-4, 0-3-5]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: [task-326]
refs: [epic-68]
aliases: []
skills: []
created: 2026-06-09
updated: 2026-06-09
---
# Overview

Advance the existing subgraph roadmap under `goal-13`. `subgraph sync` and
`subgraph materialize` already exist, so this slice hardens and proves them
while adding native audit and upgrade-plan contracts.

# Acceptance Criteria

- Existing sync/materialize behavior is audited before changes.
- Root-contained `source_path`, dirty child repo refusal, no child mutation,
  bundle verification, and materialization marker safety are specified.
- `subgraph audit` and `subgraph upgrade-plan` JSON contracts are designed.
- Capability sync summaries and strict validation are scoped without leaking
  private content.
- Tests cover path escape, symlink escape, stale bundles, visibility, and
  materialized-tree exclusion from index/search/validate.

# Files Affected

- `src/commands/subgraph.ts`
- `src/cli.ts`
- `tests/commands/subgraph.test.ts`
- `scripts/smoke-subgraph.js`
- `scripts/assert-publish-ready.js`
- `CLI_COMMAND_MATRIX.md`
- `README.md`
- `assets/init/CLI_COMMAND_MATRIX.md`
- `assets/init/README.md`

# Implementation Notes

- Added read-only `mdkg subgraph audit [alias|--all] [--target <path>]`.
- Added read-only `mdkg subgraph upgrade-plan [alias|--all]`.
- Audit receipts include typed checks for source Git state, dirty tracked child
  files, bundle validity/freshness, root-owned bundle paths, and materialized
  target marker safety.
- Audit and upgrade-plan receipts include count-only capability summaries so
  orchestrators can reason about child capability coverage without leaking
  private node content.
- Upgrade plans return `apply_supported: false` and block on dirty child repos,
  invalid bundles, unsafe bundle paths, and unusable source paths.
- Existing `subgraph sync` and `subgraph materialize` behavior remains the
  mutation boundary; child repos are never committed, pushed, checked out, or
  mutated by the new commands.

# Test Plan

- `npm run test`
- `npm run cli:check`
- `npm run smoke:subgraph`
- `node scripts/assert-publish-ready.js`
- `node dist/cli.js validate --json`
- `node dist/cli.js goal next goal-13 --json`
- `git diff --check`

# Links / Artifacts

- `epic-75`
- `epic-68`
