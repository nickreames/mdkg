---
id: task-708
type: task
title: Add installed package loop smoke CI and publish readiness coverage
status: done
priority: 1
epic: epic-228
prev: task-707
next: task-709
tags: [loop, package, smoke, ci]
owners: []
links: []
artifacts: []
relates: [goal-61, test-381]
blocked_by: []
blocks: [task-709]
refs: [test-381]
context_refs: [goal-61, epic-228, edd-70, dec-67]
evidence_refs: [chk-414]
aliases: []
skills: []
created: 2026-07-10
updated: 2026-07-10
---
# Overview

Add the packaged-consumer and CI proof missing from the initial loop release so
SQLite, seed payload, generated outputs, and supported Node behavior are tested
before npm publication.

# Acceptance Criteria

- `smoke:loop` installs the packed artifact in a clean workspace and exercises
  all seven seeded templates with SQLite.
- Smoke verifies dry-run then real fork ID behavior, plan/next, and pack.
- CI runs minimum supported Node and current LTS package/release gates.
- Publish-readiness fails on missing loop payload, generated drift, or missing
  changelog coverage for the package version.

# Files Affected

List files/directories expected to change.

- Package scripts and new loop smoke script/fixtures
- GitHub Actions workflow
- Publish-readiness assertion and tests

# Implementation Notes

- Do not bump to `0.5.0` in this task.
- Use the tarball rather than a source link for consumer truth.

# Test Plan

Run `test-381`, the CI-equivalent local matrix, npm pack inspection, and isolated
SQLite smoke.

# Links / Artifacts

- `edd-70`
- `goal-64`
