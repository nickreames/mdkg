---
id: epic-30
type: epic
title: mdkg db command surface and project db foundation
status: todo
priority: 1
tags: [project-db, db-cli, sqlite, foundation]
owners: []
links: []
artifacts: []
relates: [epic-29, epic-20, edd-12, goal-1]
blocked_by: []
blocks: [task-181, task-182, task-183, task-184, task-223, task-224, task-225, task-226, task-227, task-228, task-229, task-230, task-231]
refs: [edd-12]
aliases: [project-db-foundation, mdkg-db-cli]
skills: []
created: 2026-05-27
updated: 2026-05-27
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
