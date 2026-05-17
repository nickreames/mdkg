---
id: epic-22
type: epic
title: full mdkg graph snapshot bundles
status: done
priority: 2
tags: [future, snapshot-bundle, compression, orchestration, archive]
owners: []
links: []
artifacts: []
relates: [epic-19, epic-20, epic-21, epic-23, epic-24, epic-27]
blocked_by: []
blocks: [epic-20, epic-21, epic-23]
refs: [rule-3, rule-4, edd-3, edd-8]
aliases: [mdkg-snapshot-bundles, full-graph-bundles]
skills: []
created: 2026-05-17
updated: 2026-05-17
---

# Goal

Define deterministic compressed read-only `.mdkg` graph snapshots for root and
child repo orchestration.

# Scope

Snapshot bundles are graph transport artifacts, not query caches. They preserve
enough authored mdkg state for higher-level graphs to plan against child repos
without scanning the full child checkout.

Default bundle posture:
- private-local by default
- tracked in private root and child git repos when configured
- public/export-safe only through an explicit filtered profile

# Milestones

- Added `mdkg bundle create/list/show/verify` as the explicit snapshot command
  namespace.
- Defined a deterministic manifest with mdkg version, source repo, source git
  HEAD, dirty flag, profile, selected workspaces, file metadata, index hashes,
  source tree hash, and bundle hash.
- Included selected authored `.mdkg` markdown/templates/skills/event files,
  archive sidecars, committed archive ZIP caches, and freshly generated bundle
  indexes.
- Excluded `.mdkg/pack/`, existing `.mdkg/index/`, nested `.mdkg/bundles/`, and
  raw `.mdkg/archive/**/source/` files.
- Shipped private and public profiles together; public creation fails closed
  when public records reference private graph or archive nodes.
- Added bundle config defaults, docs, help snapshots, command matrix coverage,
  packed temp-repo smoke, and release skill guidance.

# Out of Scope

- No replacement for Markdown as source of truth.
- No canonical execution database for work orders or receipts.
- No raw production secrets, credentials, ledger mutation state, payment state,
  or marketplace inventory state.
- No official npm CLI/docs branding around Omni; this remains generic mdkg
  graph snapshot behavior.

# Risks

- Snapshot bundles can become stale unless `mdkg bundle verify` is run before
  handoff or commit.
- Private-local bundles can leak sensitive graph details if published or shared
  as public artifacts.
- Bundle import and lazy read-only subgraph loading are intentionally deferred
  to `epic-23`.

# Verification Evidence

- `npm run test`
- `npm run cli:check`
- `node dist/cli.js validate`
- `npm run smoke:consumer`
- `npm run smoke:matrix`
- `npm run smoke:upgrade`
- `npm run smoke:init`
- `npm run smoke:capabilities`
- `npm run smoke:archive-work`
- `npm run smoke:bundle`
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run`

# Links / Artifacts

- `epic-23`
- `epic-24`
- `epic-27`
- `~/omni-chat-rooms` root orchestration model
