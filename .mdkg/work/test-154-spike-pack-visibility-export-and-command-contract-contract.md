---
id: test-154
type: test
title: spike pack visibility export and command contract contract
status: todo
priority: 1
epic: epic-84
parent: goal-14
tags: [spike, pack, visibility, command-contract]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-366]
blocks: []
refs: []
aliases: []
skills: []
cases: [pack includes spike deterministically, public and internal visibility behave correctly, command contract documents spike surface]
created: 2026-06-11
updated: 2026-06-11
---
# Overview

Validate that spikes behave correctly in packs, visibility-filtered output,
structured exports, and generated command metadata.

# Target / Scope

- `task-366`
- pack ordering
- visibility exports
- command contract/docs

# Preconditions / Environment

- Repo fixture with spike nodes, goal scope, visibility markings, and related
  work nodes.
- Built CLI and generated command contract available.

# Test Cases

- `mdkg pack <spike-id> --format json|md|xml|toon` is deterministic and includes
  the expected spike root and context.
- `mdkg pack <goal-id>` includes scoped spikes and excludes unrelated spikes.
- Public/internal visibility filters do not leak less-visible spike content.
- `npm run cli:contract` and `npm run smoke:command-docs` include spike support.
- `mdkg show/list/search` structured outputs remain well-formed for spikes.

# Results / Evidence

- Pending implementation.

# Notes / Follow-ups

- This test closes the pack/export/doc parity surface.
