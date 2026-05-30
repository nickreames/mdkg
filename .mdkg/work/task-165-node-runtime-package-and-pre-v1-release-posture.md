---
id: task-165
type: task
title: node runtime package and pre-v1 release posture
status: done
priority: 1
epic: epic-20
tags: [0_1_3, sqlite, node, package, release]
owners: []
links: [package.json, package-lock.json, README.md, CHANGELOG.md]
artifacts: []
relates: [epic-20, epic-19]
blocked_by: []
blocks: [task-167, task-170]
refs: [rule-5]
aliases: [node-24-sqlite-release-posture]
skills: []
created: 2026-05-20
updated: 2026-05-20
---

# Overview

Move mdkg's runtime contract to Node `>=24.15.0` so the CLI can use built-in
`node:sqlite` without third-party SQLite packages.

# Acceptance Criteria

- `package.json` and `package-lock.json` target `mdkg@0.1.3`.
- `engines.node` requires `>=24.15.0`.
- Node typings use the Node 24 line.
- The accidental self-dependency on `mdkg` is removed.
- README and changelog clearly state mdkg is pre-v1 public beta and DAL/cache
  contracts may churn before v1.

# Files Affected

- `package.json`
- `package-lock.json`
- `README.md`
- `CHANGELOG.md`

# Implementation Notes

Node 18/20 support is intentionally dropped before v1 because the SQLite DAL
uses built-in `node:sqlite`.

# Test Plan

- `npm run build`
- `npm run test`
- `node scripts/assert-publish-ready.js`

# Links / Artifacts

- `epic-20`

# Verification Evidence

- `npm install --package-lock-only --cache /private/tmp/mdkg-npm-cache`
- `npm run test`
- `npm run smoke:sqlite`
- `npm run smoke:parallel`
