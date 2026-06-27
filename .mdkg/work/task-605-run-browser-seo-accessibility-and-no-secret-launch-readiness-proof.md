---
id: task-605
type: task
title: run browser SEO accessibility and no secret launch readiness proof
status: progress
priority: 2
epic: epic-204
parent: goal-42
tags: [0.4.0, browser, seo, a11y, no-secrets, launch-proof]
owners: []
links: []
artifacts: [/private/tmp/mdkg-goal42-product-design-audit, mdkg-dev, docs, /private/tmp/mdkg-goal42-product-design-audit-20260627/product-design-audit.md, /private/tmp/mdkg-goal42-product-design-audit-20260627/browser-viewport-receipts.json, /private/tmp/mdkg-goal42-product-design-audit-20260627/browser-docs-polished-receipts.json, /private/tmp/mdkg-goal42-live-readonly-20260627/live-readonly-receipts.json, /private/tmp/mdkg-goal42-live-readonly-20260627/mdkg-dev-live-home.png, /private/tmp/mdkg-goal42-live-readonly-20260627/docs-mdkg-dev-live-changelog.png, /private/tmp/mdkg-goal42-live-refresh-mdkg-dev.html, /private/tmp/mdkg-goal42-live-refresh-docs-changelog.html, /private/tmp/mdkg-goal42-040-web-language-20260627/browser-local-validation.json, /private/tmp/mdkg-goal42-040-web-language-20260627/browser-refresh-040-launch-track-section.png, /private/tmp/mdkg-goal42-040-web-language-20260627/chrome-local-validation.json, /private/tmp/mdkg-goal42-040-web-language-20260627/chrome-refresh-040-launch-track-section.png]
relates: []
blocked_by: [task-601, task-602, task-603, task-604, test-307, test-309]
blocks: [test-308, test-310, task-606]
refs: [task-601, task-602, task-603, task-604]
context_refs: []
evidence_refs: [chk-301, chk-302, chk-303, chk-304, chk-305]
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-06-26
updated: 2026-06-27
---
# Overview

Run final Product Design, local Browser, live Chrome/Browser, SEO,
accessibility, and no-secret launch-readiness proof for mdkg.dev and
docs.mdkg.dev.

# Acceptance Criteria

- Marketing and docs builds pass.
- Product Design audit findings are reviewed, addressed, or explicitly accepted.
- Browser desktop/mobile checks cover key local public launch pages.
- Chrome or Browser live checks prove deployed mdkg.dev and docs.mdkg.dev
  reflect current 0.3.9/0.4.0 source-backed requirements, including structured
  version metadata and changelog/release-notes freshness.
- SEO, accessibility, and no-secret checks pass.
- Screenshots/receipts are reviewed before any archive or checkpoint reference.

# Files Affected

- launch evidence/checkpoints
- no source changes unless validation exposes required fixes

# Implementation Notes

- Do not include private provider UI, deployment tokens, npm auth state, or
  secrets in artifacts.
- Treat deploy/DNS/public launch as separate approval boundaries.
- Prefer a local temp artifact folder for Product Design and browser evidence;
  commit only mdkg checkpoint summaries unless a later task explicitly approves
  archived artifacts.

# Test Plan

- `npm --prefix mdkg-dev run build`
- `npm --prefix docs run build`
- `npm run smoke:mdkg-dev`
- `npm run smoke:mdkg-dev-docs`
- `npm run smoke:mdkg-dev-seo`
- Browser desktop/mobile E2E receipts
- Product Design audit receipt
- Chrome live production verification receipt
- `test-308`
- `test-310`

# Current Evidence State

- Local launch proof passed and is recorded in `chk-301`.
- Read-only production Browser proof found live mdkg.dev/docs.mdkg.dev were not
  source-current; see `chk-302`.
- Read-only Vercel inspection traced the live-current gap to production
  deployments built from an older pushed commit; see `chk-303`.
- Read-only goal-42 readiness audit found the same exact gaps and added
  Product Design plus Browser evidence; see `chk-304`.
- Local pre-publish Browser and Chrome validation for the revised `0.4.0`
  web-launch language passed; `softwareVersion` remains `0.3.9`, the page
  makes `mdkg@0.3.9` the published package baseline, and no unsupported
  `mdkg@0.4.0` published-package claim is present; see `chk-305`.
- A refreshed read-only `git fetch origin main` plus public HTML fetch on
  2026-06-27 after commit `5eccba7` still shows
  `main...origin/main [ahead 8]`, npm package metadata at `0.3.9`, live
  mdkg.dev `softwareVersion: "0.3.7"` with no 0.3.9 customization markers, and
  live docs changelog containing some 0.3.9 text but no release-card/grid or
  `.mdkg/config.json` markers.
- Do not close this task until an approved push/redeploy produces current
  production deployments and live Browser/Chrome verification passes.

# Links / Artifacts

- `goal-42`
