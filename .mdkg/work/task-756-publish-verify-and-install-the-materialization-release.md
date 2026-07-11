---
id: task-756
type: task
title: publish verify and install the materialization release
status: todo
priority: 1
parent: goal-67
prev: task-755
next: task-757
tags: [goal-67, publish, install, verification]
owners: []
links: []
artifacts: []
relates: [goal-67]
blocked_by: [task-755]
blocks: [task-757]
refs: [goal-67]
context_refs: [goal-66]
evidence_refs: []
aliases: [materialize-release-publish]
skills: [verify-close-and-checkpoint]
created: 2026-07-11
updated: 2026-07-11
---

# Overview

Execute only the approved release mutations, verify registry and integrity,
then prove clean temporary and real global installs.

# Acceptance Criteria

- Origin receives the approved release commit without force and CI passes.
- Npm publication, dist-tag, version, shasum/integrity, and timestamp agree.
- A clean temporary install passes materialize positive/negative and clone
  compatibility probes.
- The real global install reports the released version and passes the same
  bounded core probes.
- No tag or unapproved provider mutation occurs.

# Files Affected

- Approved Git/npm/global install state and release evidence.

# Implementation Notes

Fix forward after publication; never unpublish or rewrite history.

# Test Plan

- `test-418`
- `test-419`

# Links / Artifacts

- Registry and installed-package receipts
