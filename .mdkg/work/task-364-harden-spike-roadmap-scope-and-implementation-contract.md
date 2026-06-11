---
id: task-364
type: task
title: harden spike roadmap scope and implementation contract
status: done
priority: 1
epic: epic-84
parent: goal-14
tags: [spike, alignment, roadmap, contract]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
created: 2026-06-11
updated: 2026-06-11
---
# Overview

Align `goal-14` into a more ambitious first-class spike system goal before
functional implementation begins. This task makes the implementation contract
decision-complete and routes the goal through hardening, dogfood, and `0.3.2`
release-candidate readiness.

# Acceptance Criteria

- `goal-14` is renamed and expanded to cover spike system hardening and `0.3.2`
  RC dry-run readiness.
- `goal-14` temporarily routes to `task-364` during alignment, then routes back
  to `task-348` after closeout.
- `epic-84`, `task-365` through `task-369`, and `test-153` through `test-156`
  are scoped to `goal-14`.
- `task-348` through `task-351` and `test-142` through `test-144` are updated to
  avoid overlap and cover implementation, docs, smoke, dogfood, and hardening.
- No functional source, package metadata, changelog, publish, tag, or push occurs
  in this alignment task.

# Files Affected

- `.mdkg/work/`
- `.mdkg/index/mdkg.sqlite`

# Implementation Notes

- Keep `goal-14` as the active umbrella; do not create `goal-16`.
- Keep `goal-15` paused until spike support exists and can be dogfooded.
- Record `0.3.2` as release-candidate readiness only; real publish remains a
  separate explicit request.

# Test Plan

- `/opt/homebrew/bin/mdkg validate --json`
- `/opt/homebrew/bin/mdkg goal next goal-14 --json`
- `/opt/homebrew/bin/mdkg goal claim goal-14 task-348 --json`
- `/opt/homebrew/bin/mdkg doctor --strict --json`
- `git diff --check`

# Links / Artifacts

- `goal-14`
- `task-348`
- `test-152`

# Evidence

- `git status --short --branch` preflight: clean working tree, `main` ahead of
  `origin/main` by 8 commits.
- `/opt/homebrew/bin/mdkg validate --json`: passed with zero warnings and zero
  errors after alignment edits.
- `/opt/homebrew/bin/mdkg goal next goal-14 --json`: returned `task-364` with no
  warnings while alignment was active.
- `git diff --check`: passed.
- Scope remains graph-only: `.mdkg/work/` and `.mdkg/index/mdkg.sqlite` are the
  intended changed surfaces before commit.
