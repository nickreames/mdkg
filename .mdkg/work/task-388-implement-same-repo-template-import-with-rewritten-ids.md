---
id: task-388
type: task
title: implement same repo template import with rewritten ids
status: done
priority: 2
epic: epic-93
parent: goal-18
tags: [0.3.5, template-import]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-386]
blocks: [test-166, task-389]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-17
---
# Overview

Implement same-repo template import with deterministic ID and link rewriting.

Implemented `mdkg graph import-template` for same-repo template work-node
imports with dry-run/apply receipts.

# Acceptance Criteria

- No ID collisions remain.
- Every rewritten reference has a receipt entry.
- Imported graph can be scoped to a selected goal.

# Files Affected

- src/**
- tests/**
- scripts/**

# Implementation Notes

- `graph import-template` accepts bundle paths or live directories containing
  `.mdkg/config.json`.
- The command imports authored `.mdkg/work/*.md` template nodes and skips config,
  generated index files, archives, bundles, and subgraph materializations.
- Dry-run is the default; `--apply` is required for mutation.
- `--dry-run` and `--apply` are mutually exclusive.
- Canonical numeric IDs are rewritten deterministically to the next unused ID by
  type prefix.
- Colliding semantic IDs require `--id-prefix`.
- Structured frontmatter refs and body-local ID/qid mentions are rewritten and
  reported in `rewritten_refs`.
- `--select-goal` requires `--start-goal` and writes selected-goal state only
  after apply validation.
- Apply runs under the mdkg mutation lock, rebuilds derived indexes, and
  validates before returning success.

# Test Plan

- `npm run build`
- `npm run build:test`
- `node --test dist/tests/commands/graph.test.js`
- `node --test dist/tests/commands/cli_help_matrix.test.js dist/tests/commands/cli.test.js dist/tests/commands/command_contract.test.js`

# Links / Artifacts

- src/commands/graph.ts
- tests/commands/graph.test.ts
- scripts/cli_help_targets.js
- dist/command-contract.json
- chk-154
