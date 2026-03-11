---
id: task-76
type: task
title: standardize empty state zero match and count messaging
status: done
priority: 1
epic: epic-10
tags: [v0_5, cli, ux, output]
owners: []
links: []
artifacts: [src/commands/list.ts, src/commands/search.ts, src/commands/skill.ts]
relates: [dec-13, test-41, epic-10]
blocked_by: []
blocks: [test-41]
refs: []
aliases: []
created: 2026-03-08
updated: 2026-03-08
---

# Overview

Standardize text-mode count and zero-result notes while keeping JSON mode machine-clean on stdout.

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
