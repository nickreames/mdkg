---
id: task-193
type: task
title: define temp project db smoke profile proof and closeout
status: todo
priority: 1
epic: epic-29
tags: [project-db, smoke, profile, closeout]
owners: []
links: []
artifacts: []
relates: [epic-29, epic-30, epic-31, epic-32, epic-33, epic-34]
blocked_by: [task-183, task-184, task-185, task-186, task-188, task-189, task-190, task-191, task-192]
blocks: []
refs: []
aliases: [project-db-smoke-closeout]
skills: []
created: 2026-05-27
updated: 2026-05-27
---

# Overview

Define the temp-repo proof and closeout criteria for the future project DB
implementation.

# Acceptance Criteria

- Packed-package smoke initializes a fresh mdkg repo with project DB support.
- Smoke applies migrations, verifies stats, processes local events through
  typed reducers, writes receipts to SQLite and artifacts, seals a snapshot,
  verifies the manifest, produces a canonical dump, and validates mdkg graph
  state.
- Smoke proves active WAL/runtime files are ignored and sealed snapshots are
  opt-in.
- Closeout summarizes residual risks before any npm publish.

# Explicit Exclusions

- No external queue service required for the first smoke.
- No consumer repo edits required for closeout.
- No embeddings/vector database proof.

# Files Affected

- Future packed-package smoke script, package scripts, profile fixture, and
  closeout checkpoint.

# Implementation Notes

The smoke should use a packed install so it proves the npm-facing behavior, not
only local source files.

# Test Plan

- Future `npm run smoke:project-db` uses a temp repo and installed packed
  package.
- Full gate includes `npm run test`, `npm run cli:check`, `node dist/cli.js
  validate`, existing smokes, project DB smoke, `npm pack --dry-run --json`, and
  `npm publish --dry-run`.

# Links / Artifacts

- `epic-29`
- `epic-30`
- `epic-31`
- `epic-32`
- `epic-33`
- `epic-34`
