---
id: task-723
type: task
title: Run live browser audit and record final v0.5.0 release receipt
status: done
priority: 1
epic: epic-235
prev: task-722
tags: [release, browser, audit, closeout]
owners: []
links: []
artifacts: []
relates: [goal-64, test-394]
blocked_by: []
blocks: []
refs: [test-394]
context_refs: [goal-64, epic-235, edd-72, dec-69, dec-81, task-722, test-393, test-394, chk-516]
evidence_refs: [chk-513, chk-514, chk-515, chk-516, chk-517]
aliases: []
skills: []
created: 2026-07-10
updated: 2026-07-13
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
- Do not rerun Codex Security, republish npm, replace the global installation,
  or request a new release approval. Those lanes are complete and evidenced by
  `chk-512` through `chk-516`.
- Verify fix-forward SHA `3224551243e5d58ce9f5b5198b602b7d87d63f38`
  is production-current on both sites. Its exact-SHA GitHub Actions run
  `29261414020` is already green.
- Confirm the corrected docs Edit page URL includes the monorepo `docs/`
  prefix. Treat only a newly discovered release-blocking live defect as a
  reason to reopen implementation.

# Test Plan

Run `test-394`, final graph validation, goal evaluation, registry refresh, and
pack the final release receipt.

# Current State

Done. Exact-SHA CI and Vercel deployment confirmation, corrected Edit-page live
verification, desktop/mobile browser acceptance, registry/global refresh,
metadata/link/no-secret checks, and serial site smoke checks passed. `test-394`
and `chk-517` record the final release-complete recommendation.

# Links / Artifacts

- `edd-72`
- `dec-69`
- `dec-81`
- `chk-516`
- `chk-517`
