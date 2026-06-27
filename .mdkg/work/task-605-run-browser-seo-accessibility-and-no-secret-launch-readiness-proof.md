---
id: task-605
type: task
title: run browser SEO accessibility and no secret launch readiness proof
status: todo
priority: 2
epic: epic-204
parent: goal-42
tags: [0.4.0, browser, seo, a11y, no-secrets, launch-proof]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-601, task-602, task-603, task-604, test-307, test-309]
blocks: [test-308, test-310, task-606]
refs: [task-601, task-602, task-603, task-604]
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-06-26
updated: 2026-06-26
---
# Overview

Run final local/browser launch-readiness proof for mdkg.dev and docs.mdkg.dev.

# Acceptance Criteria

- Marketing and docs builds pass.
- Browser desktop/mobile checks cover key public launch pages.
- SEO, accessibility, and no-secret checks pass.
- Screenshots/receipts are reviewed before any archive or checkpoint reference.

# Files Affected

- launch evidence/checkpoints
- no source changes unless validation exposes required fixes

# Implementation Notes

- Do not include private provider UI or secrets in artifacts.
- Treat deploy/DNS/public launch as separate approval boundaries.

# Test Plan

- `npm --prefix mdkg-dev run build`
- `npm --prefix docs run build`
- `npm run smoke:mdkg-dev`
- `npm run smoke:mdkg-dev-docs`
- `npm run smoke:mdkg-dev-seo`
- Browser desktop/mobile E2E receipts
- `test-308`
- `test-310`

# Links / Artifacts

- `goal-42`
