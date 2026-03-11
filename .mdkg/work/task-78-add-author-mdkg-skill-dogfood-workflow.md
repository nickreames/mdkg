---
id: task-78
type: task
title: add author mdkg skill dogfood workflow
status: done
priority: 1
epic: epic-10
tags: [v0_5, skills, dogfood, authoring]
owners: []
links: []
artifacts: [.mdkg/skills/author-mdkg-skill/SKILL.md, .mdkg/skills/registry.md, README.md, assets/skills/SKILL.md.example]
relates: [dec-13, dec-12, test-42, epic-10]
blocked_by: []
blocks: [test-42]
refs: []
aliases: []
created: 2026-03-08
updated: 2026-03-08
---

# Overview

Add a real internal skill that teaches how to discover, scaffold, validate, and maintain mdkg skills using the new first-class skill namespace.

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
