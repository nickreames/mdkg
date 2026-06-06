---
id: task-193
type: task
title: define temp project db smoke profile proof and closeout
status: done
priority: 2
epic: epic-29
parent: goal-5
tags: [project-db, smoke, profile, closeout]
owners: []
links: []
artifacts: []
relates: [epic-29, epic-30, epic-31, epic-32, epic-33, epic-34, goal-3, goal-4, goal-5, task-248, task-251, task-233, task-234]
blocked_by: []
blocks: []
refs: []
aliases: [project-db-smoke-closeout]
skills: []
created: 2026-05-27
updated: 2026-06-04
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
- Smoke includes the internal node:sqlite queue proof from `smoke:db-queue`.
- Event/receipt/reducer/lease proof now exists in `npm run smoke:db-events`;
  this broader profile smoke remains the later materializer/profile closeout.
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

## Closeout Summary

The broad project DB proof is now covered by concrete packed smokes:

- `smoke:db`: generic project DB init/migrate/verify/stats behavior.
- `smoke:db-queue`: internal local node:sqlite queue delivery state.
- `smoke:db-events`: durable events, receipts, typed reducer, writer lease/CAS,
  and snapshots.
- `smoke:db-materializer`: packaged internal queue-backed materializer helper
  across queue, event, reducer, writer lease/CAS, receipts, snapshots, stats,
  index, validate, and no public materializer CLI.
- `smoke:db-snapshot`: sealed snapshot lifecycle, dump, diff, and verification.

Profile implementation remains intentionally deferred. The profile readiness
boundary is explicit in `task-232`, `task-233`, `task-234`, and `test-87`.

## Residual Risks

- Profile reducer registry is not implemented and should not be improvised by
  extending the current hard-coded reducer path.
- Public profile exports need generated/sanitized artifact commands before any
  realistic private data fixture ships.
- The helper remains internal and local-only; public materializer/profile CLI
  requires separate design and tests.
- Build scripts share `dist/init`; DB smokes should run serially or after a
  single build to avoid concurrent rebuild races.

# Test Plan

- Future `npm run smoke:project-db` uses a temp repo and installed packed
  package.
- Queue-specific proof stays in `npm run smoke:db-queue` until the broader
  project DB smoke profile exists.
- Event/reducer/CAS proof is covered by `npm run smoke:db-events` until the
  broader project DB smoke profile exists.
- Materializer proof is covered by `npm run smoke:db-materializer`.
- Full gate includes `npm run test`, `npm run cli:check`, `node dist/cli.js
  validate`, existing smokes, project DB smoke, `npm pack --dry-run --json`, and
  `npm publish --dry-run`.

# Closeout Evidence

- `npm run test` passed.
- `npm run cli:check` passed.
- `node dist/cli.js validate` passed.
- `npm run smoke:db`, `npm run smoke:db-queue`, `npm run smoke:db-events`,
  `npm run smoke:db-materializer`, and `npm run smoke:db-snapshot` passed
  serially.
- `node scripts/assert-publish-ready.js` passed.
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`
  passed.
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run` passed
  through the full prepublish ladder and ended with dry-run `+ mdkg@0.1.9`.
- `git diff --check` passed.
- No real npm publish, tag, or push was performed.

# Links / Artifacts

- `epic-29`
- `epic-30`
- `epic-31`
- `epic-32`
- `epic-33`
- `epic-34`
- `goal-3`
- `goal-4`
- `goal-5`
- `task-191`
- `task-251`
- `task-233`
- `task-234`
