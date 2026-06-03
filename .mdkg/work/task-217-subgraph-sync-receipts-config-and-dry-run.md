---
id: task-217
type: task
title: subgraph sync receipts config and dry run
status: done
priority: 1
epic: epic-38
prev: task-216
next: task-218
tags: [subgraph, sync, receipts, config]
owners: []
links: []
artifacts: []
relates: [task-216, edd-11]
blocked_by: []
blocks: []
refs: [rule-3]
aliases: [subgraph-sync-receipts]
skills: []
created: 2026-06-03
updated: 2026-06-03
---

# Overview

Make sync receipts explicit and update root-owned subgraph metadata only when
non-dry-run sync succeeds.

# Acceptance Criteria

- `sync --dry-run` writes no bundles, config, indexes, or materialized files.
- JSON receipts include updated, skipped, errors, warnings, old/new bundle
  hashes, old/new `source_repo`, dirty state, stale state, and intended paths.
- Successful non-dry-run sync updates `subgraphs.<alias>.source_repo` to
  `<branch>@<sha>`.
- `sync --all` continues across aliases and exits nonzero if any alias fails.

# Files Affected

- `src/commands/subgraph.ts`
- `src/cli.ts`
- tests

# Implementation Notes

Use the existing mutation lock for non-dry-run sync. Receipts should be stable
and useful for orchestration agents.

# Test Plan

- Dry-run write-safety assertions.
- Bundle hash and `source_repo` change after a committed child mdkg change.
- Mixed `--all` success/error receipt coverage.

# Links / Artifacts

- `task-216`
- Implemented dry-run/no-write receipts, old/new bundle hashes, dirty tracked state reporting, and `source_repo` updates.
- Evidence: focused subgraph tests cover `sync --dry-run`, normal sync, and `--allow-dirty` receipts.
