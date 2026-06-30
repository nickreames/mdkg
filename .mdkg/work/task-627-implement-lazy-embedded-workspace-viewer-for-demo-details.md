---
id: task-627
type: task
title: implement lazy embedded workspace viewer for demo details
status: blocked
priority: 3
epic: epic-207
parent: goal-47
tags: [demo, viewer, workspace, lazy-load, mdkg-dev]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [spike-24]
blocks: [test-328]
refs: [edd-61, spike-24]
context_refs: []
evidence_refs: []
aliases: []
skills: [build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-06-29
updated: 2026-06-29
---
# Overview

Implement the approved embedded workspace viewer for demo detail pages after
`spike-24` selects the approach and `goal-44` proves the read-only route.

# Acceptance Criteria

- Viewer is lazy-loaded only on demo detail routes.
- Viewer renders sanitized accepted-demo snapshots and cannot browse arbitrary
  local paths.
- Homepage, docs, quickstart, trust, and changelog paths do not load heavy
  workspace/editor code.
- Desktop and mobile Browser/Chrome checks pass without console errors.
- No public deploy, push, tag, npm publish, DNS, or provider mutation occurs.

# Files Affected

List files/directories expected to change.

- `mdkg-dev/src/pages/demo/[id].astro`
- future mdkg-dev demo viewer components/data modules

# Implementation Notes

- Implement only after `spike-24` closes with a recommendation.
- Keep the v1 read-only explorer intact; this task enhances the demo detail
  route rather than changing the short URL model.

# Test Plan

- `npm --prefix mdkg-dev run build`
- Browser/Chrome desktop and mobile validation
- homepage/docs route bundle isolation evidence
- no-secret/public-claims audit
- `test-328`

# Links / Artifacts

- `spike-24`
- `test-328`
- `edd-61`
