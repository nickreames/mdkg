---
id: task-473
type: task
title: scaffold Starlight under docs without breaking existing checks
status: done
priority: 1
epic: epic-138
parent: goal-28
tags: []
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-22
updated: 2026-06-22
---
# Overview

Add a Starlight/Astro docs app under `docs/` while preserving existing docs files and generated-reference checks.

# Acceptance Criteria

- `docs/package.json` defines `build`, `dev`, and `preview` scripts.
- `docs/astro.config.mjs` uses the Starlight integration with title `mdkg Docs`.
- `docs/src/content.config.ts` configures Starlight docs collections.
- Existing `docs/README.md`, `docs/SUMMARY.md`, and `docs/_generated/*` remain available for current scripts.
- `npm --prefix docs run build` passes.

# Files Affected

List files/directories expected to change.

- `docs/`

# Implementation Notes

- Use official Starlight project structure: content pages live under `docs/src/content/docs/`.
- Prefer copying/migrating content rather than moving existing files until docs smoke scripts are updated.

# Test Plan

- `npm --prefix docs run build`
- `npm run docs:check`

# Links / Artifacts

- `epic-138`
- `test-219`

# Progress Evidence

- Added `docs/package.json`, `docs/astro.config.mjs`, `docs/tsconfig.json`, and `docs/src/content.config.ts`.
- Added Starlight content routes under `docs/src/content/docs/` for start-here, concepts, guides, advanced alpha, reference, and project sections.
- Preserved existing top-level `docs/README.md`, `docs/SUMMARY.md`, and generated reference outputs for existing scripts.
- Updated `scripts/smoke-mdkg-dev-docs.js` and `scripts/assert-publish-ready.js` to require Starlight/docs.mdkg.dev evidence.
- `npm run docs:check`: passed after rerunning sequentially.
- `node scripts/smoke-mdkg-dev-docs.js`: passed with 40 required files.
- `node dist/cli.js validate --summary --json --limit 20`: passed with 0 warnings and 0 errors.
- `git diff --check`: passed.
- `npm install --prefix docs`: passed after updating to `@astrojs/starlight@^0.40.0` and `astro@^6.4.6`, which satisfies Starlight peer constraints and removes the high-severity Astro 5 audit path.
- `npm audit --prefix docs --json`: reported 4 low-severity advisories, 0 moderate/high/critical findings.
- `npm --prefix docs run build`: passed, producing 19 static pages plus Pagefind search and sitemap output under `docs/dist/`.

# Remaining

- Close `test-219` after the docs inventory/nav task verifies generated-reference and navigation coverage together.
