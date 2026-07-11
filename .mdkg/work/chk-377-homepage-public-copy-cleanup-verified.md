---
id: chk-377
type: checkpoint
title: homepage public copy cleanup verified
checkpoint_kind: implementation
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: [/private/tmp/mdkg-public-copy-cleanup-20260706/browser-audit.md, /private/tmp/mdkg-public-copy-cleanup-20260706/home-customization-desktop.png, /private/tmp/mdkg-public-copy-cleanup-20260706/home-customization-mobile.png]
relates: [task-663]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-663]
created: 2026-07-05
updated: 2026-07-05
---
# Summary

The mdkg.dev homepage no longer presents internal release-process language as
product positioning. The former launch-track/postpublish/postdeploy section was
replaced with stable customization copy about repo-local config overlays,
managed skills, core docs, and an upgradable npm-installed CLI kernel.

# Scope Covered

Keep `scope` frontmatter updated when possible.

## Changed Surfaces

- `mdkg-dev/src/pages/index.astro`
- `scripts/smoke-mdkg-dev.js`
- `scripts/smoke-mdkg-dev-seo.js`

## Boundaries

- in scope: homepage public body copy and related smoke assertions.
- out of scope: CLI behavior, package metadata, deployment, DNS, tags, npm
  publish, and homepage layout redesign.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded.

# Decisions Captured

Link the most important decision records.

# Implementation Summary

The homepage now uses a `Team customization` badge and `Upgradable kernel`
capability card instead of launch-management copy. Smoke tests assert the new
copy exists and the forbidden homepage process terms are absent.

# Implementation Details

- Code or graph surfaces changed:
- Architecture or data-shape notes:
- Compatibility notes:

# Verification / Testing

## Command Evidence

- `npm --prefix mdkg-dev run build`: passed.
- `npm run smoke:mdkg-dev`: passed.
- `npm run smoke:mdkg-dev-seo`: passed.
- Browser audit: homepage desktop/mobile checked with no forbidden phrase
  matches and no console errors.

## Pass / Fail Status

- status: passed

## Known Warnings

- none

# Known Issues / Follow-ups

- none for this task.

## Follow-up Refs

- task/test/goal refs:

# Links / Artifacts

- `/private/tmp/mdkg-public-copy-cleanup-20260706/browser-audit.md`
- `/private/tmp/mdkg-public-copy-cleanup-20260706/home-customization-desktop.png`
- `/private/tmp/mdkg-public-copy-cleanup-20260706/home-customization-mobile.png`

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw secrets, raw prompts, raw payloads, or bulky execution traces.
