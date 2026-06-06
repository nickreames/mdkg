---
id: task-234
type: task
title: design profile privacy export and redaction gates
status: done
priority: 2
epic: epic-34
parent: goal-5
tags: [project-db, profiles, privacy, export, redaction, future]
owners: []
links: []
artifacts: []
relates: [epic-34, goal-5, task-192, task-232, task-233, test-87]
blocked_by: []
blocks: [task-193, test-87]
refs: [rule-4]
aliases: [profile-privacy-export-gates]
skills: []
created: 2026-06-03
updated: 2026-06-04
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

## Privacy Classification Model

Future profiles must classify every profile-owned field and artifact before any
public export command exists:

- `private`: local-only state, raw receipts, active runtime DBs, WAL/SHM/journal
  files, scratch files, credentials, and any user-authored private data.
- `internal`: reviewable by trusted collaborators but not public-safe by
  default.
- `public`: generated export rows/documents explicitly designed for public
  sharing.
- `derived-redacted`: generated artifacts with private fields removed or
  replaced by deterministic hashes.

Unclassified profile fields default to `private`.

## Export Boundary

- Public exports must be generated artifacts, never direct copies of full active
  SQLite runtime databases.
- Sealed SQLite snapshots remain commit-eligible only by explicit private repo
  policy; public profile exports should prefer deterministic JSON or text dumps
  generated from public-safe selectors.
- Export commands must fail closed when a selected profile table, receipt, or
  field lacks a public/export classification.
- Runtime DB, WAL, SHM, journal, lock, temp, and scratch files are never public
  export inputs.
- Receipt artifacts may be exported only through profile-specific public receipt
  templates that remove private details.

## Redaction Rules

- Redaction must run from structured profile metadata, not ad hoc string
  replacement.
- Public exports should preserve stable row identity using deterministic hashes
  when needed, but must not expose raw private values.
- Redacted dumps must include a manifest with profile id, profile version,
  source snapshot hash, export template id, generated timestamp, and export
  artifact hash.
- Export manifests must record omitted private field names and row counts without
  including private values.

## Git And Artifact Policy

- Active runtime databases and transient SQLite files remain ignored.
- Private sealed snapshots can be tracked only by explicit repo policy and size
  guidance from `rule-4`.
- Public exports should be small text/JSON artifacts by default.
- Large generated profile artifacts require explicit Git LFS guidance before
  they become commit-eligible.

## Future Test Expectations

- Public export excludes rows and fields classified `private`.
- Public export fails on unclassified fields.
- Private export can include private rows only when explicitly requested and
  remains non-public by metadata.
- Active runtime DB/WAL/SHM/journal/lock/temp files are rejected as public export
  artifacts.
- Redacted canonical dump manifests fail verification when hashes drift.
- Bundle/public pack visibility checks fail closed when public nodes reference
  private profile exports.

# Test Plan

- Future tests cover sanitized public exports, private field exclusion, blocked
  active runtime/WAL sidecars, large snapshot warnings, and manifest mismatch
  failures.

# Closeout Evidence

- Record profile export policy, redaction model, and concrete test cases.
- Recorded profile privacy classes, export boundary, redaction rules, Git/artifact
  policy, and future test expectations. No profile/export implementation was
  started.

# Links / Artifacts

- `epic-34`
- `goal-5`
- `task-192`
- `task-232`
