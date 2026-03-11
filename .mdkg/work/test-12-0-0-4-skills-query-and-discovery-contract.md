---
id: test-12
type: test
title: 0.0.4 skills query and discovery contract
status: done
priority: 1
epic: epic-4
tags: [v0_4, skills, query]
owners: []
links: []
artifacts: [cmd:npm_run_test_ok_2026_03_05, cmd:node_dist_cli_validate_ok_2026_03_05]
relates: [prd-1, dec-8, dec-9, edd-2, edd-3, edd-5, task-41, implement-1, implement-2]
blocked_by: []
blocks: []
refs: []
aliases: []
cases: [skills-list-discovery, skills-show-detail, skills-search-index-fields]
created: 2026-02-27
updated: 2026-03-05
---

# Overview

Validate planned 0.0.4 skills query and discovery capabilities across list/show/search surfaces.

# Target / Scope

Covers discoverability, metadata visibility, and search matching behavior for indexed skill records.

# Preconditions / Environment

- skills fixtures exist under `.mdkg/skills/`
- `skills.json` indexing is enabled in implementation
- query capability implementation is present

# Test Cases

- Verify skill discovery surfaces include indexed skill metadata deterministically.
- Verify metadata-only and full-body display capability paths behave as documented.
- Verify search matches skill slug, name, description, tags, and path fields.
- Verify discovery flow favors metadata lookup before loading full skill bodies.

# Results / Evidence

Capture query outputs, fixture data, and deterministic comparison logs.

# Notes / Follow-ups

- Add ambiguous query resolution cases.
- Add cross-workspace regression checks if multi-skill-scope support is introduced later.
