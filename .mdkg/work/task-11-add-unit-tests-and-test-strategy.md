---
id: task-11
type: task
title: add unit tests and test strategy
status: done
priority: 2
epic: epic-1
tags: [coverage, strategy, tests]
owners: []
links: [cmd:test, runner:node]
artifacts: [fixtures, test-scripts, unit-tests]
relates: [dec-4, rule-1, rule-6]
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-01-06
updated: 2026-01-14
---

# Overview

Add unit test coverage for core parsing and indexing features using Node's built-in test runner, plus a lightweight testing strategy.

# Acceptance Criteria

- tests live under `tests/` and compile to `dist/tests/`
- `npm run test` builds and runs tests via `node --test`
- unit tests cover:
  - frontmatter parsing (strict boundaries, list parsing, error cases)
  - node parsing (required fields, enums, priority bounds, edges)
  - config loading (schema validation)
  - indexer behavior (workspace scanning, qids, reverse edges)
  - staleness detection
- fixtures live under `tests/fixtures/` for repeatable repo setups
- testing guidance documented in `AGENTS.md`

# Files Affected

- package.json
- tsconfig.test.json
- tests/**
- AGENTS.md

# Implementation Notes

- Use Node's built-in test runner (`node --test`) with no additional runtime deps.
- Keep fixtures minimal and deterministic.
- Defer CLI command tests that depend on `mdkg new` until that command exists.

# Test Plan

- `npm run test`

# Links / Artifacts

- rule-1
- rule-6
- dec-4
