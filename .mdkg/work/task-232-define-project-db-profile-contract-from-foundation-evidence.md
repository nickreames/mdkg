---
id: task-232
type: task
title: define project db profile contract from foundation evidence
status: done
priority: 2
epic: epic-34
parent: goal-5
tags: [project-db, profiles, contract, future]
owners: []
links: []
artifacts: []
relates: [epic-34, epic-30, goal-5, edd-12, task-183, task-231]
blocked_by: []
blocks: [task-233, task-234, test-87]
refs: [edd-12]
aliases: [project-db-profile-contract]
skills: []
created: 2026-06-03
updated: 2026-06-04
---

# Overview

Define the future project DB profile contract using evidence from the completed
generic `mdkg db` foundation.

# Acceptance Criteria

- Defines profile artifact layout without changing the generic `.mdkg/db`
  foundation behavior.
- Specifies how profiles provide schema migrations, seed data, reducers,
  validation rules, receipt policies, sample mdkg docs, and export templates.
- Defines how profile migrations compose with mdkg-owned generic foundation
  migrations without checksum ambiguity.
- Captures how profile names, versions, and compatibility ranges are validated
  in config.
- Documents that profile support is future work and not part of the foundation
  release.

# Explicit Exclusions

- No profile implementation.
- No arbitrary SQL command.
- No hosted queue, Rust sidecar, or embedding/vector profile.

# Files Affected

- Future profile docs, config schema, migration runner, templates, and tests.

# Implementation Notes

Keep the contract generic. Use the foundation evidence from `task-227` through
`task-231` to avoid coupling profiles to one product domain too early.

## Proposed Profile Contract

A future project DB profile is a versioned, local bundle of opt-in application
state behavior layered on top of the mdkg-owned `.mdkg/db` foundation. Profiles
must never replace the generic foundation migrations and must not require a
hosted service.

Profile metadata should include:

- `profile_id`: stable lowercase id, for example `agent-room.v1`.
- `profile_version`: semver-like profile package version.
- `requires_mdkg_db_schema`: supported mdkg project DB schema range.
- `migration_namespace`: profile-owned migration key prefix.
- `reducers`: typed reducer names and versions.
- `seed_sets`: deterministic optional seed fixtures.
- `receipt_policy`: receipt kinds emitted by profile reducers/workflows.
- `export_templates`: public/private export recipes and redaction policies.
- `sample_docs`: optional mdkg graph fixtures used by profile smoke tests.

Profile files should live under a future profile-owned path, not inside the
active runtime DB:

- `.mdkg/db/profiles/<profile_id>/profile.json`
- `.mdkg/db/profiles/<profile_id>/migrations/*.sql`
- `.mdkg/db/profiles/<profile_id>/seeds/*.json`
- `.mdkg/db/profiles/<profile_id>/exports/*.json`
- `.mdkg/db/profiles/<profile_id>/fixtures/.mdkg/...`

## Migration Composition Rules

- mdkg-owned migrations continue to use `mdkg.project_db.*` keys and ordinals.
- Profile migrations use a separate namespace such as
  `profile.<profile_id>.<name>.vN`.
- A future migration runner records profile migrations in the same migration
  table only if the key namespace and checksum are unambiguous.
- mdkg foundation migrations must always run before profile migrations.
- Profile migrations must be idempotent and checksum-locked.
- Profile migration files are commit-eligible; active runtime/WAL files remain
  ignored.
- Profiles must not expose arbitrary SQL through public CLI input.

## Config Shape

A future config extension should stay disabled by default:

```json
{
  "db": {
    "profiles": {
      "enabled": false,
      "active": [],
      "allow_experimental": false
    }
  }
}
```

When enabled, each active profile should validate:

- profile id syntax and uniqueness.
- profile version compatibility with mdkg package and project DB schema.
- profile migration namespace ownership.
- contained local paths only.
- no raw secrets, live credentials, hosted queue dependency, or external DB
  requirement.

## Reducer And Receipt Boundary

Profiles may register typed reducers, validation rules, and receipt policies.
Reducers must use short internal helper transactions, never public raw SQL.
Receipts must remain deterministic JSON artifacts under `.mdkg/db/receipts` or
future profile-specific receipt subpaths. Profile reducers should build on the
queue, event, materializer, writer lease/CAS, and sealed snapshot foundations
instead of bypassing them.

## Open Risks

- Profiles can become product-specific too early if the first fixture is not
  generic.
- Profile migration keys could collide with mdkg foundation keys without a
  strict namespace.
- Public exports may leak private state if privacy gates are not designed before
  implementation.
- Binary snapshot growth may require explicit Git LFS policy before profile
  examples become commit-eligible.

# Test Plan

- Future tests should cover valid profile metadata, migration composition,
  checksum drift, incompatible profile versions, and disabled profile behavior.

# Closeout Evidence

- Record the proposed profile schema, migration composition rules, and open
  implementation risks before any profile code is started.
- This node records the proposed profile metadata, layout, migration composition
  rules, config shape, reducer/receipt boundary, and open risks. No profile
  source implementation was started.

# Links / Artifacts

- `epic-34`
- `epic-30`
- `goal-5`
- `task-231`
