---
id: task-233
type: task
title: design first project db profile fixture and smoke
status: todo
priority: 2
epic: epic-34
tags: [project-db, profiles, smoke, fixture, future]
owners: []
links: []
artifacts: []
relates: [epic-34, epic-30, task-193, task-232]
blocked_by: [task-232]
blocks: [task-234]
refs: [edd-12]
aliases: [first-project-db-profile-smoke]
skills: []
created: 2026-06-03
updated: 2026-06-03
---

# Overview

Design the first project DB profile fixture and packed temp-repo smoke after the
generic DB foundation is stable.

# Acceptance Criteria

- Selects a first generic profile candidate and explains why it is the right
  proof vehicle.
- Defines the profile fixture's schema migrations, seed data, sample mdkg docs,
  receipt policy, and canonical export expectations.
- Defines a packed-package smoke that starts from `mdkg init --agent`, applies
  the profile, runs migrations, verifies stats, and proves profile docs remain
  graph-valid.
- Keeps project DB profiles generic and avoids product-specific branding in
  public mdkg docs.

# Explicit Exclusions

- No profile implementation in this planning task.
- No external queue, hosted DB, or consumer repo change.
- No PII/public export fixture until privacy gates are designed.

# Files Affected

- Future profile fixture, smoke script, docs, and tests.

# Implementation Notes

Use the completed foundation commands as prerequisites: `mdkg db init`, `mdkg db
migrate`, `mdkg db verify`, and `mdkg db stats`.

# Test Plan

- Future smoke should use a packed install and a fresh temp repo.
- Future tests should prove profile migrations are deterministic and profile
  artifacts can be validated without mutating unrelated mdkg graph nodes.

# Closeout Evidence

- Record selected first profile, fixture shape, smoke command, and deferred
  risks.

# Links / Artifacts

- `epic-34`
- `task-193`
- `task-232`
