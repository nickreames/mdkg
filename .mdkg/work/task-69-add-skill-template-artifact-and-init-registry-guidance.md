---
id: task-69
type: task
title: add skill template artifact and init registry guidance
status: done
priority: 1
epic: epic-9
tags: [v0_5, skills, init, registry]
owners: []
links: []
artifacts: [assets/skills/SKILL.md.example, src/commands/init.ts, scripts/copy-init-assets.js, .mdkg/skills/registry.md]
relates: [dec-12, edd-5, test-33, test-34, epic-9]
blocked_by: []
blocks: [test-33, test-34]
refs: []
aliases: []
created: 2026-03-08
updated: 2026-03-08
---

# Overview

Add a reusable built-in skill template artifact and make init-created registry guidance point to the same authoring contract used by `mdkg skill new`.

# Acceptance Criteria

- A built-in skill template artifact exists under `assets/`.
- Build output copies that artifact into runtime-accessible init assets.
- Registry guidance is deterministic and supports managed skill entries.

# Files Affected

- assets/
- scripts/
- src/commands/init.ts

# Implementation Notes

- Avoid introducing a second template shape.
- Keep registry updates deterministic and machine-managed.

# Test Plan

- Validate via `test-33` and `test-34`.

# Links / Artifacts

- epic-9
