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
relates: [epic-29, epic-31, epic-32, goal-5]
blocked_by: []
blocks: [task-193, task-232, task-233, task-234, test-87]
refs: []
aliases: [project-db-profiles, rust-sidecar-roadmap]
skills: []
created: 2026-05-27
updated: 2026-06-04
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
- Profile/export work remains deferred until materializer readiness is aligned
  and `task-232` starts the profile contract from shipped foundation evidence.

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
- `goal-5`
- `task-183`
- `task-192`
- `task-193`
- `task-232`
- `task-233`
- `task-234`

# Status Notes

- 2026-06-04: `task-232`, `task-233`, `task-234`, and `test-87` recorded the
  profile contract, future `project-kv.v1` fixture/smoke design, privacy/export
  redaction gates, and deferral proof. Profile implementation, public profile
  CLI, and Rust sidecar work remain deferred to a future goal.
