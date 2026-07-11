---
id: task-720
type: task
title: Verify registry integrity fresh install and v0.4.2 upgrade
status: todo
priority: 1
epic: epic-234
prev: task-719
next: task-721
tags: [release, registry, install, upgrade]
owners: []
links: []
artifacts: []
relates: [goal-64, test-391]
blocked_by: [task-719]
blocks: [task-721]
refs: [test-391]
context_refs: [goal-64, epic-234, edd-72, dec-69, task-719]
evidence_refs: []
aliases: []
skills: []
created: 2026-07-10
updated: 2026-07-10
---
# Overview

Verify the public registry artifact independently from the source checkout before
changing the user's real global installation or activating public promotion.

# Acceptance Criteria

- Registry version and `latest` are 0.5.0; integrity/tarball metadata are recorded.
- A clean temporary install reports 0.5.0 and initializes/validates successfully.
- A preserved 0.4.2 workspace upgrades idempotently without losing goals, loops,
  MANIFEST compatibility, or legacy SPEC support.
- Packaged seeds, loop skill, descriptors, docs/help, and SQLite behavior are present.

# Files Affected

List files/directories expected to change.

- Temporary install and upgrade workspaces under `/private/tmp`
- Sanitized mdkg postpublish evidence nodes

# Implementation Notes

- Execute the installed binary by absolute path to avoid checkout shadowing.
- Do not activate websites yet.

# Test Plan

Run `test-391` against registry-fetched bytes and attach all version, integrity,
init, validate, and upgrade receipts.

# Links / Artifacts

- `edd-72`
- `goal-50`
