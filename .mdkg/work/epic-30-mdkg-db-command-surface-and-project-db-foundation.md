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
relates: [epic-29, epic-20]
blocked_by: []
blocks: [task-181, task-182, task-183, task-184]
refs: []
aliases: [project-db-foundation, mdkg-db-cli]
skills: []
created: 2026-05-27
updated: 2026-05-27
---

# Overview

Define the generic mdkg project database foundation and the future `mdkg db ...`
command surface. This layer separates the rebuildable `.mdkg/index` graph cache
from `.mdkg/db` project application state.

# Goal

Plan the first public command and configuration surface for mdkg project
application databases.

# Scope

- `mdkg db` command taxonomy.
- `mdkg index` compatibility shortcut policy.
- `.mdkg/db` layout and project DB config.
- Initial migration, verify, and stats command requirements.

# Acceptance Criteria

- `mdkg db` command taxonomy covers index-cache inspection and project DB
  lifecycle without removing `mdkg index`.
- `.mdkg/db/{schema,runtime,state,receipts}` is the default layout.
- Project DB config, profiles, migration runner, and basic lifecycle commands
  are scoped for future implementation.
- Active runtime WAL files are ignored and sealed snapshots are opt-in.

# Milestones

- Command taxonomy is defined.
- Filesystem layout is defined.
- Project DB config and lifecycle commands are ready for implementation.

# Out of Scope

- No hosted database service requirement.
- No arbitrary agent SQL write path.
- No Rust sidecar requirement in this phase.

# Risks

- CLI bloat if index-cache and application-state commands are not clearly split.
- Users may confuse `.mdkg/index` cache files with `.mdkg/db` project state.

# Links / Artifacts

- `epic-29`
- `task-181`
- `task-182`
- `task-183`
- `task-184`
