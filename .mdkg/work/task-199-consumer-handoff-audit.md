---
id: task-199
type: task
title: consumer handoff audit
status: done
priority: 1
epic: epic-35
tags: [handoff, consumers, upgrade, release]
owners: []
links: []
artifacts: [task-148, task-171, node dist/cli.js show task-148 --json, node dist/cli.js show task-171 --json]
relates: [epic-35, task-148, task-171, epic-20, epic-21]
blocked_by: []
blocks: [task-200, task-202]
refs: []
aliases: [consumer-handoff-audit]
skills: []
created: 2026-05-30
updated: 2026-05-30
---

# Overview

Review post-publish handoff work and decide the consumer repo upgrade prompt
order after the next mdkg release is approved.

# Acceptance Criteria

- Review `task-148` and `task-171`.
- Decide prompt order for `omni-web`, `ochatr-ai-go`, `omni-room-runtime`, and
  root orchestration repos.
- Include upgrade guidance for dry-run, apply, SQLite DAL, subgraph readiness,
  and validation gates.
- Confirm no consumer repo edits happen during this audit.

# Files Affected

- `.mdkg/work/task-199-consumer-handoff-audit.md`
- `task-148`
- `task-171`

# Implementation Notes

Consumer handoff comes after package correctness. Keep prompts repo-specific but
do not run upgrade/apply commands in consumer repos during this audit.

# Test Plan

- `node dist/cli.js show task-148 --json`
- `node dist/cli.js show task-171 --json`
- `node dist/cli.js pack task-199 --profile concise --dry-run --stats`

# Audit Evidence

- `task-148` remains the generic post-publish repo handoff prompt task for
  `omni-room-runtime`, `omni-web`, and `ochatr-ai-go`.
- `task-171` remains the SQLite-specific post-publish handoff prompt task.
- Consumer repos were not edited during this audit.

# Decision

Handoff order after committing this audit:

1. Complete `task-171` for SQLite/parallel-safety upgrade prompts.
2. Complete `task-148` for broader archive, visibility, work mirror, and
   runtime-contract prompts.
3. Defer consumer repo changes until mdkg's local audit/commit state is clean.

# Links / Artifacts

- `task-148`
- `task-171`
- `epic-20`
- `epic-21`
