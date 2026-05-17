---
id: task-135
type: task
title: implement deterministic bundle builder and zip
status: done
priority: 1
epic: epic-22
tags: [bundle, zip, determinism]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
created: 2026-05-17
updated: 2026-05-17
---
# Overview

Build deterministic multi-file ZIP support and use it for full `.mdkg` snapshot
bundles.

# Acceptance Criteria

- Multiple ZIP entries are sorted, timestamp-normalized, and compressed with a
  stable Node stdlib implementation.
- Duplicate, absolute, empty, or parent-directory entry names are rejected.
- Existing archive single-file ZIP behavior continues to work.
- Bundle creation produces repeatable ZIP hashes for unchanged source inputs.

# Files Affected

- `src/util/zip.ts`
- `src/commands/bundle.ts`
- `tests/commands/bundle.test.ts`
- `scripts/smoke-bundle.js`

# Implementation Notes

- `createDeterministicZipFromEntries` now powers both archive ZIPs and bundle
  ZIPs.
- `readZipEntries` supports bundle inspection and verification without adding a
  runtime ZIP dependency.
- Bundle entries always include `manifest.json` plus selected source files and
  generated indexes.

# Test Plan

- `node --test dist/tests/commands/bundle.test.js`
- `npm run smoke:bundle`
- `npm publish --dry-run`

# Links / Artifacts

- `src/util/zip.ts`
- `scripts/smoke-bundle.js`
