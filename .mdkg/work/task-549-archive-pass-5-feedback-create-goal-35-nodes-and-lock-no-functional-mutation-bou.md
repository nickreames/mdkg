---
id: task-549
type: task
title: archive pass-5 feedback create goal-35 nodes and lock no-functional-mutation boundary
status: done
priority: 1
epic: epic-181
parent: goal-35
tags: [mdkg-dev, pass-5, graph-only]
owners: []
links: []
artifacts: [archive://archive.mdkg-dev-preview-audit-pass-5-2026-06-24]
relates: [goal-35, test-269]
blocked_by: []
blocks: [task-550]
refs: [archive://archive.mdkg-dev-preview-audit-pass-5-2026-06-24]
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-06-24
updated: 2026-06-24
---
# Overview

Complete the mdkg-only creation pass for goal-35 from the archived pass-5 preview audit.

# Acceptance Criteria

- Archive sidecar exists and verifies.
- `goal-35` plus scoped epics, tasks, tests, PRD, EDDs, decisions, and spike exist.
- Creation pass touches only `.mdkg` graph/archive/index state.
- `goal next goal-35 --json` routes to `task-549` before closeout and `task-550` after claim.
- No source/site/docs/deploy/Vercel files are edited and no push occurs.

# Files Affected

- `.mdkg/archive/archive.mdkg-dev-preview-audit-pass-5-2026-06-24/`
- `.mdkg/work/`
- `.mdkg/design/`
- `.mdkg/index/mdkg.sqlite`

# Test Plan

- `node dist/cli.js archive verify archive://archive.mdkg-dev-preview-audit-pass-5-2026-06-24 --json`
- `node dist/cli.js index`
- `node dist/cli.js validate --summary --json --limit 20`
- `node dist/cli.js doctor --strict --json`
- `node dist/cli.js goal next goal-35 --json`
- `git diff --check`

# Implementation Notes

# Links / Artifacts
