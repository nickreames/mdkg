---
id: task-222
type: task
title: subgraph sync materialization closeout and publish readiness
status: done
priority: 1
epic: epic-38
prev: task-221
tags: [subgraph, closeout, release, prepublish]
owners: []
links: []
artifacts: []
relates: [epic-38, task-215, task-216, task-217, task-218, task-219, task-220, task-221]
blocked_by: []
blocks: []
refs: [rule-3, rule-4]
aliases: [subgraph-sync-closeout]
skills: []
created: 2026-06-03
updated: 2026-06-03
---

# Overview

Close the subgraph sync/materialization release slice only after implementation,
docs, graph state, tests, smokes, and publish dry-runs are complete.

# Acceptance Criteria

- `task-215` through `task-221` are done with evidence.
- `epic-38` is done with a concise closeout summary.
- No child repos or consumer repos are edited.
- No real npm publish occurs without explicit approval.
- Dirty tree contains only intended release work.

# Files Affected

- mdkg graph files
- package release files

# Implementation Notes

Use this node as the release-readiness checkpoint for the next unpublished
`0.1.x` slice.

# Test Plan

- `npm run build`
- `npm run test`
- `npm run cli:check`
- `node dist/cli.js validate`
- existing smoke scripts plus subgraph sync/materialize coverage
- `node scripts/assert-publish-ready.js`
- isolated-cache `npm pack --dry-run --json`
- isolated-cache `npm publish --dry-run`
- `git diff --check`

# Links / Artifacts

- `epic-38`
- Evidence: `npm run build`, `npm run test`, `npm run cli:check`, `node dist/cli.js index`, `node dist/cli.js validate`, `npm run smoke:subgraph`, `node scripts/assert-publish-ready.js`, isolated-cache `npm pack --dry-run --json`, isolated-cache `npm publish --dry-run`, and `git diff --check` passed. The dry-run publish ran the full `prepublishOnly` smoke gate and reported `+ mdkg@0.1.7`.
