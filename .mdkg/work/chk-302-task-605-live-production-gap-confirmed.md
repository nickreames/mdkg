---
id: chk-302
type: checkpoint
title: task-605 live production gap confirmed
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
scope: [task-605, test-308]
created: 2026-06-27
updated: 2026-06-27
---
# Summary

Read-only Browser verification checked the current public `mdkg.dev` and
`docs.mdkg.dev` production pages on 2026-06-27 without pushing, deploying,
changing DNS, publishing, tagging, or promoting anything. The check confirmed
that production is not yet live-current with the committed goal-42 source
updates, so `task-605` remains open.

# Scope Covered

Scope is `task-605` and `test-308`: public browser/SEO/accessibility launch
proof for mdkg.dev and docs.mdkg.dev. This checkpoint covers only read-only
production observation before any approved deploy/promotion.

## Changed Surfaces

- mdkg task evidence: `task-605` gained read-only live artifact references.
- checkpoint evidence: this `chk-302` records the live-current gap.
- generated mdkg index: `.mdkg/index/mdkg.sqlite` refreshed.

## Boundaries

- in scope: read-only public Browser navigation to `https://mdkg.dev/` and
  `https://docs.mdkg.dev/project/changelog/`.
- out of scope: git push, Vercel deploy, production promotion, DNS changes,
  analytics activation, `0.4.0` npm publish, git tag creation, and any private
  provider UI.
- raw secrets, raw prompts, raw payloads, npm auth state, provider payloads,
  and private browser state were not collected or committed.

# Decisions Captured

- Read-only production staleness is useful evidence, but it does not satisfy
  the live verification acceptance criterion.
- `task-605` and `test-308` should remain open until the already-committed
  source updates are pushed/deployed and live Browser or Chrome verification
  proves mdkg.dev/docs.mdkg.dev are current.
- Chrome was not used in this pass because existing Chrome profile state was
  not needed for the public read-only check. Chrome remains appropriate after
  approved deployment if existing browser state is useful for production
  verification.

# Implementation Summary

The in-app Browser inspected public production pages and saved a bounded JSON
receipt plus viewport screenshots under `/private/tmp`. The live homepage still
reports old structured version metadata and lacks the new 0.3.9 customization
copy. The live docs changelog has partial 0.3.9 text, but not the polished
release-card/detail surface from the current source.

# Test Proof

- Test target: production `https://mdkg.dev/` and
  `https://docs.mdkg.dev/project/changelog/`.
- Artifact folder: `/private/tmp/mdkg-goal42-live-readonly-20260627`.
- Receipt:
  `/private/tmp/mdkg-goal42-live-readonly-20260627/live-readonly-receipts.json`.
- Screenshots:
  `/private/tmp/mdkg-goal42-live-readonly-20260627/mdkg-dev-live-home.png` and
  `/private/tmp/mdkg-goal42-live-readonly-20260627/docs-mdkg-dev-live-changelog.png`.
- Coverage gap: because no deploy/promotion occurred, this proves current
  production is stale, not launch-ready.

# Verification / Testing

## Command Evidence

- Browser read-only inspection of `https://mdkg.dev/`: page loaded, `h1` was
  `Git-native project memory for AI coding agents.`, JSON-LD
  `softwareVersion` was `0.3.7`, and the page lacked `0.3.9`,
  `COLLABORATION.md`, config overlay, and custom mirror copy.
- Browser read-only inspection of `https://docs.mdkg.dev/project/changelog/`:
  page loaded, `h1` was `Changelog`, the page contained partial `0.3.9` text
  and `COLLABORATION.md`/`.mdkg/config.json`, but lacked `.release-grid` and
  custom mirror coverage.

## Pass / Fail Status

- status: live production currentness failed/incomplete by expected deployment
  boundary.

## Known Warnings

- This is not a functional regression in local source. Local proof in `chk-301`
  still shows the source/build output is ready for deploy verification.

# Known Issues / Follow-ups

- `mdkg.dev` must be updated so structured metadata reports the source version
  and 0.3.9 customization copy is visible.
- `docs.mdkg.dev` must be updated so the changelog/release-notes page exposes
  the release-card grid/details and custom mirror capability coverage.
- After approved push/deploy/promotion, rerun Browser or Chrome live
  verification before closing `task-605` or `test-308`.

## Follow-up Refs

- `task-605`
- `test-308`
- `task-606`

# Links / Artifacts

- Live receipt:
  `/private/tmp/mdkg-goal42-live-readonly-20260627/live-readonly-receipts.json`
- Homepage screenshot:
  `/private/tmp/mdkg-goal42-live-readonly-20260627/mdkg-dev-live-home.png`
- Docs changelog screenshot:
  `/private/tmp/mdkg-goal42-live-readonly-20260627/docs-mdkg-dev-live-changelog.png`

# Raw Content Safety

- This checkpoint summarizes public page observations and local artifact paths
  only. It contains no credentials, tokens, raw prompts, provider payloads, or
  private account state.
