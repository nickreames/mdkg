---
id: epic-30
type: epic
title: mdkg db command surface and project db foundation
status: done
priority: 1
tags: [project-db, db-cli, sqlite, foundation]
owners: []
links: []
artifacts: [src/commands/db.ts, src/core/project_db_migrations.ts, scripts/smoke-db.js, CLI_COMMAND_MATRIX.md, CHANGELOG.md]
relates: [epic-29, epic-20, edd-12, goal-1]
blocked_by: []
blocks: [task-181, task-182, task-183, task-184, task-223, task-224, task-225, task-226, task-227, task-228, task-229, task-230, task-231]
refs: [edd-12]
aliases: [project-db-foundation, mdkg-db-cli]
skills: []
created: 2026-05-27
updated: 2026-06-03
---

# Overview

Implement the generic mdkg project database foundation and the future
`mdkg db ...` command surface. This layer separates the rebuildable
`.mdkg/index` graph cache from `.mdkg/db` project application state.

# Goal

Plan the first public command and configuration surface for mdkg project
application databases.

# Scope

- `mdkg db` command taxonomy and implementation.
- `mdkg index` compatibility shortcut policy.
- `.mdkg/db` layout and project DB config.
- Initial migration, verify, and stats command requirements.

# Acceptance Criteria

- `mdkg db` command taxonomy and implementation cover index-cache inspection
  and project DB lifecycle without removing `mdkg index`.
- `.mdkg/db/{schema,runtime,state,receipts}` is the default layout.
- Project DB config, migration runner, and basic lifecycle commands are
  implemented for a generic foundation.
- Active runtime WAL files are ignored and sealed snapshots are opt-in.
- Full project DB profiles are deferred to future nodes created at closeout.

# Milestones

- Command taxonomy is implemented.
- Filesystem layout and ignore rules are implemented.
- Project DB config and lifecycle commands are implemented and tested.
- Future profile artifacts are captured after implementation evidence.

# Out of Scope

- No hosted database service requirement.
- No arbitrary agent SQL write path.
- No Rust sidecar requirement in this phase.
- No profile system in this phase.
- No real npm publish without separate approval.

# Risks

- CLI bloat if index-cache and application-state commands are not clearly split.
- Users may confuse `.mdkg/index` cache files with `.mdkg/db` project state.

# Links / Artifacts

- `epic-29`
- `edd-12`
- `goal-1`
- `task-181`
- `task-182`
- `task-183`
- `task-184`
- `task-223`
- `task-224`
- `task-225`
- `task-226`
- `task-227`
- `task-228`
- `task-229`
- `task-230`
- `task-231`

# Closeout Evidence

`epic-30` is complete for the `0.1.7` DB foundation slice.

Implemented behavior:

- `mdkg db` namespace, help, dispatch, command matrix, and seeded docs.
- `mdkg db index rebuild|status|verify`, with `mdkg index` preserved as the
  compatibility shortcut for the same rebuild behavior.
- `.mdkg/db/{schema,runtime,state,receipts}` layout, ignore policy, and
  project DB config defaults.
- `mdkg db init`, `mdkg db migrate`, `mdkg db verify`, and `mdkg db stats`
  using Node `node:sqlite`.
- Generic foundation migration files and runtime DB schema checks.
- Unit tests, CLI parity tests, packed temp smoke coverage, and dry-run publish
  readiness.

Deferred profile work:

- `task-232`, `task-233`, and `task-234` are linked under `epic-34` for project
  DB profile contract, first profile fixture/smoke, and privacy export gates.

Final gate evidence recorded on `task-231` includes `npm run test`,
`npm run cli:check`, `node dist/cli.js validate`, `npm run smoke:db`,
`node scripts/assert-publish-ready.js`, isolated `npm pack --dry-run --json`,
isolated `npm publish --dry-run`, and `git diff --check`.

No real npm publish occurred.
