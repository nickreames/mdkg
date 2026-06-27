---
id: test-211
type: test
title: final pre-release gates and no-public-side-effect contract
status: done
priority: 1
epic: epic-130
parent: goal-26
tags: [mdkg-dev, prepublish, no-public-side-effects]
owners: []
links: []
artifacts: []
relates: [goal-26, task-462]
blocked_by: [task-461]
blocks: []
refs: []
context_refs: [chk-194]
evidence_refs: [chk-282, chk-283]
aliases: []
skills: []
cases: []
created: 2026-06-22
updated: 2026-06-22
---
# Overview

Validate final goal-26 pre-release readiness through full local gates while preserving the no-public-side-effect boundary.

# Target / Scope

- mdkg-dev smokes
- demo graph smoke
- root build/test/CLI checks
- prepublish and dry-run package/publish checks
- final source tree consistency

# Preconditions / Environment

- Browser evidence has been archived.
- Any remediation has been completed or explicitly marked no-op.
- Do not run real publish/deploy/tag/push/global install.

# Test Cases

- `npm run smoke:mdkg-dev`
- `npm run smoke:mdkg-dev-docs`
- `npm run smoke:mdkg-dev-seo`
- `npm run smoke:demo-graph`
- `npm run build`
- `npm run test`
- `npm run cli:check`
- `npm run cli:contract`
- `npm run prepublishOnly`
- `node scripts/assert-publish-ready.js`
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run`
- `git diff --check`

# Results / Evidence

- Blocked by `chk-200`: all local gates and package scripts passed, but `npm publish --dry-run` cannot pass while source version `0.3.7` is already published on npm.
- Closed as historical/superseded on 2026-06-26 after `chk-282` validated the
  real `mdkg@0.3.8` publish and installed package. This test did not pass under
  the original no-public-side-effect contract; the archived parent goal now
  points to `goal-41` and `goal-42` for replacement lanes.

# Notes / Follow-ups

- Real publish and deploy remain separate explicit requests.
- Decide whether to bump release metadata for this verification lane or revise the acceptance rule for already-published versions.
- Current replacement work: `goal-41` for `0.3.9` CLI release polish and
  `goal-42` for `0.4.0` public docs/site launch polish.
