---
id: task-176
type: task
title: deterministic capability resolver
status: done
priority: 1
epic: epic-21
tags: [capability, resolve, orchestration, ranking]
owners: []
links: []
artifacts: []
relates: [epic-21, epic-19, task-175]
blocked_by: []
blocks: [task-179, task-180]
refs: []
aliases: [capability-resolve]
skills: []
created: 2026-05-27
updated: 2026-05-30
---

# Overview

Add `mdkg capability resolve` as the first orchestration primitive for local and
subgraph capabilities.

# Acceptance Criteria

- CLI supports `mdkg capability resolve [query] [--requires <capability>] [--fresh-only] [--json]`.
- Resolver includes local and configured subgraph capability records.
- Ranking is deterministic: visibility, permissions, freshness, required
  capability match, input/output compatibility, linked spec/work context, text
  match, version compatibility, then stable qid/path tie-breaks.
- Stale candidates are included by default with degraded ranking and warnings.
- `--fresh-only` excludes stale candidates.
- Receipt history may be exposed as evidence but does not affect ranking in this
  phase.

# Files Affected

- capability command implementation
- capability index projection
- resolver tests and smoke coverage

# Implementation Notes

Keep the resolver deterministic and explainable. Do not add AI-generated
summaries, embeddings, receipt-weighted ranking, or remote execution.

# Test Plan

- Unit tests for ranking order, stable tie-breaks, stale degradation, and
  `--fresh-only` filtering.
- CLI tests for query-only, requires-only, combined query/requirement, and JSON
  envelope output.
- Temp root/child smoke proves root resolves child `WORK.md` through a subgraph.

# Verification Evidence

Completed in the 0.1.4 implementation pass.

- Added `mdkg capability resolve [query] [--requires <capability>]
  [--fresh-only] [--json]`.
- Resolver includes local and subgraph capability records with deterministic
  scoring for locality, freshness, read permission, query match, required
  capability match, spec/work linkage, and stable qid/path tie-breaks.
- Stale subgraphs remain visible with warnings and degraded ranking, while
  `--fresh-only` excludes them.
- Verified with command tests, command help snapshots, and `npm run
  smoke:subgraph`.

# Links / Artifacts

- `epic-19`
- `epic-21`
- `task-175`
