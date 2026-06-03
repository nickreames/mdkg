---
id: task-216
type: task
title: subgraph sync source safety and bundle generation
status: done
priority: 1
epic: epic-38
prev: task-215
next: task-217
tags: [subgraph, sync, git, bundle]
owners: []
links: []
artifacts: []
relates: [epic-22, edd-11]
blocked_by: []
blocks: []
refs: [rule-3]
aliases: [subgraph-sync-source-safety]
skills: []
created: 2026-06-03
updated: 2026-06-03
---

# Overview

Implement the read-only child Git inspection and bundle generation core for
`mdkg subgraph sync`.

# Acceptance Criteria

- `source_path` is required, root-relative, contained, a Git repo root, and has
  `.mdkg`.
- Dirty tracked child changes fail by default.
- `--allow-dirty` permits sync and records dirty state.
- Child repos are never committed, pushed, pulled, checked out, reset, or edited.
- Each enabled source builds the configured `expected_profile` bundle.

# Files Affected

- `src/commands/subgraph.ts`
- `src/commands/bundle.ts`
- tests

# Implementation Notes

Use shared bundle-builder internals instead of shelling out. Verify the
generated bundle against the child source root before reporting success.

# Test Plan

- Dry clean child repo sync succeeds.
- Dirty tracked child repo sync fails without `--allow-dirty`.
- `--allow-dirty` succeeds and records dirty status.

# Links / Artifacts

- `edd-11`
- Implemented `mdkg subgraph sync` source-path inspection, clean Git checks, root-owned bundle guard, and bundle verification.
- Evidence: `npm run test` passed; `npm run smoke:subgraph` passed with root-owned bundle sync.
