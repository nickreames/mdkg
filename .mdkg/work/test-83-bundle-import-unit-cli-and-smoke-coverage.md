---
id: test-83
type: test
title: bundle import unit cli and smoke coverage
status: done
priority: 1
epic: epic-23
tags: [bundle-import, tests, smoke]
owners: []
links: []
artifacts: []
relates: [task-139, task-140, task-141, task-142, task-143]
blocked_by: []
blocks: []
refs: []
aliases: [bundle-import-test-coverage]
skills: []
cases: [config, projection, read-paths, stale-imports, mutation-guard, packed-smoke]
created: 2026-05-17
updated: 2026-05-17
---
# Overview

Validate read-only bundle import behavior from unit tests through packed
temporary repo smoke coverage.

# Test Cases

- Config validation and defaults for `bundle_imports`.
- Bundle manifest/index loading without extraction.
- Import qid projection, duplicate-id failure, source metadata, and edge
  remapping.
- Stale import warnings remain usable in read commands while verify fails.
- Imported search/show/list/pack/capability behavior.
- Mutation commands reject imported qids with explicit read-only errors.
- Packed temp root/child repos exercise bundle creation, import, inspection,
  stale detection, and validation.

# Results / Evidence

- `npm run test`
- `npm run cli:check`
- `node dist/cli.js validate`
- `npm run smoke:consumer`
- `npm run smoke:matrix`
- `npm run smoke:upgrade`
- `npm run smoke:init`
- `npm run smoke:capabilities`
- `npm run smoke:archive-work`
- `npm run smoke:bundle`
- `npm run smoke:bundle-import`
- `npm pack --dry-run --json`
- `npm publish --dry-run`
