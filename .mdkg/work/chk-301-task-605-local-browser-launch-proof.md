---
id: chk-301
type: checkpoint
title: task-605 local browser launch proof
checkpoint_kind: test-proof
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-605]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-605, test-310]
created: 2026-06-27
updated: 2026-06-27
---
# Summary

Task `task-605` has local launch-readiness proof for the current goal-42
website/docs source state. Product Design review, Browser viewport receipts,
SEO/a11y/perf smokes, docs/site smokes, demo proof, publish-readiness checks,
CLI gates, tests, changed-only validation, and public-content no-secret scans
passed locally for the `0.3.9` source-backed mdkg.dev/docs.mdkg.dev updates.

# Scope Covered

This checkpoint covers local built-output proof for `task-605` and `test-310`.
It does not close `task-605`, because live mdkg.dev/docs.mdkg.dev deployment and
Chrome/Browser production verification still require explicit approval.

## Changed Surfaces

- `mdkg-dev/src/pages/index.astro`
- docs changelog, install, and repository-layout source pages
- legacy docs mirror pages under `docs/project`, `docs/start-here`, and
  `docs/concepts`
- mdkg-dev/docs smoke scripts and publish-readiness assertion
- `docs/public/favicon.svg`
- goal-42 work nodes, test nodes, checkpoints, and `.mdkg/index/mdkg.sqlite`

## Boundaries

- in scope: local static builds, local Browser desktop/mobile review,
  Product Design audit artifact, public-content no-secret scan, and local
  launch-readiness command gates.
- out of scope: push, deploy, DNS, analytics activation, public production
  promotion, real `0.4.0` npm publish, `0.4.0` git tag, and live Chrome
  production verification.
- raw secrets, raw prompts, raw payloads, provider UI, and bulky execution
  traces were excluded from committed graph evidence.

# Decisions Captured

- Local proof is acceptable as an intermediate task-605 milestone, but not as
  final goal-42 completion proof.
- The docs favicon 404 exposed by local Browser serving was treated as a real
  public-surface gap and fixed with `docs/public/favicon.svg`.
- Live currentness of mdkg.dev/docs.mdkg.dev remains unproven until approved
  deploy/promotion and production Browser or Chrome verification occur.

# Implementation Summary

- Homepage JSON-LD `softwareVersion` now derives from root `package.json`.
- Homepage content now exposes `0.3.9` configuration overlays, custom skill
  mirrors, and `COLLABORATION.md` customization.
- Docs changelog now presents recent release cards and detailed `0.3.9`
  capability notes.
- Install and repository-layout docs now cover `.mdkg/config.json`, arbitrary
  contained mirror paths, `mdkg upgrade --apply`, `COLLABORATION.md`,
  `HUMAN.md`, `MANIFEST.md`, and legacy `SPEC.md`.
- Smoke scripts now guard version metadata, release-grid/detail freshness,
  homepage customization copy, docs customization copy, and docs favicon
  presence.

# Test Proof

- Test target: local built mdkg.dev and docs.mdkg.dev source outputs plus mdkg
  repo release/readiness gates.
- Artifact folder:
  `/private/tmp/mdkg-goal42-product-design-audit-20260627`
- Screenshots reviewed:
  `/private/tmp/mdkg-goal42-product-design-audit-20260627/mdkg-dev-home-desktop-viewport.jpg`,
  `/private/tmp/mdkg-goal42-product-design-audit-20260627/mdkg-dev-home-mobile-viewport.jpg`,
  `/private/tmp/mdkg-goal42-product-design-audit-20260627/docs-changelog-desktop-polished-viewport.jpg`,
  `/private/tmp/mdkg-goal42-product-design-audit-20260627/docs-changelog-mobile-polished-viewport.jpg`
- Coverage gaps: production deploy/live verification and final `0.4.0`
  publish-readiness closeout remain open.

# Verification / Testing

## Command Evidence

- `npm run smoke:mdkg-dev`: passed.
- `npm run smoke:mdkg-dev-docs`: passed; 62 required files checked.
- `npm run smoke:mdkg-dev-seo`: passed.
- `npm run smoke:mdkg-dev-a11y`: passed; 10 pages checked.
- `npm run smoke:mdkg-dev-perf`: passed.
- `npm run smoke:demo-graph`: passed.
- `npm run docs:check`: passed; 50 files scanned, 402 command examples checked,
  0 failed examples.
- `node scripts/assert-publish-ready.js`: passed.
- `npm run test`: passed; 528 tests, 0 failures.
- `npm run cli:check`: passed.
- `npm run cli:contract`: passed.
- Public-content no-secret scan over `mdkg-dev` and `docs` source/public/dist
  surfaces: no matches.
- `node dist/cli.js validate --changed-only --json`: passed with 0 warnings and
  0 errors after commit.
- `node dist/cli.js validate --json`: passed with the expected legacy
  `SPEC.md` compatibility warning only.
- `git diff --check` and `git diff --cached --check`: passed before commit.

## Pass / Fail Status

- status: local launch-readiness proof passed; final live production proof is
  incomplete by explicit boundary.

## Known Warnings

- `root:spec.mdkg-cli` still emits the accepted legacy `SPEC.md` compatibility
  warning until the compatibility bridge closes.

# Known Issues / Follow-ups

- `task-605` remains open for approved public deploy/promotion and live
  Browser/Chrome verification of mdkg.dev and docs.mdkg.dev.
- `test-308` remains open until live browser/SEO/a11y proof is complete.
- `task-606`, `test-311`, and `test-312` remain open for article support,
  final change audit, package dry-runs, and final `0.4.0` readiness
  recommendation.

## Follow-up Refs

- `task-605`
- `test-308`
- `task-606`
- `test-311`
- `test-312`

# Links / Artifacts

- Commit containing the local source/docs/graph update:
  `7050eba docs: advance goal-42 launch readiness`
- Product Design audit:
  `/private/tmp/mdkg-goal42-product-design-audit-20260627/product-design-audit.md`
- Browser local receipt:
  `/private/tmp/mdkg-goal42-product-design-audit-20260627/browser-local-receipts.json`
- Browser viewport receipt:
  `/private/tmp/mdkg-goal42-product-design-audit-20260627/browser-viewport-receipts.json`
- Browser polished docs receipt:
  `/private/tmp/mdkg-goal42-product-design-audit-20260627/browser-docs-polished-receipts.json`

# Raw Content Safety

- This checkpoint stores summarized evidence and local artifact references only.
  It does not include raw secrets, raw prompts, provider payloads, npm auth
  material, or private deployment UI content.
