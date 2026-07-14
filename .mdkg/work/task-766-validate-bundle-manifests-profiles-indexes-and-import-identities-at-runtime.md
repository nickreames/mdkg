---
id: task-766
type: task
title: Validate bundle manifests profiles indexes and import identities at runtime
status: done
priority: 1
epic: epic-242
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

Make transported bundle and subgraph claims runtime-validated policy inputs rather
than trusted TypeScript casts or self-declared hash/profile contracts.

# Acceptance Criteria

- Close exactly `cand-review-002-001` and `review-003-cand-001`.
- Parse foreign manifests from `unknown`; validate version, tool, profile, file
  rows/counts, selected workspaces, required index declarations, hashes, and
  expected profile before `ok: true`.
- Bind required subgraph indexes to the verified manifest and payload bytes.
- Public claims re-establish public visibility semantics rather than trusting a
  label from the producer.
- Preserve deterministic valid bundle receipts and compatibility fixtures.

# Files Affected

List files/directories expected to change.

- `src/commands/bundle.ts`
- Graph-transfer and subgraph projection/verification modules
- Bundle/subgraph schemas and tests

# Implementation Notes

- Hash equality proves consistency with a validated manifest, not publisher
  identity.
- Do not add remote signing infrastructure in this goal.
- Return stable structured errors for malformed foreign contracts.

# Test Plan

Use malformed, self-consistent, wrong-profile, missing-index, count-mismatch, and
valid producer fixtures. Prove invalid inputs never return verified/projection
success, then run bundle and subgraph smokes plus `test-427`.

# Links / Artifacts

- `epic-242`, `edd-75`, `dec-80`, `test-427`
