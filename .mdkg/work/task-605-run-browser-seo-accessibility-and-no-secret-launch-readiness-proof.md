---
id: task-605
type: task
title: run browser SEO accessibility and no secret launch readiness proof
status: done
priority: 2
epic: epic-204
parent: goal-42
tags: [0.4.0, browser, seo, a11y, no-secrets, launch-proof]
owners: []
links: []
artifacts: [/private/tmp/mdkg-goal42-product-design-audit, mdkg-dev, docs, /private/tmp/mdkg-goal42-product-design-audit-20260627/product-design-audit.md, /private/tmp/mdkg-goal42-product-design-audit-20260627/browser-viewport-receipts.json, /private/tmp/mdkg-goal42-product-design-audit-20260627/browser-docs-polished-receipts.json, /private/tmp/mdkg-goal42-live-readonly-20260627/live-readonly-receipts.json, /private/tmp/mdkg-goal42-live-readonly-20260627/mdkg-dev-live-home.png, /private/tmp/mdkg-goal42-live-readonly-20260627/docs-mdkg-dev-live-changelog.png, /private/tmp/mdkg-goal42-live-refresh-mdkg-dev.html, /private/tmp/mdkg-goal42-live-refresh-docs-changelog.html, /private/tmp/mdkg-goal42-040-web-language-20260627/browser-local-validation.json, /private/tmp/mdkg-goal42-040-web-language-20260627/browser-refresh-040-launch-track-section.png, /private/tmp/mdkg-goal42-040-web-language-20260627/chrome-local-validation.json, /private/tmp/mdkg-goal42-040-web-language-20260627/chrome-refresh-040-launch-track-section.png, /private/tmp/mdkg-goal42-profile-syntax-validation-20260627/browser-profile-syntax-validation.json, /private/tmp/mdkg-goal42-profile-syntax-validation-20260627/chrome-profile-syntax-validation.json, /private/tmp/mdkg-goal42-profile-syntax-validation-20260627/chrome-docs-packs-and-handoffs.png, /private/tmp/mdkg-goal42-current-local-validation-20260627, /private/tmp/mdkg-goal42-current-local-validation-20260627/browser-local-validation-final.json, /private/tmp/mdkg-goal42-current-local-validation-20260627/chrome-local-validation-final.json, /private/tmp/mdkg-task611-cta-gradient-20260627, /private/tmp/mdkg-task611-cta-gradient-20260627/browser-cta-gradient-receipt.json, /private/tmp/mdkg-task611-cta-gradient-20260627/chrome-cta-gradient-receipt.json, /private/tmp/mdkg-0.4.0-chrome-live-20260627, /private/tmp/mdkg-0.4.0-chrome-live-20260627/chrome-live-validation-receipt.json, https://mdkg.dev/, https://docs.mdkg.dev/project/changelog/]
relates: []
blocked_by: [task-601, task-602, task-603, task-604, task-616, test-319, task-617, test-320, test-307, test-309]
blocks: [test-308, test-310, task-606]
refs: [task-601, task-602, task-603, task-604, task-611, task-616, test-319, task-617, test-320, chk-309, chk-318, chk-319, chk-320, chk-321]
context_refs: []
evidence_refs: [chk-301, chk-302, chk-303, chk-304, chk-305, chk-306, chk-307, chk-308, chk-309, chk-322]
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-06-26
updated: 2026-06-27
---
# Overview

Run final Product Design, local Browser, live Chrome, SEO, accessibility, and
no-secret launch-readiness proof for mdkg.dev and docs.mdkg.dev after npm
postpublish validation and Vercel production currentness are complete.

# Acceptance Criteria

- Marketing and docs builds pass.
- Product Design audit findings are reviewed, addressed, or explicitly accepted.
- Browser desktop/mobile checks cover key local public launch pages.
- Chrome live checks prove deployed mdkg.dev and docs.mdkg.dev reflect current
  `0.4.0` source-backed and npm-published requirements, including structured
  version metadata and changelog/release-notes freshness.
- SEO, accessibility, and no-secret checks pass.
- Screenshots/receipts are reviewed before any archive or checkpoint reference.
- `task-616`, `test-319`, `task-617`, and `test-320` have direct evidence or
  exact blockers before this task can close.

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
- Chrome live production verification receipt after approved Vercel deploy
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
- Local pre-publish public command-syntax alignment passed for the current
  `--profile concise` pack example across mdkg.dev, docs.mdkg.dev, demo
  READMEs, init scaffold README, smokes, Browser HTML validation, Chrome HTML
  validation, and built-file checks; see `chk-306`.
- Latest recorded live production currentness evidence remains `chk-302`,
  `chk-303`, and `chk-304`: before the later local language/profile-syntax
  commits, live mdkg.dev/docs.mdkg.dev were still built from older pushed
  source and were not source-current.
- Current local branch state after the local-only language/profile-syntax
  commits is `main...origin/main [ahead 11]` at `419db20`; no new live
  Browser/Chrome production validation has been run after those local commits
  because live validation is reserved for the post-push/post-deploy boundary.
- Current local pre-publish Browser and Chrome validation passed after the
  homepage language was tightened to say local validation is pre-publish, live
  validation is post-publish/post-deploy after approval, and `MANIFEST.md`
  naming is visible in the launch-track section; see `chk-308`.
- Focused local CTA gradient edge polish passed after primary `ButtonLink`
  gradients moved to an overscanned `::before` layer; Browser and Chrome
  desktop/mobile receipts are recorded in `chk-309`.
- `goal-42` now treats 0.4.0 package metadata, prepublish dry-run,
  approval-gated npm publish, npm postpublish validation, Vercel production
  currentness, and Chrome live proof as explicit blockers before this task can
  close. Read-only Vercel grounding found `mdkg-dev`
  (`prj_R9FJkRf2FsmcM9cuIyQbPTV9A056`) and `mdkg-docs`
  (`prj_3Aoh90VnkqNmqM6AnX9t72fSULEd`) under
  `team_RkZhrKQs9wWs6PAdTcrwZ87z`; both project records reported latest
  production deployments as `READY` but `live: false`, so domain/currentness
  proof remains required.
- Approved publish/push produced current production deployments and live
  Browser/Chrome verification passed. `chk-318`/`chk-319` record Vercel and
  domain currentness; `chk-320` records Chrome live desktop/mobile validation;
  `chk-321` records the end-to-end publish and launch contract. This task is
  closed in `chk-322`.

# Links / Artifacts

- `goal-42`
