---
id: task-144
type: task
title: define visibility policy contract
status: done
priority: 1
epic: epic-27
tags: [visibility, policy, privacy]
owners: []
links: []
artifacts: [src/graph/visibility.ts, tests/graph/visibility.test.ts, npm run test]
relates: [epic-22, epic-23, epic-24]
blocked_by: []
blocks: [task-145, task-146, task-147, test-84]
refs: []
aliases: [visibility-policy-contract]
skills: []
created: 2026-05-18
updated: 2026-05-18
---
# Overview

Define a shared effective-visibility policy for workspaces, archive sidecars,
and imported bundle nodes.

# Acceptance Criteria

- Visibility order is `public`, `internal`, `private`.
- Workspace nodes default to workspace visibility.
- Archive nodes use sidecar `visibility`.
- Imported nodes use import visibility and non-private imports require public
  bundle profiles.
- Public and internal outputs fail closed when included records reference
  less-visible records.

# Files Affected

- `src/graph/visibility.ts`
- `src/core/config.ts`

# Implementation Notes

This policy is an mdkg export and diagnostic layer. It is not secret scanning,
body redaction, or an OS-level access-control system.

# Results

Added a shared policy module with `public < internal < private` ordering.
Workspace records inherit workspace visibility, archive records use sidecar
visibility, and imported records use import visibility. Non-private imports are
rejected unless backed by a public bundle profile.

Reference diagnostics inspect deterministic metadata refs and intentionally do
not scan arbitrary Markdown body text.

# Test Plan

- Unit tests cover effective visibility, filtering, and reference diagnostics
  for workspace, archive, and imported graph nodes.

# Verification

- `npm run test`
- `npm publish --dry-run`

# Links / Artifacts

- `epic-27`
