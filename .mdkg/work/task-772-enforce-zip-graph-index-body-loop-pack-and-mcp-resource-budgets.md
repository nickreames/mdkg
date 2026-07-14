---
id: task-772
type: task
title: Enforce ZIP graph index body loop pack and MCP resource budgets
status: done
priority: 1
epic: epic-244
tags: [security, remediation, v0.5.0]
owners: []
links: []
artifacts: []
relates: [goal-69]
blocked_by: []
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

Apply explicit budgets before resource-intensive work across archives, graph
indexing, imported bodies, loop closure, packs, and MCP request/response handling.

# Acceptance Criteria

- Close exactly `cand-review-002-007`, `cand-review-010-007`,
  `cand-review-010-009`, `cand-review-010-010`, `cand-review-009-003`,
  `cand-review-009-004`, and `cand-review-009-005`.
- Enforce ZIP local/central entry counts and inflated-byte limits before decoding
  or allocating full payloads.
- Bound graph file count/bytes, body inflation, recursive loop closure, pack body
  reads, MCP line/batch/body/response size, and duplicate identity validation.
- Return deterministic structured over-budget errors or explicit truncation
  metadata before expensive work.
- Valid large graphs remain configurable within documented safe ceilings.

# Files Affected

List files/directories expected to change.

- ZIP decoder/archive commands
- Graph indexer/node body/imported bundle and loop closure helpers
- Pack engine/command and MCP stdio/show/pack surfaces
- Config/schema/help and boundary tests

# Implementation Notes

- Limits checked after full traversal/read do not count as remediation.
- Avoid quadratic identity checks by indexing normalized prefixes/identities.
- Budget configuration must be validated and included in deterministic receipts.

# Test Plan

Test exact limit, limit+1, duplicate, cyclic, deeply nested, compressed, oversized
line/batch/body, and repeated-body cases while measuring that failure occurs before
full work. Run archive, pack, loop, MCP, graph, parallel smokes and `test-432`.

# Links / Artifacts

- `epic-244`, `edd-75`, `test-432`
