---
id: task-433
type: task
title: update repo-local mdkg skills for safe multi-repo upgrade subgraph sequencing
status: done
priority: 1
epic: epic-117
parent: goal-23
tags: [skills, multi-repo, subgraph]
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

Update canonical mdkg skills so future agents run warning-heavy multi-repo upgrades safely and consistently.

# Acceptance Criteria

- Skills describe read-only baselines before mutation.
- Skills require one matrix approval for cross-repo upgrade batches.
- Skills instruct one repo at a time, with child mdkg-only commits before root subgraph sync.
- Skills forbid raw secrets, prompts, tokens, provider payloads, and unrelated raw model output in graph state and handoffs.
- Mirrored skill projections are synchronized if validation requires it.

# Files Affected

- .mdkg/skills
- .agents/skills
- .claude/skills

# Implementation Notes

- Prefer updating existing skills over adding a new near-duplicate.

# Test Plan

- `node dist/cli.js skill validate pursue-mdkg-goal --json`
- `node dist/cli.js skill validate verify-close-and-checkpoint --json`
- `node dist/cli.js skill validate select-work-and-ground-context --json`
- `node dist/cli.js validate --json`

# Links / Artifacts

- epic-117
