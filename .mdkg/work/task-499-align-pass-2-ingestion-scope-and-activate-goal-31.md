---
id: task-499
type: task
title: align pass 2 ingestion scope and activate goal-31
status: done
priority: 1
tags: [mdkg-dev, graph-only]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: [task-500]
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context]
created: 2026-06-23
updated: 2026-06-23
---
# Overview

Confirm the ingestion is mdkg-only, restore the one-active-goal invariant, and route Goal 31 to this task.

# Acceptance Criteria

- `goal-31` is the only active root goal during ingestion.
- `goal-32` remains paused.
- The pass does not edit functional source, site, docs, scripts, package metadata, deploy config, or generated command docs.

# Files Affected

- `.mdkg/work/`
- `.mdkg/design/`
- `.mdkg/archive/`

# Test Plan

- `node dist/cli.js goal current --json`
- `node dist/cli.js goal next goal-31 --json`

# Implementation Notes

# Links / Artifacts
