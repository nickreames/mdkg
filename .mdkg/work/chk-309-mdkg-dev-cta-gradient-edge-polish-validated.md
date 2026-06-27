---
id: chk-309
type: checkpoint
title: mdkg.dev CTA gradient edge polish validated
checkpoint_kind: implementation
status: backlog
priority: 9
tags: [0.4.0, mdkg-dev, cta, gradient, browser, chrome]
owners: []
links: []
artifacts: [/private/tmp/mdkg-task611-cta-gradient-20260627/browser-cta-gradient-receipt.json, /private/tmp/mdkg-task611-cta-gradient-20260627/browser-desktop-1280x900.png, /private/tmp/mdkg-task611-cta-gradient-20260627/browser-mobile-390x844.png, /private/tmp/mdkg-task611-cta-gradient-20260627/chrome-cta-gradient-receipt.json, /private/tmp/mdkg-task611-cta-gradient-20260627/chrome-desktop-default.png, /private/tmp/mdkg-task611-cta-gradient-20260627/chrome-mobile-390x844.png]
relates: [task-611]
blocked_by: []
blocks: []
refs: [goal-42, task-605]
context_refs: [task-605]
evidence_refs: []
aliases: []
skills: []
scope: [task-611]
created: 2026-06-27
updated: 2026-06-27
---
# Summary

The mdkg.dev primary CTA gradient edge polish is complete and locally
validated. Primary `ButtonLink` controls now paint their gradient through an
overscanned pseudo-element instead of directly on the rounded anchor surface.

Local Browser and Chrome receipts both passed for desktop and mobile viewports:
primary CTA direct `background-image` is `none`, `::before` carries the linear
gradient with `inset: -1px`, and console error logs were empty.

# Scope Covered

- `task-611`
- `goal-42` local launch-proof evidence

## Changed Surfaces

- `mdkg-dev/src/styles/global.css`: added shared `--cta-ocean-gradient`.
- `mdkg-dev/src/components/ButtonLink.astro`: primary variant now uses
  `position: relative`, `isolation: isolate`, `overflow: hidden`,
  transparent direct background, and a gradient `::before` layer.
- `.mdkg/work/task-611...`: created, claimed, validated, and closed.

## Boundaries

- in scope: primary mdkg.dev CTA gradient edge formatting and local evidence.
- out of scope: package version bump, changelog `0.4.0` promotion, docs release
  card changes, live deploy, git push/tag, DNS, analytics, and npm publish.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded:
  yes.

# Decisions Captured

- Reused the proven Ocean Flow pseudo-element pattern from
  `nicholas-reames-com` while keeping mdkg.dev button dimensions and variants
  otherwise unchanged.

# Implementation Summary

Primary CTAs now preserve the existing border box and text behavior while
moving the visual gradient to an isolated, clipped pseudo-element. This avoids
rounded-edge gradient seams without broad visual refactors.

# Implementation Details

- Code surfaces changed: `mdkg-dev/src/styles/global.css` and
  `mdkg-dev/src/components/ButtonLink.astro`.
- Graph surfaces changed: `task-611`, this checkpoint, and `goal-42`
  active-node routing.
- Compatibility notes: no public CLI, npm package payload, docs route, or API
  behavior changed.

# Verification / Testing

## Command Evidence

- `node dist/cli.js index`: passed.
- `node dist/cli.js validate --changed-only --json`: `ok: true`, 0 warnings,
  0 errors.
- `node dist/cli.js validate --json`: `ok: true`, 0 errors, 1 accepted legacy
  `SPEC.md` compatibility warning.
- `npm --prefix mdkg-dev run build`: passed.
- `npm run smoke:mdkg-dev`: passed.
- `npm run smoke:mdkg-dev-seo`: passed.
- `git diff --check`: passed.

## Pass / Fail Status

- status: pass.

## Known Warnings

- Full validation still reports the accepted legacy warning for
  `.mdkg/work/mdkg-cli/SPEC.md`; this is unrelated to the CTA polish.

# Known Issues / Follow-ups

- `mdkg@0.4.0` is not publish-ready yet: package metadata remains `0.3.9`,
  `CHANGELOG.md` has no `0.4.0` section, and full `0.4.0` pack/publish dry-run
  gates have not been run.
- Live mdkg.dev/docs.mdkg.dev validation remains post-push/post-deploy and
  belongs to the broader `task-605` lane.

## Follow-up Refs

- `task-605`
- `task-606`
- `test-308`
- `test-310`
- `test-312`

# Links / Artifacts

- `/private/tmp/mdkg-task611-cta-gradient-20260627/browser-cta-gradient-receipt.json`
- `/private/tmp/mdkg-task611-cta-gradient-20260627/browser-desktop-1280x900.png`
- `/private/tmp/mdkg-task611-cta-gradient-20260627/browser-mobile-390x844.png`
- `/private/tmp/mdkg-task611-cta-gradient-20260627/chrome-cta-gradient-receipt.json`
- `/private/tmp/mdkg-task611-cta-gradient-20260627/chrome-desktop-default.png`
- `/private/tmp/mdkg-task611-cta-gradient-20260627/chrome-mobile-390x844.png`

# Raw Content Safety

- Evidence is summarized with local artifact refs. No secrets, raw prompts, raw
  provider payloads, or bulky execution traces are embedded.
