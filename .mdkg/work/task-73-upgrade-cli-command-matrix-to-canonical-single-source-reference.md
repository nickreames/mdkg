---
id: task-73
type: task
title: upgrade cli command matrix to canonical single source reference
status: done
priority: 1
epic: epic-10
tags: [v0_5, cli, docs, matrix]
owners: []
links: []
artifacts: [CLI_COMMAND_MATRIX.md, README.md]
relates: [dec-13, test-37, epic-10]
blocked_by: []
blocks: [test-37]
refs: []
aliases: []
created: 2026-03-08
updated: 2026-03-08
---

# Overview

Promote `CLI_COMMAND_MATRIX.md` from a simplification note into the canonical single-place command and flag reference for mdkg.

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
