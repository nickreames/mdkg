---
id: task-753
type: task
title: resolve release version and finalize materialization release metadata
status: todo
priority: 1
parent: goal-67
next: task-754
tags: [goal-67, version, release-metadata]
owners: []
links: []
artifacts: []
relates: [goal-67]
blocked_by: []
blocks: [task-754]
refs: [goal-67, goal-66]
context_refs: [edd-73, dec-75, dec-76, dec-77, dec-78]
evidence_refs: []
aliases: [materialize-release-version]
skills: [select-work-and-ground-context, service-boundary-ownership-check]
created: 2026-07-11
updated: 2026-07-11
---

# Overview

Resolve the next valid version from current registry/package state and classify
the additive command/schema compatibility before changing release metadata.

# Acceptance Criteria

- Npm latest/dist-tags and package history are recorded at execution time.
- Version classification is justified by CLI and receipt compatibility.
- Package/lockfile/changelog/release notes use source-backed generic claims.
- Website/deployment activation is included only if the active release policy
  explicitly requires it.

# Files Affected

- Release metadata selected after version resolution.

# Implementation Notes

Do not hardcode a version into goal/task titles.

# Test Plan

- `test-416`
- `test-417`

# Links / Artifacts

- `goal-66` closeout checkpoint
