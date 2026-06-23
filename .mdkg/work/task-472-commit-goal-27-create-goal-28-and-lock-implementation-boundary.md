---
id: task-472
type: task
title: commit goal-27 create goal-28 and lock implementation boundary
status: done
priority: 1
epic: epic-137
parent: goal-28
tags: []
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
created: 2026-06-22
updated: 2026-06-22
---
# Overview

Start the future implementation pass from a clean boundary. This task exists so the later executor confirms `goal-27` was committed and `goal-28` is explicitly activated before making implementation changes.

# Acceptance Criteria

- `goal-28` is activated only when the user explicitly asks to execute it.
- Current git status and remote/ahead state are recorded before implementation.
- The executor confirms this creation-only commit exists before editing `docs/` or `mdkg-dev/`.
- The executor confirms Chrome is approved for first Vercel project setup and Vercel tools are approved for deployment/log verification.
- The executor confirms GitHub/Vercel setup is limited to repository `nickreames/mdkg`; broader repo access is a stop-and-ask condition.
- Stop conditions are restated: no DNS, production promotion, npm publish, tag, analytics activation, or public launch.

# Files Affected

- `.mdkg/work/goal-28-*`
- implementation evidence nodes only

# Implementation Notes

- Use `mdkg goal activate goal-28 --json` at the start of the future execution run.
- Claim this task before mutating source files.

# Test Plan

- `node dist/cli.js goal current --json`
- `node dist/cli.js goal next goal-28 --json`
- `git status --short --branch`

# Links / Artifacts

- `goal-28`
- `goal-27`
- `chk-201`
