---
id: task-731
type: task
title: Gate mdkg.dev release output through shared release state
status: todo
priority: 1
epic: epic-236
tags: [release, implementation, goal-63]
owners: []
links: []
artifacts: []
relates: [goal-63]
blocked_by: [task-730]
blocks: [task-733, task-740, test-402]
refs: [test-402, edd-71, dec-73, dec-74, prd-11, prop-8]
context_refs: [goal-62, goal-63, epic-236, epic-237, dec-74, prop-8, task-730]
evidence_refs: []
aliases: []
skills: [build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-11
updated: 2026-07-11
---
# Overview

Make mdkg.dev consume the shared release projection so the announcement and all
related machine-readable signals are absent in dormant production and visible
only in local active preview or published state.

# Acceptance Criteria

- Draft output contains no v0.5.0 loop announcement, CTA, routes, copy, target
  version claim, Open Graph text, JSON-LD claim, sitemap entry, or LLM-facing
  release text.
- Active preview renders the planned announcement slot while keeping pages
  noindex/nofollow and package/structured metadata truthful.
- Published projection renders the release only when package/version parity
  passes.
- Existing hero, quickstart, navigation, generic public-alpha qualifier, and
  following sections remain unchanged in dormant output.
- Marketing build and smoke commands receive deterministic state inputs and
  fail clearly on invalid release configuration.

# Files Affected

- `mdkg-dev/src/`
- mdkg.dev sitemap, metadata, structured-data, and LLM output code
- mdkg.dev smoke fixtures/scripts

# Implementation Notes

- Gate source data before rendering or indexing; hiding a DOM section alone does
  not satisfy the contract.
- Reuse the shared helper from `task-730`; do not add a marketing-only flag.
- Do not implement the visual announcement in this task; `task-733` owns it.

# Test Plan

Run `test-402` plus draft and active-preview mdkg.dev builds. Scan built output
for accepted dormant terms, target version, CTA routes, and structured metadata.

# Links / Artifacts

- `task-730`
- `test-402`
- `prop-8`
