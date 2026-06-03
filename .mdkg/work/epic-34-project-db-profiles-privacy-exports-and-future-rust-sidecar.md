---
id: epic-34
type: epic
title: project db profiles privacy exports and future rust sidecar
status: todo
priority: 2
tags: [project-db, profiles, privacy, exports, rust]
owners: []
links: []
artifacts: []
relates: [epic-29, epic-31, epic-32]
blocked_by: []
blocks: [task-183, task-192, task-193, task-232, task-233, task-234]
refs: []
aliases: [project-db-profiles, rust-sidecar-roadmap]
skills: []
created: 2026-05-27
updated: 2026-05-27
---

# Overview

Plan productized project DB profiles, privacy/export policy, and the later Rust
sidecar contract for deterministic DAL and policy work.

# Goal

Plan productized project DB profiles, privacy boundaries, exports, and future
deterministic sidecar responsibilities.

# Scope

- Profile contents and first-profile requirements.
- Public/private export and redaction policy.
- Git LFS and snapshot-size guidance.
- Later Rust sidecar responsibilities and transport options.

# Acceptance Criteria

- Profiles can bundle schema migrations, reducers, validation rules, seed data,
  example mdkg docs, export templates, and receipt policies.
- Public exports are generated and sanitized rather than exposing full SQLite
  databases directly.
- Rust sidecar responsibilities are scoped for a later implementation epic.

# Milestones

- Profile contract is defined.
- Privacy/export policy is defined.
- Rust sidecar is scoped as future work.

# Out of Scope

- No Rust sidecar requirement in the first implementation phase.
- No public PII snapshot commits.
- No vector database profile work.

# Risks

- Product profiles leaking private state into public exports.
- Rust sidecar scope blocking the first Node/node:sqlite implementation.
- Profiles growing into hosted-service assumptions too early.

# Links / Artifacts

- `epic-29`
- `task-183`
- `task-192`
- `task-193`
- `task-232`
- `task-233`
- `task-234`
