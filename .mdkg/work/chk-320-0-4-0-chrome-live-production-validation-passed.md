---
id: chk-320
type: checkpoint
title: 0.4.0 Chrome live production validation passed
checkpoint_kind: test-proof
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: [/private/tmp/mdkg-0.4.0-chrome-live-20260627, /private/tmp/mdkg-0.4.0-chrome-live-20260627/chrome-live-validation-receipt.json, /private/tmp/mdkg-0.4.0-chrome-live-20260627/mdkg-dev-home-desktop.png, /private/tmp/mdkg-0.4.0-chrome-live-20260627/mdkg-dev-home-mobile.png, /private/tmp/mdkg-0.4.0-chrome-live-20260627/docs-changelog-desktop.png, /private/tmp/mdkg-0.4.0-chrome-live-20260627/docs-changelog-mobile.png]
relates: [task-617]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-617]
created: 2026-06-27
updated: 2026-06-27
---
# Summary

Chrome live production validation passed for `mdkg.dev` and
`docs.mdkg.dev/project/changelog/` after the `mdkg@0.4.0` npm publish,
postpublish temp-install proof, and Vercel production currentness proof.

The validation was read-only against live production. It recorded desktop and
mobile screenshots, a compact JSON receipt, page metadata, console/error
health, public content markers, CTA gradient computed styles, and
high-confidence public secret pattern checks.

# Scope Covered

Keep `scope` frontmatter updated when possible.

## Changed Surfaces

- `task-617` closed as done.
- Local Chrome artifact folder created under `/private/tmp`.
- No source, package, docs, npm, Vercel, DNS, analytics, or provider state was
  changed during this validation.

## Boundaries

- in scope: live Chrome desktop/mobile validation for `https://mdkg.dev/` and
  `https://docs.mdkg.dev/project/changelog/`.
- out of scope: source edits, npm publish, git tag, git push, Vercel deploy,
  DNS, analytics, provider settings, and article publication.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded:
  yes.

# Decisions Captured

- Chrome live proof is accepted as the production-browser validation layer after
  npm and Vercel receipts. It unblocks `test-320` and final launch readiness
  closeout work.

# Implementation Summary

The live public pages now satisfy the 0.4.0 browser-readiness contract:

- `mdkg.dev` exposes `softwareVersion: "0.4.0"` in structured data and visible
  `0.4.0` customization/release-readiness copy.
- `docs.mdkg.dev/project/changelog/` exposes the `0.4.0` release card and
  details for Vercel currentness and Chrome live-validation.
- Primary CTA buttons on the live homepage retain the overscanned
  `::before` ocean-gradient implementation, with no direct gradient painted on
  the rounded anchor surface.

# Test Proof

- Test target: live production `mdkg.dev` and docs changelog pages.
- Fixtures or temp repos: none.
- Coverage gaps: no release-blocking Chrome gaps found. Final readiness still
  needs `test-320`, `task-605`, `task-606`, and `test-312` closeout evidence.

# Verification / Testing

## Command Evidence

- command: Chrome desktop/mobile validation via Chrome extension.
- result: pass; receipt status `pass`, failures `[]`.
- command: screenshots saved for homepage and docs changelog at desktop and
  mobile breakpoints.
- result: files written under
  `/private/tmp/mdkg-0.4.0-chrome-live-20260627`.
- command: DOM/metadata assertions.
- result: required 0.4.0 markers present, homepage JSON-LD softwareVersion is
  `0.4.0`, SEO title/description/canonical metadata exists, and changelog
  release markers are present.
- command: CTA computed-style assertions on live homepage.
- result: 3 primary CTAs found at desktop and mobile; each had direct
  `background-image: none`, `position: relative`, `isolation: isolate`,
  `overflow: hidden`, overscanned `::before` inset, and `::before`
  `linear-gradient`.
- command: console and public no-secret sanity checks.
- result: no console warnings/errors captured for checked pages, and no
  high-confidence public secret patterns found.

## Pass / Fail Status

- status: passed.

## Known Warnings

- warning: none from Chrome validation.

# Known Issues / Follow-ups

- `test-320` should close the end-to-end publish/launch contract.
- `task-605`, `task-606`, and `test-312` should record the final launch
  readiness recommendation.

## Follow-up Refs

- `test-320`
- `task-605`
- `task-606`
- `test-312`

# Links / Artifacts

- `/private/tmp/mdkg-0.4.0-chrome-live-20260627/chrome-live-validation-receipt.json`
- `/private/tmp/mdkg-0.4.0-chrome-live-20260627/mdkg-dev-home-desktop.png`
- `/private/tmp/mdkg-0.4.0-chrome-live-20260627/mdkg-dev-home-mobile.png`
- `/private/tmp/mdkg-0.4.0-chrome-live-20260627/docs-changelog-desktop.png`
- `/private/tmp/mdkg-0.4.0-chrome-live-20260627/docs-changelog-mobile.png`

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw secrets, raw prompts, raw payloads, or bulky execution traces.
