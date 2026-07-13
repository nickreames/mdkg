---
id: task-767
type: task
title: Bind cache body paths public visibility and subgraph projection integrity
status: done
priority: 1
epic: epic-242
tags: [security, remediation, v0.5.0]
owners: []
links: []
artifacts: []
relates: [goal-69]
blocked_by: [task-766]
blocks: []
refs: [edd-75, dec-80]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-12
updated: 2026-07-12
---
# Overview

Prevent derived graph/skill cache records from becoming filesystem or visibility
authority when packs and public projections read bodies.

# Acceptance Criteria

- Close exactly `cand-review-010-005` and `cand-review-010-006`.
- Runtime-validate cache rows and bind body paths to canonical graph/skill roots.
- Re-resolve visibility from canonical records before public pack inclusion.
- Reject stale, forged, linked, or out-of-root cache body paths without reading
  external content.
- Preserve deterministic in-memory rebuild and valid pack output.

# Files Affected

List files/directories expected to change.

- Graph and skills index cache loaders
- Node/skill body readers, pack traversal, and visibility modules
- Public pack/bundle tests and fixtures

# Implementation Notes

- Cache freshness by mtime is not schema, path, or visibility validation.
- Avoid persistent cache repair on read-only commands; coordinate with `task-770`.

# Test Plan

Forge cache paths and visibility in disposable repositories, prove public/private
external sentinels never enter packs, and run visibility/bundle/MCP/skill smokes
plus `test-428`.

# Links / Artifacts

- `task-766`, `task-770`, `epic-242`, `test-428`
