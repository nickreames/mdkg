---
id: task-192
type: task
title: define privacy redaction git lfs and public export policy
status: done
priority: 1
epic: epic-29
tags: [project-db, privacy, redaction, git-lfs, export]
owners: []
links: []
artifacts: [.mdkg/design/edd-13-project-db-sealed-snapshot-and-canonical-dump-architecture.md, .mdkg/work/task-234-design-profile-privacy-export-and-redaction-gates.md, .mdkg/work/task-242-update-db-snapshot-docs-doctor-ignore-and-publish-readiness.md]
relates: [epic-29, epic-31, epic-34, task-182, task-185, task-186]
blocked_by: []
blocks: [task-193]
refs: [rule-4]
aliases: [project-db-privacy-policy]
skills: []
created: 2026-05-27
updated: 2026-06-03
---

# Overview

Define privacy, redaction, Git LFS, and public export policy for project
application databases.

# Acceptance Criteria

- Public exports are generated and sanitized; full project SQLite files are not
  exposed directly to public sites.
- PII snapshots are never committed to public repositories.
- Git LFS is recommended only for large sealed snapshots or binary artifacts,
  not active WAL databases or frequent tiny state changes.
- Pre-commit policy blocks active WAL sidecars, warns on large snapshots, and
  verifies manifest hashes.

# Explicit Exclusions

- No public PII snapshot commits.
- No active WAL commits.
- No assumption that LFS provides fine-grained database versioning.

# Files Affected

- Future Git policy docs, redaction/export commands, pre-commit guidance, and
  tests.

# Implementation Notes

Public exports must be generated and sanitized. Git LFS is for large sealed
artifacts, not frequent state mutation history.

# Test Plan

- Future tests cover redacted canonical dumps, blocked WAL sidecars, large
  snapshot warnings, and manifest/hash mismatch failures.

# Links / Artifacts

- `epic-31`
- `epic-34`
- `rule-4`

# Closeout Evidence

This broad roadmap task is closed as decomposition work. Basic sealed snapshot
Git/privacy policy is captured in `edd-13` and implementation task `task-242`.
Profile-level redaction and public export gates remain future work under
`task-234`.
