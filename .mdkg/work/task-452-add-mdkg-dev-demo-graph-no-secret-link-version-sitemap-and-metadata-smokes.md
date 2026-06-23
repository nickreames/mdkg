---
id: task-452
type: task
title: add mdkg-dev demo graph no-secret link version sitemap and metadata smokes
status: done
priority: 1
epic: epic-126
parent: goal-25
tags: [mdkg-dev, smoke, no-secret, launch-gate]
owners: []
links: []
artifacts: []
relates: [task-446, task-447, task-448, task-449, task-450, task-451]
blocked_by: [task-451]
blocks: [task-453, test-205]
refs: [archive://archive.mdkg-dev-planning-docs-2026-06-22]
context_refs: [prd-5]
evidence_refs: []
aliases: []
skills: []
created: 2026-06-22
updated: 2026-06-22
---
# Overview

Add launch-readiness automation for site, docs, generated references, examples, and graph integrity.

# Acceptance Criteria

- Executed only after goal-25 is explicitly activated and task-451 has subgraph proof.
- `smoke:mdkg-dev` proves static site build/render and required route inventory.
- `smoke:mdkg-dev-docs` proves GitBook source structure, generated reference drift, docs links, and existing docs preservation.
- `smoke:mdkg-dev-seo` proves metadata, canonical/noindex policy, sitemap, robots, and structured-data sanity.
- `smoke:demo-graph` proves demo/template graph validation, import/pack/search/show behavior, and no-cross-repo mutation.
- No-secret scan covers site/docs/examples/generated outputs for obvious token/private-key/raw-prompt/provider-payload markers.
- Accessibility and performance baseline checks are implemented where practical and documented where manual launch measurement remains required.
- Link/version checks ensure README, mdkg.dev, docs, npm/package metadata, changelog, and command docs do not contradict each other.

# Files Affected

- npm scripts and smoke scripts allowed by task-445.
- site/docs/examples test fixtures or generated outputs.
- publish-readiness assertions after task-453.

# Implementation Notes

- Keep checks deterministic and local.
- Do not add brittle live network checks to prepublish gates.
- Record launch-smoke proof checkpoint before closing.

# Implementation Summary

- Added shared smoke helper `scripts/mdkg-dev-smoke-utils.js`.
- Added `scripts/smoke-mdkg-dev.js` for static site build/render and route inventory.
- Added `scripts/smoke-mdkg-dev-docs.js` for GitBook source structure, generated command-reference drift, docs links, and high-risk marker scans.
- Added `scripts/smoke-mdkg-dev-seo.js` for canonical metadata, sitemap, robots, JSON-LD, social card, and LLM boundary checks.
- Added `scripts/smoke-demo-graph.js` for nested example validation, goal routing, pack coverage, subgraph verification, root-qualified qid lookup, and high-risk marker scans.
- Added npm scripts and inserted the new smokes into `prepublishOnly`.

# Test Plan

- `npm run smoke:mdkg-dev`
- `npm run smoke:mdkg-dev-docs`
- `npm run smoke:mdkg-dev-seo`
- `npm run smoke:demo-graph`
- `node dist/cli.js validate --json`
- `git diff --check`

# Links / Artifacts

- archive://archive.mdkg-dev-planning-docs-2026-06-22
- checkpoint: chk-192
- parent: goal-25
- epic: epic-126
- context: mdkg.dev quality gate contract
