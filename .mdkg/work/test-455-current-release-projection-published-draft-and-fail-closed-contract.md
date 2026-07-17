---
id: test-455
type: test
title: Current-release projection published draft and fail-closed contract
status: todo
priority: 1
parent: goal-73
prev: task-793
next: task-794
tags: [goal-73, test, docs, release, current-release]
owners: []
links: []
artifacts: []
relates: [task-793, dec-84, edd-78]
blocked_by: [task-793]
blocks: [task-794]
refs: [goal-73, dec-84, edd-78]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: [published-exact-release, draft-preview-unreleased, draft-hidden, missing-release-fails, metadata-mismatch-fails, no-version-literals]
created: 2026-07-16
updated: 2026-07-16
---
# Overview

Prove that release selection is version-driven and fails closed before local
route or browser validation begins.

# Target / Scope

The pure current-release projector, public-release manifest projection,
generated release-note input validation, and source/test literal audit.

# Preconditions / Environment

Implementation from `task-793` is complete and package/public state remains
published `0.5.2`.

# Test Cases

- Published state selects exactly the generated release matching
  `target_version`, including date, count, and no more than three highlights.
- Draft preview uses target version and Unreleased data without npm claims.
- Draft without preview emits no supplement projection.
- Missing exact release, malformed notes, and metadata disagreement fail.
- Component and dynamic smoke expectations contain no current-release version
  literal; historical changelog/loop content is explicitly excluded.
- Generated text is escaped or structurally formatted without unrestricted raw
  HTML.

# Results / Evidence

Pending. Attach targeted test output and literal-audit results before closure.

# Notes / Follow-ups

- Any permissive fallback or stale-version rendering blocks `task-794`.
