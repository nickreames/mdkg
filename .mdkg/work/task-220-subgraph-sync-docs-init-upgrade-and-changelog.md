---
id: task-220
type: task
title: subgraph sync docs init upgrade and changelog
status: done
priority: 1
epic: epic-38
prev: task-219
next: task-221
tags: [subgraph, docs, init, upgrade, changelog]
owners: []
links: []
artifacts: []
relates: [edd-11, rule-3]
blocked_by: []
blocks: []
refs: [rule-3]
aliases: [subgraph-sync-docs]
skills: []
created: 2026-06-03
updated: 2026-06-03
---

# Overview

Align public docs, seeded init assets, core CLI rules, and changelog with the
new sync/materialize command surface and cross-graph reference support.

# Acceptance Criteria

- README, command matrix, seeded init docs, AGENT_START, and core CLI rules
  describe `subgraph sync` and `subgraph materialize`.
- Docs keep `subgraph refresh` as reload-only.
- Changelog has a new unreleased entry for the next `0.1.x` release.
- Upgrade/init guidance includes ignoring materialized views by default.

# Files Affected

- `README.md`
- `CLI_COMMAND_MATRIX.md`
- `assets/init/**`
- `.mdkg/core/rule-3-cli-contract.md`
- `CHANGELOG.md`

# Implementation Notes

Keep public docs generic and avoid consumer-specific branding.

# Test Plan

- `npm run cli:check`
- init smoke validates seeded docs.

# Links / Artifacts

- `edd-11`
- Updated public docs, seeded init docs, core CLI rules, changelog, ignore guidance, and command matrix for `subgraph sync`, `subgraph materialize`, cross-subgraph refs, and `0.1.7`.
- Evidence: `npm run cli:check` passed.
