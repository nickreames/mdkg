---
id: task-232
type: task
title: define project db profile contract from foundation evidence
status: todo
priority: 2
epic: epic-34
tags: [project-db, profiles, contract, future]
owners: []
links: []
artifacts: []
relates: [epic-34, epic-30, edd-12, task-183, task-231]
blocked_by: [task-231]
blocks: [task-233, task-234]
refs: [edd-12]
aliases: [project-db-profile-contract]
skills: []
created: 2026-06-03
updated: 2026-06-03
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

# Test Plan

- Future tests should cover valid profile metadata, migration composition,
  checksum drift, incompatible profile versions, and disabled profile behavior.

# Closeout Evidence

- Record the proposed profile schema, migration composition rules, and open
  implementation risks before any profile code is started.

# Links / Artifacts

- `epic-34`
- `epic-30`
- `task-231`
