---
id: task-234
type: task
title: design profile privacy export and redaction gates
status: todo
priority: 2
epic: epic-34
tags: [project-db, profiles, privacy, export, redaction, future]
owners: []
links: []
artifacts: []
relates: [epic-34, task-192, task-232, task-233]
blocked_by: [task-192, task-232]
blocks: []
refs: [rule-4]
aliases: [profile-privacy-export-gates]
skills: []
created: 2026-06-03
updated: 2026-06-03
---

# Overview

Define the privacy, redaction, and public export gates that project DB profiles
must satisfy before profile implementation ships.

# Acceptance Criteria

- Defines how profiles classify private fields, public-safe exports, receipt
  artifacts, and sealed snapshot policies.
- Requires public exports to be generated and sanitized rather than exposing
  full SQLite files directly.
- Defines Git and Git LFS guidance for profile-generated snapshots and binary
  artifacts.
- Defines test expectations for public/private profile exports, redacted
  canonical dumps, blocked active WAL files, and manifest hash checks.

# Explicit Exclusions

- No profile implementation.
- No public PII snapshot commits.
- No body redaction for arbitrary Markdown in this planning task.

# Files Affected

- Future privacy docs, profile export commands, canonical dump tests, and
  pre-commit guidance.

# Implementation Notes

This task should build on `task-192` and the completed DB foundation but should
not block the generic `mdkg db` foundation from closing.

# Test Plan

- Future tests cover sanitized public exports, private field exclusion, blocked
  active runtime/WAL sidecars, large snapshot warnings, and manifest mismatch
  failures.

# Closeout Evidence

- Record profile export policy, redaction model, and concrete test cases.

# Links / Artifacts

- `epic-34`
- `task-192`
- `task-232`
