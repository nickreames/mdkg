---
id: test-82
type: test
title: bundle unit cli and smoke coverage
status: done
priority: 1
epic: epic-22
tags: [bundle, tests, smoke]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
cases: [deterministic-zip, private-profile, public-profile-fail-closed, verify-stale, packed-smoke]
created: 2026-05-17
updated: 2026-05-17
---
# Overview

Validate the bundle feature at unit, CLI matrix, packed install, and publish
dry-run levels.

# Target / Scope

- `task-134`
- `task-135`
- `task-136`
- `task-137`
- `task-138`

# Preconditions / Environment

- Node/npm available.
- Use `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache` for package gates because
  the local default npm cache has known ownership problems.

# Test Cases

- Multi-file ZIP output is byte-stable for identical entries.
- Private bundles include authored graph files, archive sidecars, archive ZIP
  caches, and generated indexes while excluding pack/index/bundle/raw archive
  source paths.
- Public bundles include public workspace content and fail closed on private
  archive references.
- `bundle verify` detects malformed bundles and stale source changes.
- Packed-package temp smoke initializes a root repo, child public workspace,
  archive sidecar, spec/work/task nodes, private/public bundles, repeatable
  hashes, and stale verification.

# Results / Evidence

- `npm run test` passed with 339 tests.
- `npm run cli:check` passed.
- `node dist/cli.js validate` passed.
- `npm run smoke:consumer` passed.
- `npm run smoke:matrix` passed.
- `npm run smoke:upgrade` passed.
- `npm run smoke:init` passed.
- `npm run smoke:capabilities` passed.
- `npm run smoke:archive-work` passed.
- `npm run smoke:bundle` passed.
- `npm pack --dry-run --json` passed with `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache`.
- `npm publish --dry-run` passed with `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache`.

# Notes / Follow-ups

- Bundle import and lazy read-only subgraph loading remain in `epic-23`.
