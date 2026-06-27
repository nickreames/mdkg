---
id: chk-305
type: checkpoint
title: goal-42 0.4.0 web language aligned locally
checkpoint_kind: test-proof
status: backlog
priority: 9
tags: [0.4.0, web-language, browser, chrome, prepublish, launch-proof]
owners: []
links: []
artifacts: [/private/tmp/mdkg-goal42-040-web-language-20260627, /private/tmp/mdkg-goal42-040-web-language-20260627/browser-local-validation.json, /private/tmp/mdkg-goal42-040-web-language-20260627/browser-refresh-040-launch-track-section.png, /private/tmp/mdkg-goal42-040-web-language-20260627/chrome-local-validation.json, /private/tmp/mdkg-goal42-040-web-language-20260627/chrome-refresh-040-launch-track-section.png]
relates: [task-605]
blocked_by: []
blocks: []
refs: [goal-42, task-605, test-308, test-310]
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
scope: [task-605, test-308, test-310, goal-42]
created: 2026-06-27
updated: 2026-06-27
---
# Summary

Aligned the mdkg.dev homepage language for the `0.4.0` web launch track while
keeping package/version claims tied to the currently published npm baseline.

The local built homepage now presents `0.4.0 launch track` as web-launch copy,
states that the published package baseline remains `mdkg@0.3.9`, and explains
that local validation happens before publish while live validation follows the
approved publish and deploy. JSON-LD `softwareVersion` still derives from
`package.json` and remains `0.3.9`.

# Scope Covered

- `goal-42`
- `task-605`
- `test-308`
- `test-310`
- mdkg.dev homepage source and local static build
- mdkg.dev smoke and SEO smoke assertions
- local Browser desktop/mobile proof
- local Chrome DOM/console/screenshot proof

## Changed Surfaces

- `mdkg-dev/src/pages/index.astro`
- `mdkg-dev/src/components/Badge.astro`
- `mdkg-dev/CLAIMS.md`
- `scripts/smoke-mdkg-dev.js`
- `scripts/smoke-mdkg-dev-seo.js`
- this checkpoint plus linked task/test evidence refs
- local-only artifacts under
  `/private/tmp/mdkg-goal42-040-web-language-20260627`

## Boundaries

- in scope: local copy alignment, local static build, local Browser proof,
  local Chrome proof, smoke assertions, and mdkg evidence.
- out of scope: git push, deploy, DNS, analytics, npm publish, git tag,
  production mutation, and live post-publish validation.
- raw secrets, raw prompts, raw payloads, provider UI, npm auth state, and
  bulky execution traces excluded; only summarized results and local artifact
  paths are recorded.

# Decisions Captured

- Treat `0.4.0` as a website launch-track label until a real `0.4.0` package
  publish is approved and completed.
- Keep structured package metadata on `0.3.9` while `package.json` is `0.3.9`.
- Local pre-publish validation may prove the source/build state, but live
  validation remains a separate post-publish/deploy gate under `task-605`.

# Implementation Summary

- Added `publishedPackageVersion` and `launchTrackVersion` constants to the
  homepage so package metadata and web-launch copy cannot drift silently.
- Reworded the customization section to say `0.4.0 web launch` while anchoring
  install and structured metadata to `mdkg@0.3.9`.
- Added a `Published package baseline` card to make the package boundary visible.
- Tightened the shared `Badge` component so badges do not stretch inside grid
  layouts.
- Extended mdkg.dev smoke and SEO smoke checks to require the launch-track copy,
  the `mdkg@0.3.9` baseline, and the local-before/live-after validation wording.
- Added a claims row documenting the approved local validation language.

# Test Proof

- Test target: local static mdkg.dev output served at `http://127.0.0.1:4180/`.
- Artifact folder:
  `/private/tmp/mdkg-goal42-040-web-language-20260627`
- Browser proof:
  `/private/tmp/mdkg-goal42-040-web-language-20260627/browser-local-validation.json`
- Browser screenshots:
  `/private/tmp/mdkg-goal42-040-web-language-20260627/browser-refresh-desktop.png`,
  `/private/tmp/mdkg-goal42-040-web-language-20260627/browser-refresh-mobile.png`,
  `/private/tmp/mdkg-goal42-040-web-language-20260627/browser-refresh-040-launch-track-section.png`
- Chrome proof:
  `/private/tmp/mdkg-goal42-040-web-language-20260627/chrome-local-validation.json`
- Chrome screenshot:
  `/private/tmp/mdkg-goal42-040-web-language-20260627/chrome-refresh-040-launch-track-section.png`
- Coverage gaps: live production validation remains open until explicit
  publish/deploy approval and production Browser/Chrome verification.

# Verification / Testing

## Command Evidence

- `npm --prefix mdkg-dev run build`: passed.
- `npm run smoke:mdkg-dev`: passed.
- `npm run smoke:mdkg-dev-seo`: passed.
- Browser local validation: passed for `0.4.0 launch track`,
  `mdkg@0.3.9`, local-before-publish wording, live-after-publish wording,
  `Published package baseline`, `.mdkg/config.json`, `COLLABORATION.md`,
  JSON-LD `softwareVersion: "0.3.9"`, zero console issues, and no unsupported
  `mdkg@0.4.0` published-package claim.
- Chrome local validation: passed for the same DOM/version/copy assertions,
  zero console warnings/errors, launch badge visible in the screenshot
  viewport, and JSON-LD `softwareVersion: "0.3.9"`.

## Pass / Fail Status

- status: local pre-publish web-language validation passed; live post-publish
  validation remains incomplete by boundary.

## Known Warnings

- `0.4.0` npm publish readiness is not claimed while package metadata remains
  `0.3.9`.
- live mdkg.dev/docs.mdkg.dev currentness remains unproven until approved
  production update and live Browser/Chrome verification.

# Known Issues / Follow-ups

- Run live validation only after the approved publish/deploy step.
- Keep `task-605` open until production mdkg.dev/docs.mdkg.dev reflect current
  source and live Browser/Chrome checks pass.

## Follow-up Refs

- `task-605`
- `test-308`
- `task-606`
- `test-312`

# Links / Artifacts

- `/private/tmp/mdkg-goal42-040-web-language-20260627/browser-local-validation.json`
- `/private/tmp/mdkg-goal42-040-web-language-20260627/browser-refresh-040-launch-track-section.png`
- `/private/tmp/mdkg-goal42-040-web-language-20260627/chrome-local-validation.json`
- `/private/tmp/mdkg-goal42-040-web-language-20260627/chrome-refresh-040-launch-track-section.png`

# Raw Content Safety

- Evidence is summarized with command outcomes and local artifact paths only.
  Screenshots and JSON receipts are local-only under `/private/tmp`.
