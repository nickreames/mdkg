---
id: test-143
type: test
title: goal next pack search show and task command spike contract
status: todo
priority: 1
epic: epic-76
parent: goal-14
tags: [spike, goal, pack, discovery]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-348]
blocks: []
refs: []
aliases: []
skills: []
cases: [goal next routes spike, mdkg next routes spike, pack includes spike, search show expose spike]
created: 2026-06-11
updated: 2026-06-11
---
# Overview

Prove spikes are selectable and discoverable work, not passive notes.

# Target / Scope

- `task-348`
- `mdkg next`
- `mdkg goal next`
- `mdkg list`, `mdkg search`, `mdkg show`, and `mdkg pack`
- structured output formats

# Preconditions / Environment

- Fresh repo with at least one open spike and one goal scoped to that spike.

# Test Cases

- `mdkg next --json` can return an open spike when it is the best candidate.
- `mdkg goal next <goal-id> --json` routes to a scoped open spike.
- `mdkg goal claim <goal-id> <spike-id> --json` accepts the spike.
- `mdkg list --type spike --json`, `mdkg search`, `mdkg show`, and `mdkg pack
  <spike-id>` include spike metadata and body content.
- `mdkg show <spike-id> --json|--xml|--toon|--md` remains well-formed.
- Pack ordering treats spike as actionable work and remains deterministic.

# Results / Evidence

- Pending implementation.

# Notes / Follow-ups

- Pack ordering should remain deterministic after adding a new work-node type.
- Lifecycle mutation behavior belongs in `test-142`; packed install proof
  belongs in `test-144`.
