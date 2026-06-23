---
id: test-205
type: test
title: full mdkg.dev launch-readiness smoke and prepublish dry-run contract
status: done
priority: 1
epic: epic-126
parent: goal-25
tags: [mdkg-dev, contract, launch-readiness, prepublish]
owners: []
links: []
artifacts: []
relates: [goal-25, task-452, task-453, task-454]
blocked_by: [task-454]
blocks: []
refs: [archive://archive.mdkg-dev-planning-docs-2026-06-22]
context_refs: [prd-5]
evidence_refs: [chk-194]
aliases: []
skills: []
created: 2026-06-22
updated: 2026-06-22
---
# Overview

Validate full mdkg.dev pre-release readiness before goal-25 can close.

# Acceptance Criteria

- Required checkpoints exist for boundary/tooling, site/design, docs/generated reference, public copy/claims/trust, demo/subgraph, launch smoke, and final closeout.
- Build, test, CLI checks, command contract checks, mdkg validation, command-docs smoke, mdkg-dev smokes, demo-graph smoke, prepublish gate, publish readiness assertions, pack dry-run, publish dry-run, and `git diff --check` pass.
- Final closeout says no real publish, deploy, DNS change, tag, push, analytics activation, GitBook production config, or Vercel production promotion happened unless separately requested.
- Remaining launch blockers and manual steps are explicitly listed.

# Test Plan

- `npm run build`
- `npm run test`
- `npm run cli:check`
- `npm run cli:contract`
- `node dist/cli.js validate --json`
- `npm run smoke:command-docs`
- `npm run smoke:mdkg-dev`
- `npm run smoke:mdkg-dev-docs`
- `npm run smoke:mdkg-dev-seo`
- `npm run smoke:demo-graph`
- `npm run prepublishOnly`
- `node scripts/assert-publish-ready.js`
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run`
- `git diff --check`

# Links / Artifacts

- archive://archive.mdkg-dev-planning-docs-2026-06-22
- evidence: chk-194
- parent: goal-25
- epic: epic-126
