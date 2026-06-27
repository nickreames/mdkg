---
id: spike-22
type: spike
title: research 0.4.0 release notes docs IA product design audit and article launch support
status: todo
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
evidence_refs: []
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

- Pending research.

# Options And Tradeoffs

- Pending research.

# Recommendation

Pending research-backed recommendation.

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

- Add local files, command receipts, external documentation, and citations during
  spike execution.
