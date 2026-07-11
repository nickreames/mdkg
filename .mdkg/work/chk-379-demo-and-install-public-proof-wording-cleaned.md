---
id: chk-379
type: checkpoint
title: demo and install public proof wording cleaned
checkpoint_kind: implementation
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: [/private/tmp/mdkg-public-copy-cleanup-20260706/browser-audit.md, /private/tmp/mdkg-public-copy-cleanup-20260706/demo-proof-desktop.png, /private/tmp/mdkg-public-copy-cleanup-20260706/demo-proof-mobile.png, /private/tmp/mdkg-public-copy-cleanup-20260706/install-copy-desktop.png, /private/tmp/mdkg-public-copy-cleanup-20260706/install-copy-mobile.png]
relates: [task-665]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-665]
created: 2026-07-05
updated: 2026-07-05
---
# Summary

The demo and install public copy now explains safety and local proof without
surfacing internal approval/provider process language. The public demo SVG
description was also cleaned after rendered-output scanning found a remaining
`preview approval` phrase in copied assets.

# Scope Covered

Keep `scope` frontmatter updated when possible.

## Changed Surfaces

- `mdkg-dev/src/data/demoSnapshots.ts`
- `mdkg-dev/src/pages/demo/[id]/output.astro`
- `mdkg-dev/public/demo-001/ocean-flow-map.svg`
- `docs/src/content/docs/start-here/install.md`
- `docs/src/content/docs/advanced-alpha/demo-graphs.md`

## Boundaries

- in scope: demo proof wording, install wording, and public SVG description
  metadata.
- out of scope: demo route shape, noindex behavior, data schema, visual design,
  Vercel state, provider actions, package behavior, push, deploy, tag, and npm
  publish.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded.

# Decisions Captured

Link the most important decision records.

# Implementation Summary

Demo copy now says local proof is captured before optional preview deployment
and that no credentials, cookies, private prompts, provider data, or private
artifacts are included. Install docs now call the npm global path the supported
public-alpha install path and refer to package smoke tests.

# Implementation Details

- Code or graph surfaces changed:
- Architecture or data-shape notes:
- Compatibility notes:

# Verification / Testing

## Command Evidence

- `npm --prefix mdkg-dev run build`: passed after SVG cleanup.
- `npm --prefix docs run build`: passed.
- `npm run smoke:mdkg-dev`: passed.
- `npm run smoke:mdkg-dev-docs`: passed.
- Source/built-output phrase scan across `mdkg-dev/src`, `mdkg-dev/public`,
  `mdkg-dev/dist`, `docs/src`, `docs/dist`, generated release notes, and
  `CHANGELOG.md`: no matches.
- Browser audit: demo detail, demo output, and install pages checked at
  desktop/mobile with no forbidden phrase matches and no console errors.

## Pass / Fail Status

- status: passed

## Known Warnings

- none

# Known Issues / Follow-ups

- Example template source files still contain internal preview-approval
  workflow language. They are not part of rendered mdkg.dev/docs.mdkg.dev public
  pages and were left unchanged for a separate template-copy pass if desired.

## Follow-up Refs

- task/test/goal refs:

# Links / Artifacts

- `/private/tmp/mdkg-public-copy-cleanup-20260706/browser-audit.md`
- `/private/tmp/mdkg-public-copy-cleanup-20260706/demo-proof-desktop.png`
- `/private/tmp/mdkg-public-copy-cleanup-20260706/demo-proof-mobile.png`
- `/private/tmp/mdkg-public-copy-cleanup-20260706/install-copy-desktop.png`
- `/private/tmp/mdkg-public-copy-cleanup-20260706/install-copy-mobile.png`

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw secrets, raw prompts, raw payloads, or bulky execution traces.
