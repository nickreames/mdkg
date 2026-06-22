---
id: task-443
type: task
title: create paused mdkg.dev implementation roadmap goal
status: done
priority: 1
epic: epic-120
parent: goal-24
tags: [mdkg-dev]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-442]
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-22
updated: 2026-06-21
---
# Overview

Create the future implementation goal and all scoped child nodes without starting any functional work.

# Acceptance Criteria

- goal-25 exists with goal_state paused and blocked_by goal-24.
- Goal 2 has scoped epics, tasks, tests, and research nodes.
- Goal 2 required checks and stop condition are explicit.

# Files Affected

- .mdkg/work/goal-25-*.md
- .mdkg/work/epic-122-*.md through epic-126
- task-445 through task-454
- test-200 through test-205
- spike-14

# Implementation Notes

- Keep Goal 2 paused and blocked by Goal 1.
- Avoid version hardcoding in titles.

# Test Plan

- node dist/cli.js goal show goal-25 --json shows paused state.
- node dist/cli.js pack goal-25 --pack-profile concise succeeds.

# Links / Artifacts

- archive://archive.mdkg-dev-planning-docs-2026-06-22
- parent: goal-24
- epic: epic-120
- context: goal-25
- context: prd-4
- context: prd-5
- context: edd-24
- context: edd-25
- context: edd-26
- context: edd-27
- context: dec-30
