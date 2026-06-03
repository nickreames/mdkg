---
id: epic-38
type: epic
title: subgraph sync materialization and cross graph references
status: done
priority: 1
tags: [subgraph, bundle, materialize, orchestration, references]
owners: []
links: []
artifacts: []
relates: [epic-21, epic-22, epic-23, epic-27, edd-11]
blocked_by: []
blocks: [task-215, task-216, task-217, task-218, task-219, task-220, task-221, task-222]
refs: [rule-3, edd-11]
aliases: [subgraph-sync, subgraph-materialize, cross-graph-refs]
skills: []
created: 2026-06-03
updated: 2026-06-03
---

# Goal

Add root-owned subgraph sync and materialization workflows so orchestration repos
can refresh child mdkg snapshots from clean child Git repos, inspect generated
bundle contents locally, and reference child graph nodes with subgraph-prefixed
qids.

# Scope

- Add `mdkg subgraph sync` for explicit child bundle generation from configured
  `source_path` values.
- Add `mdkg subgraph materialize` for generated read-only extraction trees.
- Support portable subgraph refs such as `child:work.generate-image`.
- Keep `subgraph refresh` reload-only.
- Keep child repos read-only from root commands.

# Milestones

- Graph/design alignment is captured in `edd-11` and tasks `task-215` through
  `task-222`.
- Sync builds, verifies, and records root-owned bundles without child mutation.
- Materialize safely extracts bundles and is ignored by local graph scanning.
- Cross-subgraph refs validate and pack/search/show cleanly.
- Packed temp smoke proves root plus two child submodule behavior.

# Out of Scope

- No child commits, pushes, pulls, checkouts, resets, or mdkg Markdown edits.
- No automatic bundle creation during `subgraph refresh`.
- No write-through root mutation into child graphs.
- No hosted orchestration service or external object store.

# Risks

- Sync could accidentally hide child dirty state if receipts are unclear.
- Materialized views could be mistaken for local source if scanners miss the
  exclusion.
- Cross-graph refs could blur ownership if parent/epic semantics are not kept
  local for root-authored nodes.

# Links / Artifacts

- `epic-21`
- `epic-22`
- `epic-27`
- `edd-11`
- Closed with tasks `task-215` through `task-222` done.
- Evidence: `npm run test`, `npm run cli:check`, `node dist/cli.js validate`, `npm run smoke:subgraph`, `node scripts/assert-publish-ready.js`, isolated-cache `npm pack --dry-run --json`, isolated-cache `npm publish --dry-run`, and `git diff --check` passed. The dry-run publish ran the full `prepublishOnly` smoke gate and reported `+ mdkg@0.1.7`.
