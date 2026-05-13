---
id: test-81
type: test
title: Cover utility id and path helpers
status: done
priority: 3
epic: epic-13
tags: [0_0_4x, coverage, util, test]
owners: []
links: []
artifacts: [tests/util/id.test.ts, tests/core/paths.test.ts, tests/core/migrate.test.ts, tests/graph/edges.test.ts, COVERAGE_HARDENING_MATRIX.md]
relates: [task-129]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
cases: []
created: 2026-05-08
updated: 2026-05-08
---
# Overview

Validate low-frequency id, path, migration, and graph edge helper branches
identified by the residual coverage matrix.

# Target / Scope

`src/util/id.ts`, `src/core/paths.ts`, `src/core/migrate.ts`, and
`src/graph/edges.ts`.

# Preconditions / Environment

Use direct pure-helper unit tests.

# Test Cases

- canonical and portable ids accept valid ids and special ids
- canonical and portable refs reject malformed workspace/ref values
- root resolution handles explicit roots and process cwd fallback
- config path joins the mdkg config location
- migration rejects non-object and negative schema versions
- legacy migration preserves configured workspace sets
- edge extraction normalizes scalar and list edge fields
- edge extraction rejects malformed shapes, uppercase refs, and invalid
  canonical refs while allowing portable refs in portable mode

# Results / Evidence

- `npm test -- --test-name-pattern "id helper|path helper|migrateConfig|extractEdges"` passed with 269 tests.
- `npm run test:coverage` passed with 269 tests.
- All-files coverage is now `95.10%` line / `87.88%` branch.
- `src/core/paths.ts`, `src/graph/edges.ts`, and `src/util/id.ts` report full
  line coverage.
- `src/graph/edges.ts` reports full branch coverage.

# Notes / Follow-ups

- This is a coverage-hardening slice, not an id or path helper redesign.
