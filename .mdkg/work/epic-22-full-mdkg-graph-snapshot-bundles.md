---
id: epic-22
type: epic
title: full mdkg graph snapshot bundles
status: todo
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

- Define a deterministic bundle manifest with mdkg version, source repo, source
  commit, created timestamp, public/private profile, file list, and hashes.
- Include authored `.mdkg` markdown, templates, skills, archive sidecars,
  compressed archive caches, and prebuilt indexes.
- Exclude `.mdkg/pack`, raw secret/payment/ledger state, and public export of
  private records by default.
- Add validation and doctor guidance for stale or missing configured snapshots.
- Update internal commit-cadence skills so configured repositories refresh
  archive compression and snapshot bundles before commit.

# Out of Scope

- No replacement for Markdown as source of truth.
- No canonical execution database for work orders or receipts.
- No raw production secrets, credentials, ledger mutation state, payment state,
  or marketplace inventory state.
- No official npm CLI/docs branding around Omni; this remains generic mdkg
  graph snapshot behavior.

# Risks

- Snapshot bundles can become stale unless source commit and freshness metadata
  are visible.
- Private-local bundles can leak sensitive graph details if published or shared
  as public artifacts.
- Deterministic compression must normalize ordering, timestamps, paths, and
  hashes to avoid noisy git churn.

# Links / Artifacts

- `epic-23`
- `epic-24`
- `epic-27`
- `~/omni-chat-rooms` root orchestration model
