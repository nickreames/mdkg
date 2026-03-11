---
id: task-75
type: task
title: add json output to list search show and skill discovery
status: done
priority: 1
epic: epic-10
tags: [v0_5, cli, json, discovery]
owners: []
links: []
artifacts: [src/commands/list.ts, src/commands/search.ts, src/commands/show.ts, src/commands/skill.ts, src/commands/query_output.ts, src/cli.ts]
relates: [dec-13, test-39, test-40, epic-10]
blocked_by: []
blocks: [test-39, test-40]
refs: []
aliases: []
created: 2026-03-08
updated: 2026-03-08
---

# Overview

Add JSON output to the node and skill discovery commands so orchestrators can consume structured results without parsing text output.

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
