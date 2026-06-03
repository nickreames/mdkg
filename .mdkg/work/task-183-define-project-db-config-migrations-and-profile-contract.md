---
id: task-183
type: task
title: define project db config migrations and profile contract
status: todo
priority: 1
epic: epic-30
tags: [project-db, config, migrations, profiles]
owners: []
links: []
artifacts: []
relates: [epic-29, epic-30, epic-34]
blocked_by: [task-181, task-182]
blocks: [task-184, task-187, task-189, task-193]
refs: []
aliases: [project-db-profile-contract]
skills: []
created: 2026-05-27
updated: 2026-05-27
---

# Overview

Define project DB config, schema migration runner, and profile contract for
domain-specific project databases.

# Acceptance Criteria

- Config covers enabled state, layout paths, active runtime path, sealed state
  path, snapshot commit policy, profile name, schema version, and receipt policy.
- Migration runner tracks migration keys, checksums, applied order, and
  deterministic verification.
- Profiles can provide migrations, reducers, validation rules, seed data,
  example mdkg docs, export templates, and receipt policies.

# Explicit Exclusions

- No hosted profile registry.
- No Rust sidecar dependency in the first implementation phase.

# Files Affected

- Future config schema, init assets, profile fixtures, and migration tests.

# Implementation Notes

Profiles should bundle deterministic project DB behavior without requiring
external services or hosted package registries.

# Test Plan

- Future config tests cover defaults, path containment, profile selection, and
  migration checksum validation.
- Temp repo test initializes a profile without touching external services.

# Links / Artifacts

- `epic-29`
- `epic-30`
- `epic-34`
