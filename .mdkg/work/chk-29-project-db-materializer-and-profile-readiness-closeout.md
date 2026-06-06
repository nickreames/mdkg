---
id: chk-29
type: checkpoint
title: project db materializer and profile readiness closeout
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-193]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-193]
created: 2026-06-04
updated: 2026-06-04
---
# Summary

Completed `goal-5` through the internal project DB materializer and profile
readiness roadmap. The project DB stack now has internal local queue-backed
materializer helpers, packed smoke coverage, dry-run prepublish proof, and a
recorded profile/export deferral contract.

# Scope Covered

- `goal-5`
- `task-191`
- `task-250`
- `task-251`
- `test-86`
- `task-232`
- `task-233`
- `task-234`
- `test-87`
- `task-193`

# Decisions Captured

- Materializer support remains internal/local only. There is no public
  `mdkg db materializer` CLI.
- Queue rows remain delivery state, not canonical event history.
- Materializer success commits/acks before final snapshot seal so
  `db snapshot verify` remains fresh after helper success.
- Profile implementation remains deferred; future work must start from the
  profile contract, first fixture design, and privacy/export gates.

# Implementation Summary

Added `src/core/project_db_materializer.ts` with internal helpers for enqueueing
and running one local materializer message through queue claim, durable event
load, typed reducer application, writer lease/CAS, queue ack/fail/dead-letter,
receipt writing, snapshot sealing, and stats.

Added `scripts/smoke-db-materializer.js`, `smoke:db-materializer`, prepublish
gate wiring, publish-readiness checks for the compiled helper, docs/changelog
updates, and unit coverage in `tests/commands/db_index.test.ts`.

# Verification / Testing

- `npm run test`
- `npm run cli:check`
- `node dist/cli.js validate`
- `npm run smoke:db`
- `npm run smoke:db-queue`
- `npm run smoke:db-events`
- `npm run smoke:db-materializer`
- `npm run smoke:db-snapshot`
- `node scripts/assert-publish-ready.js`
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run`
- `git diff --check`

# Known Issues / Follow-ups

- Public materializer CLI remains deferred.
- Profile reducer registry, profile migrations, and profile export commands
  remain future work.
- Public profile exports must be generated/sanitized artifacts, not direct
  active SQLite database copies.
- Run DB smokes serially or after a single build because each smoke invokes a
  build that writes shared `dist/init` output.

# Links / Artifacts

- `src/core/project_db_materializer.ts`
- `scripts/smoke-db-materializer.js`
- `task-193`
- `goal-5`
