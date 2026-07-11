---
id: task-723
type: task
title: Run live browser audit and record final v0.5.0 release receipt
status: todo
priority: 1
epic: epic-235
prev: task-722
tags: [release, browser, audit, closeout]
owners: []
links: []
artifacts: []
relates: [goal-64, test-394]
blocked_by: [task-722]
blocks: []
refs: [test-394]
context_refs: [goal-64, epic-235, edd-72, dec-69, task-722]
evidence_refs: []
aliases: []
skills: []
created: 2026-07-10
updated: 2026-07-10
---
# Overview

Audit the live release from desktop and mobile user perspectives, reconcile all
package/site receipts, and close with an explicit fix-forward or release-complete
recommendation.

# Acceptance Criteria

- Product Design/Browser/Chrome receipts cover homepage, loop docs, install,
  upgrade, CLI examples, release notes, navigation, responsive behavior, and links.
- Accessibility, contrast, semantics, keyboard, SEO, structured metadata,
  displayed version, and no-secret checks pass or have explicit fix-forward work.
- Final checkpoint lists commits, CI, npm version/integrity, temp/global installs,
  deployment IDs, live screenshots, residual risks, and no-tag confirmation.
- Goal 64 evaluates achieved only when no release-blocking follow-up remains.

# Files Affected

List files/directories expected to change.

- Live mdkg.dev and docs.mdkg.dev
- Mdkg release checkpoint and evidence refs

# Implementation Notes

- Do not unpublish npm if the website fails; keep the goal open and fix forward.
- Separate internal provider receipts from public-facing copy.

# Test Plan

Run `test-394`, final graph validation, goal evaluation, registry refresh, and
pack the final release receipt.

# Links / Artifacts

- `edd-72`
- `dec-69`
