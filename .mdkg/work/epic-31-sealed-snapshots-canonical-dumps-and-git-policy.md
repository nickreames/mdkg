---
id: epic-31
type: epic
title: sealed snapshots canonical dumps and git policy
status: todo
priority: 1
tags: [project-db, snapshots, git, canonical-dump]
owners: []
links: []
artifacts: []
relates: [epic-29, epic-24]
blocked_by: []
blocks: [task-185, task-186, task-192]
refs: []
aliases: [sealed-snapshot-policy, project-db-git-policy]
skills: []
created: 2026-05-27
updated: 2026-05-27
---

# Overview

Define sealed project DB snapshots as portable, verifiable checkpoints and add
human-reviewable canonical dump/diff policy for binary SQLite state.

# Goal

Plan safe project DB snapshot, manifest, dump, diff, and Git policy.

# Scope

- Sealed snapshot contract.
- Snapshot manifest and hash verification.
- Canonical dump and diff review aids.
- Git ignore, LFS, and public/private export policy.

# Acceptance Criteria

- Seal contract creates clean snapshot files, manifests, hashes, and optional
  canonical dumps.
- Git policy blocks active WAL sidecars and warns on large snapshots.
- Public/private and PII export boundaries are explicit.

# Milestones

- Snapshot contract is defined.
- Canonical dump/diff behavior is defined.
- Git and privacy policy is ready for implementation.

# Out of Scope

- No default commit of sealed snapshots unless repo/profile policy opts in.
- No active runtime database or WAL sidecar commits.

# Risks

- Treating active WAL state as a sealed artifact.
- Binary snapshot changes becoming unreviewable without canonical dumps.
- Public repositories accidentally receiving private/PII snapshots.

# Links / Artifacts

- `epic-29`
- `task-185`
- `task-186`
- `task-192`
