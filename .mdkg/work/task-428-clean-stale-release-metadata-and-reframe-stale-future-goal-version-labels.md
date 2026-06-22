---
id: task-428
type: task
title: clean stale release metadata and reframe stale future-goal version labels
status: done
priority: 1
epic: epic-113
parent: goal-23
tags: [metadata, changelog, roadmap]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-21
updated: 2026-06-21
---
# Overview

Correct stale release metadata so users and agents do not mistake old source-version labels or paused roadmap milestones for current release intent.

# Acceptance Criteria

- `README.md` and `CLI_COMMAND_MATRIX.md` no longer claim source version `0.3.6`.
- `CHANGELOG.md` has a fresh `0.3.8 - Unreleased` section for this goal's work.
- `goal-20` is retargeted from `0.3.7` live-demo readiness to a later milestone without changing its deferred live-demo intent.
- `goal-21` remains paused `0.4.0` mdkg.dev launch readiness.

# Files Affected

- README.md
- CLI_COMMAND_MATRIX.md
- CHANGELOG.md
- .mdkg/work/goal-20*

# Implementation Notes

- Do not bump `package.json` to `0.3.8` until the later release-candidate pass.

# Test Plan

- `rg -n "Current package version in source|package_version_in_source|0\\.3\\.8 - Unreleased|0\\.3\\.7 live demo" README.md CLI_COMMAND_MATRIX.md CHANGELOG.md .mdkg/work`
- `node dist/cli.js validate --json`

# Links / Artifacts

- epic-113
- test-190
