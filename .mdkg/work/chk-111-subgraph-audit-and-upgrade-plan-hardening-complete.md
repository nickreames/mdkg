---
id: chk-111
type: checkpoint
title: subgraph audit and upgrade plan hardening complete
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-329]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-329]
created: 2026-06-09
updated: 2026-06-09
---
# Summary

`task-329` is complete. mdkg now has read-only `subgraph audit` and
`subgraph upgrade-plan` command surfaces that turn existing subgraph sync and
materialize safety rules into scriptable operator receipts.

# Scope Covered

- `task-329`
- `epic-75`
- existing `epic-68`/`goal-12` subgraph operations lane consolidation

# Decisions Captured

- `audit` and `upgrade-plan` are read-only; they do not build bundles, write
  config, write indexes, materialize trees, or mutate child repos.
- `upgrade-plan` returns `apply_supported: false`.
- Capability summaries are count-only to avoid leaking private child graph
  content through orchestration receipts.
- Existing `sync` and `materialize` remain the mutation-capable boundaries.

# Implementation Summary

- Added `mdkg subgraph audit [alias|--all] [--target <path>] [--json]`.
- Added `mdkg subgraph upgrade-plan [alias|--all] [--json]`.
- Audit checks cover source-path Git-root validity, dirty tracked child files,
  bundle validity/freshness, root-owned bundle paths, and optional materialized
  target marker safety.
- Upgrade plans propose safe sync/verify/materialize next steps and block on
  dirty child repos, invalid bundles, unsafe bundle paths, and unusable source
  paths.
- Updated command help, command matrix docs, root/init README guidance,
  publish-readiness assertions, and packed subgraph smoke coverage.

# Verification / Testing

- `npm run test`
  - passed with 446 tests.
- `npm run cli:check`
  - passed.
- `npm run smoke:subgraph`
  - passed with packed `mdkg-0.3.0.tgz`.
- `node scripts/assert-publish-ready.js`
  - passed.
- `node dist/cli.js index`
- `node dist/cli.js validate --json`
  - passed with zero warnings/errors.
- `node dist/cli.js goal next goal-13 --json`
  - returned `task-329` before closeout with no warnings.
- `git diff --check`
  - passed.

# Known Issues / Follow-ups

- No real npm publish, git tag, or push was performed.
- The next `goal-13` lane is branch conflict and multi-writer safety.

# Links / Artifacts

- `src/commands/subgraph.ts`
- `src/cli.ts`
- `tests/commands/subgraph.test.ts`
- `scripts/smoke-subgraph.js`
- `scripts/assert-publish-ready.js`
- `CLI_COMMAND_MATRIX.md`
- `README.md`
- `assets/init/CLI_COMMAND_MATRIX.md`
- `assets/init/README.md`
