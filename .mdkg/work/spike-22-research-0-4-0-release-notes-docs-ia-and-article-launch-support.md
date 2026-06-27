---
id: spike-22
type: spike
title: research 0.4.0 release notes docs IA product design audit and article launch support
status: done
priority: 2
epic: epic-202
parent: goal-42
tags: [0.4.0, release-notes, docs-ia, article, product-design, browser, chrome, live-verification, spike]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: [task-601, task-602, task-603, task-604, task-606]
refs: []
context_refs: []
evidence_refs: [chk-293]
aliases: []
skills: []
created: 2026-06-26
updated: 2026-06-27
---
# Research Question

What release notes IA, docs IA, Product Design audit scope, live verification
plan, and article-support package should mdkg.dev/docs.mdkg.dev ship for the
`0.4.0` public launch lane?

# Context And Constraints

- `goal-42` owns public docs/site polish, not CLI kernel behavior.
- `goal-41` owns final `0.3.9` CLI facts.
- `goal-43` owns the `mdkg@0.3.9` npm publish and post-publish validation lane.
- The article release announcement is targeted for June 28, 2026.
- Public claims must be backed by source, changelog entries, examples, or mdkg
  evidence.
- Known 0.3.9 live-current gaps are in scope for this goal: source
  `mdkg-dev/src/pages/index.astro` advertises stale structured
  `softwareVersion: "0.3.7"`, live `docs.mdkg.dev/project/changelog/` lagged at
  `0.3.7` during audit, and public docs only briefly covered the 0.3.9
  customization capabilities.

# Search Plan

- Inspect `CHANGELOG.md`, docs IA, mdkg-dev IA, generated command docs, and
  current launch proof.
- Run Product Design audit setup for mdkg.dev and docs.mdkg.dev and record the
  local artifact folder to use during execution.
- Decide whether release notes live under docs.mdkg.dev, mdkg.dev, or both.
- Define Browser local desktop/mobile routes and Chrome live production routes
  that must be verified after source updates deploy.
- Map article claims to source-backed release details.

# Findings

- `docs.mdkg.dev/project/changelog/` live evidence now includes the `0.3.9`
  summary, so the earlier live-current docs gap is partially resolved.
- `mdkg-dev/src/pages/index.astro` still carried stale structured
  `softwareVersion: "0.3.7"` at spike start; local source now derives the
  homepage JSON-LD version from root `package.json`.
- The docs changelog source had only a terse milestone list. It did not yet meet
  the release-card/detail requirement for article support and public launch
  scanning.
- `docs/_generated/release-notes.json` is already generated from
  `CHANGELOG.md` and `docs:check` verifies the data is fresh, so the public
  release notes IA should use `CHANGELOG.md` as canonical facts instead of
  inventing a separate release database.
- The public homepage should only summarize current capabilities. Detailed
  release facts belong under docs.mdkg.dev so public claims remain inspectable
  against the changelog and generated release-note data.

# Options And Tradeoffs

- Put release notes only on `docs.mdkg.dev/project/changelog/`: lowest
  duplication and best source-truth alignment, but the marketing homepage needs
  enough current copy to avoid looking stale after 0.3.9.
- Put a full release page on `mdkg.dev`: stronger launch storytelling, but it
  duplicates docs IA and increases the risk of version drift before `0.4.0`.
- Use `docs/_generated/release-notes.json` directly at runtime: best data
  discipline, but Starlight Markdown pages currently work well with static
  checked content and local smoke assertions; dynamic integration can wait until
  the release-note surface needs filtering or deep linking per version.

# Recommendation

- Treat docs.mdkg.dev as the canonical public release-notes surface for `0.4.0`.
- Keep mdkg.dev homepage current by deriving JSON-LD `softwareVersion` from
  `package.json` and adding a compact `0.3.9` customization section covering
  config overlays, custom skill mirrors, and `COLLABORATION.md`.
- Convert the docs changelog into recent release cards plus a detailed `0.3.9`
  section, with existing generated release-note checks and public smoke tests
  guarding against drift.
- Use Product Design audit artifacts under
  `/private/tmp/mdkg-goal42-product-design-audit-20260627` during execution.
- Use Browser for local desktop/mobile checks after the site/docs builds pass,
  then use Chrome/Browser for live production verification only after explicit
  deploy approval.
- Keep `0.4.0` npm publish, tag, DNS, analytics, and production promotion out
  of this implementation pass unless separately approved.

# Required Execution Tools

- Product Design audit: use `product-design:audit` for mdkg.dev and
  docs.mdkg.dev launch-flow critique, with local artifacts under a bounded
  `/private/tmp/mdkg-goal42-product-design-audit-*` folder.
- Browser: use `browser:control-in-app-browser` for local desktop/mobile E2E of
  built mdkg-dev and docs routes before any live claim.
- Chrome: use `chrome:control-chrome` for live production verification when
  existing Chrome state, extensions, or logged-in deploy surfaces are useful.

# Follow-Up Nodes To Create

- Existing follow-up nodes: `task-601`, `task-602`, `task-603`, `task-604`,
  `task-606`, `test-307`, `test-308`, `test-309`, `test-310`, `test-311`.

# Skill Candidates

- Record any repeatable docs/release-note maintenance workflow that should
  become an mdkg skill.

# Data Structures And Algorithms Notes

- Capture how changelog entries map into release card/detail data.

# UX Notes

- Capture navigation placement, card density, and detail-page reading order.

# Security Notes

- Public launch copy and receipts must exclude secrets, private prompts, raw
  traces, and provider UI.

# mdkg.dev Launch Implications

- Article support and launch pages should use the same source-backed release
  facts.

# Evidence And Sources

- Live fetch snapshots:
  `/private/tmp/mdkg-goal42-mdkg-dev.html`,
  `/private/tmp/mdkg-goal42-docs-changelog.html`, and
  `/private/tmp/mdkg-goal42-docs-home.html`.
- Source files inspected and updated: `mdkg-dev/src/pages/index.astro`,
  `docs/src/content/docs/project/changelog.md`,
  `docs/project/changelog.md`, and `docs/_generated/release-notes.json`.
- Focused verification after implementation:
  `npm run smoke:mdkg-dev`, `npm run smoke:mdkg-dev-docs`, and
  `npm run smoke:mdkg-dev-seo` pass sequentially. An earlier parallel smoke
  attempt failed because multiple `npm run build` invocations raced while
  cleaning/copying `dist/`; the same gates passed when rerun sequentially.
