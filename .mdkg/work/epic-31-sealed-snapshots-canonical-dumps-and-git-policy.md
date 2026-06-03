---
id: epic-31
type: epic
title: sealed snapshots canonical dumps and git policy
status: done
priority: 1
tags: [project-db, snapshots, git, canonical-dump]
owners: []
links: []
artifacts: [.mdkg/design/edd-13-project-db-sealed-snapshot-and-canonical-dump-architecture.md]
relates: [epic-29, epic-24, epic-30, epic-34, goal-2, edd-13]
blocked_by: []
blocks: [task-185, task-186, task-192, task-235, task-236, task-237, task-238, task-239, task-240, task-241, task-242, task-243]
refs: [edd-13, edd-12, rule-4]
aliases: [sealed-snapshot-policy, project-db-git-policy]
skills: []
created: 2026-05-27
updated: 2026-06-03
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
- `goal-2`
- `edd-13`
- `task-235`
- `task-243`

# Implementation Plan

This epic is now the active implementation scope for `goal-2`.

Broad roadmap tasks `task-185`, `task-186`, and `task-192` remain linked as
definition records. Granular implementation work is captured by `task-235`
through `task-243`.

# Completion Evidence

- 2026-06-03: Added `edd-13` and decomposed this epic into `task-235` through
  `task-243`.
- 2026-06-03: Implemented `mdkg db snapshot seal|verify|status|dump|diff`,
  snapshot manifest/integrity helpers, docs, seeded init guidance, command
  matrix parity, unit tests, and packed temp-repo smoke coverage.
- 2026-06-03: Full scoped gate passed: `npm run test`, `npm run cli:check`,
  `node dist/cli.js validate`, `npm run smoke:db`, `npm run smoke:db-snapshot`,
  `node scripts/assert-publish-ready.js`, isolated `npm pack --dry-run --json`,
  isolated `npm publish --dry-run`, and `git diff --check`.
