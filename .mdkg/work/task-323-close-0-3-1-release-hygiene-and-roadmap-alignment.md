---
id: task-323
type: task
title: close 0.3.1 release hygiene and roadmap alignment
status: done
priority: 1
epic: epic-69
parent: goal-13
tags: [release, hygiene, roadmap, 0-3-1]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: [task-324, task-327, task-329, task-326, task-328, task-330, test-129]
refs: []
aliases: []
skills: []
created: 2026-06-09
updated: 2026-06-09
---
# Overview

Close the `0.3.1` hygiene-only alignment slice before any functional CLI
hardening starts.

# Acceptance Criteria

- `CHANGELOG.md` has a new `Unreleased` section and dated `0.3.0` release
  heading.
- `goal-13` owns the `0.3.x` hardening and `mdkg.dev` readiness roadmap.
- Capability epics exist for release hygiene, status/doctor, fix planning,
  subgraph safety, branch safety, generated command docs, and mdkg.dev launch.
- Existing `goal-11` and `goal-12` are related to `goal-13`, not deleted.
- `task-148` is closed as superseded by the broader orchestrator/hardening
  roadmap.
- No functional CLI implementation, npm publish, tag, or push happens here.

# Files Affected

- `CHANGELOG.md`
- `.mdkg/work/goal-13-harden-mdkg-0-3-x-operational-safety-and-mdkg-dev-readiness.md`
- `.mdkg/work/epic-69-release-hygiene-and-roadmap-control.md`
- `.mdkg/work/task-148-create-post-publish-repo-handoff-prompts.md`

List files/directories expected to change.

- path 1
- path 2

# Implementation Notes

- note 1
- note 2

# Test Plan

How will we verify it works?

# Links / Artifacts

- related docs
- related issues
- references
