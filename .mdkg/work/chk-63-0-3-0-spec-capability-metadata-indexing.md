---
id: chk-63
type: checkpoint
title: 0.3.0 SPEC capability metadata indexing
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-285]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-285]
created: 2026-06-06
updated: 2026-06-06
---
# Summary

Projected `spec_kind` into SPEC capability records and proved the dogfood mdkg
CLI SPEC exposes `spec_kind: cli_tool` through `capability list --kind spec`.

# Scope Covered

- `task-285`: capability index metadata, focused unit coverage, capability
  smoke, full test suite, and live dogfood capability-list proof.

# Decisions Captured

- `spec_kind` belongs inside the existing `record.spec` projection so existing
  capability consumers stay compatible.
- Top-level record metadata continues to carry visibility, refs, links,
  aliases, headings, source hashes, and source/read-only information.

# Implementation Summary

- Added `spec_kind` to `src/graph/capabilities_indexer.ts` SPEC projections.
- Strengthened `tests/graph/capabilities_indexer.test.ts` to assert projected
  SPEC metadata.
- Rebuilt the live capability index so `root:spec.mdkg-cli` includes
  `spec.spec_kind: cli_tool`.

# Verification / Testing

- `npm run build`: passed.
- `npm run build:test`: passed.
- `node --test dist/tests/graph/capabilities_indexer.test.js`: passed, 4 tests.
- `npm run smoke:capabilities`: passed.
- `npm run test`: passed, 413 tests.
- `node dist/cli.js index`: passed.
- `node dist/cli.js validate --json`: passed with no warnings or errors.
- `node dist/cli.js capability list --kind spec --json`: returned
  `root:spec.mdkg-cli` with `spec.spec_kind: cli_tool`.
- `git diff --check`: passed.

# Known Issues / Follow-ups

- `task-286` still needs the public `mdkg spec list/show/validate` command
  surface.
- `test-110` remains open for richer SPEC search/show/metadata validation.

# Links / Artifacts

- `task-285`
- `test-109`
- `test-110`
- `src/graph/capabilities_indexer.ts`
- `tests/graph/capabilities_indexer.test.ts`
