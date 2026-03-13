---
id: task-82
type: task
title: plan markdown output for discovery and show commands
status: done
priority: 1
epic: epic-11
tags: [0_0_4x, cli, markdown]
owners: []
links: []
artifacts: [src/commands/query_output.ts, src/commands/list.ts, src/commands/search.ts, src/commands/show.ts]
relates: [dec-13, epic-11]
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-03-08
updated: 2026-03-12
---

# Overview

This planning task was superseded by `epic-17` and implemented in `task-112` / `task-113`.

# Acceptance Criteria

- source docs and mdkg graph reflect the intended contract for this task
- referenced runtime/docs artifacts are updated or tracked explicitly
- linked validation/test nodes can be used to audit completion

# Files Affected

- see `artifacts` in frontmatter for the primary files touched or planned

# Implementation Notes

- keep behavior deterministic and local-first
- prefer one canonical interface per workflow over parallel teaching paths

# Test Plan

- satisfy the linked `test-*` contract for this task
- rerun `mdkg validate` after node or doc updates

# Links / Artifacts

- epic linkage and frontmatter artifacts are the source of truth for this planning record
- superseded by `epic-17`, `task-112`, and `task-113`
