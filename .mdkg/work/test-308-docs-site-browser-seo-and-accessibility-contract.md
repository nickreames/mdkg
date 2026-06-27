---
id: test-308
type: test
title: docs site browser SEO and accessibility contract
status: todo
priority: 2
epic: epic-204
parent: goal-42
tags: [0.4.0, browser, seo, a11y, docs, test]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-605]
blocks: []
refs: [task-602, task-603, task-605]
context_refs: []
evidence_refs: [chk-301, chk-302, chk-303, chk-304, chk-305, chk-306]
aliases: []
skills: []
cases: []
created: 2026-06-26
updated: 2026-06-27
---
# Overview

Validate browser, SEO, and accessibility quality for the public launch surface.

# Target / Scope

`task-605`, mdkg.dev, and docs.mdkg.dev.

# Preconditions / Environment

Run local builds/servers or approved preview URLs during launch validation.

# Test Cases

- Desktop and mobile browser checks pass for key launch pages.
- Product Design audit findings are reconciled with the final page structure.
- Chrome or Browser live checks prove deployed mdkg.dev and docs.mdkg.dev are
  current after any approved deploy or promotion.
- SEO smoke passes for canonical routes, sitemap/robots/llms text, and metadata.
- Accessibility and reduced-motion expectations pass.
- No console errors or broken primary navigation.

# Results / Evidence

- Partially proven locally; not done.
- Local Product Design, Browser viewport, SEO, accessibility, performance,
  docs/site smoke, and public no-secret checks passed for built source output;
  see `chk-301`.
- Read-only production Browser verification found live pages were not
  source-current; see `chk-302`.
- Read-only Vercel metadata explained the currentness gap as production
  deployments built from an older pushed commit; see `chk-303`.
- Read-only goal-42 readiness audit found the same exact gaps and added
  Product Design plus Browser evidence; see `chk-304`.
- Local pre-publish Browser and Chrome validation for the updated `0.4.0`
  homepage language passed; JSON-LD remains on `0.3.9`, the page names
  `mdkg@0.3.9` as the published package baseline, and there are zero captured
  console issues; see `chk-305`.
- Local Browser and Chrome HTML validation plus built-file checks prove current
  public docs/site routes use `--profile concise` and do not expose stale
  `--pack-profile concise` examples; see `chk-306`.
- A refreshed read-only fetch of `origin/main`, `https://mdkg.dev/`, and
  `https://docs.mdkg.dev/project/changelog/` after commit `5eccba7` still
  shows the same blocker: local `main` is ahead of `origin/main` by 8,
  mdkg.dev still reports `softwareVersion: "0.3.7"` with no 0.3.9
  customization markers, and the live docs changelog still lacks
  release-card/grid and `.mdkg/config.json` markers.
- This test must remain open until an explicitly approved push/redeploy
  completes and live mdkg.dev/docs.mdkg.dev Browser or Chrome verification
  passes against current production.

# Notes / Follow-ups

- Archive screenshots only after public-safety review.
