---
id: test-10
type: test
title: v0.4 skills indexing and pack inclusion
status: done
priority: 1
epic: epic-4
tags: [v0_4, skills, pack]
owners: []
links: []
artifacts: [cmd:npm_run_test_ok_2026_03_05, cmd:node_dist_cli_validate_ok_2026_03_05]
relates: [prd-1, dec-8, dec-9, edd-2, edd-3, edd-5, task-35, task-36, implement-2, implement-3]
blocked_by: []
blocks: []
refs: []
aliases: []
cases: [skills-index-determinism, skills-json-shape, pack-skill-inclusion]
created: 2026-02-27
updated: 2026-03-05
---

# Overview

Validate planned v0.4 skill metadata indexing and optional pack inclusion behavior.

# Target / Scope

Covers root-owned skill discovery metadata and deterministic pack outputs when skills are included or excluded.

# Preconditions / Environment

- fixture skills exist under `.mdkg/skills/`
- index and pack implementation changes are present
- deterministic ordering rules are documented

# Test Cases

- Verify root-owned scan discovers `.mdkg/skills/**/SKILL.md` deterministically.
- Verify `.mdkg/index/skills.json` shape and field ordering follow documented schema.
- Verify required skill fields (`name`, `description`) are enforced.
- Verify optional flattened `ochatr_*` metadata remains non-breaking.
- Verify optional skill inclusion in packs preserves deterministic ordering and truncation priorities.
- Verify progressive disclosure behavior is documented for metadata-first planning and full-body execution.
- Verify latest-checkpoint inclusion is on by default when a checkpoint exists and preserves deterministic ordering.

# Results / Evidence

Capture index snapshots, pack outputs, and deterministic comparison checks.

# Notes / Follow-ups

- Add edge cases for large skill sets.
- Add backward compatibility checks for pack defaults.
