---
id: test-308
type: test
title: docs site browser SEO and accessibility contract
status: done
priority: 2
epic: epic-204
parent: goal-42
tags: [0.4.0, browser, seo, a11y, docs, test]
owners: []
links: []
artifacts: [/private/tmp/mdkg-goal42-current-local-validation-20260627, /private/tmp/mdkg-0.4.0-chrome-live-20260627, /private/tmp/mdkg-0.4.0-chrome-live-20260627/chrome-live-validation-receipt.json, https://mdkg.dev/, https://docs.mdkg.dev/project/changelog/]
relates: []
blocked_by: [task-605]
blocks: []
refs: [task-602, task-603, task-605, chk-301, chk-304, chk-308, chk-318, chk-319, chk-320, chk-321, chk-322]
context_refs: []
evidence_refs: [chk-301, chk-302, chk-303, chk-304, chk-305, chk-306, chk-307, chk-308, chk-323]
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

- Passed. See `chk-323`.
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
- Latest recorded live production currentness evidence remains `chk-302`,
  `chk-303`, and `chk-304`, which found production stale before the later
  local-only language/profile-syntax commits.
- Current local branch state after those local commits is
  `main...origin/main [ahead 11]` at `419db20`; no new live Browser/Chrome
  production validation has been run because live validation is reserved for
  the post-push/post-deploy boundary.
- Current local Browser desktop/mobile and Chrome desktop validation passed for
  the homepage, docs changelog, and docs packs/handoffs routes after the
  homepage validation-boundary and `MANIFEST.md` copy was tightened; see
  `chk-308`.
- Approved publish/push/deploy evidence completed after the earlier local proof:
  Vercel production currentness and custom-domain checks passed in `chk-318`
  and `chk-319`; live Chrome desktop/mobile validation passed in `chk-320`;
  end-to-end publish and launch contract passed in `chk-321`; umbrella
  launch-proof synthesis is recorded in `chk-322`.

# Notes / Follow-ups

- Archive screenshots only after public-safety review.
