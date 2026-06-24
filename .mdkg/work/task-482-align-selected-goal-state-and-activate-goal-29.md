---
id: task-482
type: task
title: align selected-goal state and activate goal-29
status: done
priority: 1
tags: [mdkg-dev, feedback, graph-only]
owners: []
links: []
artifacts: []
relates: [goal-29]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-23
updated: 2026-06-23
---
# Overview

Align the graph state for Goal 29 by confirming no selected goal blocks the ingestion pass and making `goal-29` the only active root goal.

# Acceptance Criteria

- `node dist/cli.js goal current --json` is checked.
- `goal-29` is active and routes through the ingestion closeout.
- No achieved goal is reopened.

# Files Affected

- `.mdkg/work/goal-29-*.md`

# Test Plan

- `node dist/cli.js goal current --json`
- `node dist/cli.js goal next goal-29 --json`
- `node dist/cli.js validate --summary --json --limit 20`

# Implementation Notes

# Links / Artifacts
