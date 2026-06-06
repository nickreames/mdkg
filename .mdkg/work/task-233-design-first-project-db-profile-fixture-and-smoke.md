---
id: task-233
type: task
title: design first project db profile fixture and smoke
status: done
priority: 2
epic: epic-34
parent: goal-5
tags: [project-db, profiles, smoke, fixture, future]
owners: []
links: []
artifacts: []
relates: [epic-34, epic-30, goal-5, task-193, task-232, test-87]
blocked_by: []
blocks: [task-193, task-234]
refs: [edd-12]
aliases: [first-project-db-profile-smoke]
skills: []
created: 2026-06-03
updated: 2026-06-04
---

# Overview

Design the first project DB profile fixture and packed temp-repo smoke after the
generic DB foundation is stable.

# Acceptance Criteria

- Selects a first generic profile candidate and explains why it is the right
  proof vehicle.
- Defines the profile fixture's schema migrations, seed data, sample mdkg docs,
  receipt policy, and canonical export expectations.
- Defines a packed-package smoke that starts from `mdkg init --agent`, applies
  the profile, runs migrations, verifies stats, and proves profile docs remain
  graph-valid.
- Keeps project DB profiles generic and avoids product-specific branding in
  public mdkg docs.

# Explicit Exclusions

- No profile implementation in this planning task.
- No external queue, hosted DB, or consumer repo change.
- No PII/public export fixture until privacy gates are designed.

# Files Affected

- Future profile fixture, smoke script, docs, and tests.

# Implementation Notes

Use the completed foundation commands as prerequisites: `mdkg db init`, `mdkg db
migrate`, `mdkg db verify`, and `mdkg db stats`.

## Selected First Profile Candidate

First future fixture: `project-kv.v1`.

Why this is the right proof vehicle:

- It is generic and not tied to a product domain.
- It builds directly on the existing `project_meta` foundation and
  `project_meta.set` reducer evidence.
- It can prove profile migration composition, deterministic seeds, typed
  reducers, receipt policy, materializer integration, and exports without
  introducing PII or hosted-service assumptions.
- It gives profile tests a simple observable state surface: namespaced key/value
  rows and deterministic export documents.

## Fixture Shape

Profile metadata:

- `profile_id: project-kv.v1`
- `profile_version: 0.1.0`
- `requires_mdkg_db_schema: >=1 <2`
- `migration_namespace: profile.project-kv.v1`
- reducer: `project_kv.set@v1`
- receipt kinds: `profile-event-applied`, `profile-export-written`,
  `profile-export-rejected`

Profile migration:

- `profile.project-kv.v1.foundation`
- Creates `profile_project_kv` with `project_id`, `branch_id`, `key`, `value`,
  `visibility`, `updated_at_ms`, and a composite primary key.
- Keeps profile tables separate from mdkg-owned tables.

Seed set:

- `baseline.json` with two public-safe rows and one private row.
- Seed rows are deterministic and replayable.

Sample mdkg docs:

- One task node referencing the profile fixture.
- One test node describing the expected public export.

## Future Packed Smoke Contract

Future command: `npm run smoke:db-profile-project-kv`.

Smoke flow:

1. Pack and install mdkg into a temp prefix.
2. Create a fresh git repo.
3. Run `mdkg init --agent`, `mdkg db init`, `mdkg db migrate`.
4. Enable the `project-kv.v1` profile.
5. Apply profile migrations and seeds.
6. Record a profile event and run the materializer helper through the profile
   reducer.
7. Run `db verify`, `db stats`, `db snapshot seal`, `db snapshot verify`,
   `index`, and `validate`.
8. Generate private and public exports.
9. Assert public export excludes private rows and active SQLite runtime/WAL
   files.

## Deferred Implementation Risks

- Profile reducer registry needs a stable extension point beyond the current
  hard-coded `project_meta.set` reducer.
- Profile migration ordering needs CLI and checksum UX before public exposure.
- Export privacy gates in `task-234` must land before the fixture can include
  any realistic private data.
- No profile command should be added until the smoke can prove packaged behavior.

# Test Plan

- Future smoke should use a packed install and a fresh temp repo.
- Future tests should prove profile migrations are deterministic and profile
  artifacts can be validated without mutating unrelated mdkg graph nodes.

# Closeout Evidence

- Record selected first profile, fixture shape, smoke command, and deferred
  risks.
- Selected `project-kv.v1` as the future first profile fixture and recorded its
  metadata, migration, seeds, docs, smoke flow, and deferred risks. No profile
  implementation was started.

# Links / Artifacts

- `epic-34`
- `goal-5`
- `task-193`
- `task-232`
