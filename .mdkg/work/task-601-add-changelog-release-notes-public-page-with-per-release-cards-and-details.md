---
id: task-601
type: task
title: add changelog release notes public page with per release cards and details
status: todo
priority: 2
epic: epic-202
parent: goal-42
tags: [0.4.0, changelog, release-notes, docs]
owners: []
links: []
artifacts: [CHANGELOG.md, docs, mdkg-dev]
relates: []
blocked_by: [spike-22]
blocks: [test-307, task-605, task-606]
refs: [spike-22]
context_refs: []
evidence_refs: []
aliases: []
skills: [build-pack-and-execute-task]
created: 2026-06-26
updated: 2026-06-26
---
# Overview

Add a public release notes/changelog surface with per-release cards and detail
views, reconciled with `CHANGELOG.md`.

# Acceptance Criteria

- Public page includes per-release cards and detail content.
- `0.3.8` and future `0.3.9`/`0.4.0` entries are represented consistently with
  `CHANGELOG.md`.
- The implementation does not duplicate unreconciled release copy.
- Public page is included in docs/site navigation only if the IA research
  supports it.

# Files Affected

- `CHANGELOG.md`
- `docs/`
- `mdkg-dev/`

# Implementation Notes

- Prefer deriving or checking against `CHANGELOG.md`.
- Include compatibility notes for MANIFEST/SPEC and COLLABORATION/HUMAN when
  applicable.

# Test Plan

- `npm --prefix docs run build`
- `npm --prefix mdkg-dev run build`
- `npm run docs:check`
- `test-307`

# Links / Artifacts

- `edd-57`
- `spike-22`
