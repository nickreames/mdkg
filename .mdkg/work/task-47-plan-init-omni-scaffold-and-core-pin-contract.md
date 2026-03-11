---
id: task-47
type: task
title: plan init omni scaffold and core pin contract
status: done
priority: 1
epic: epic-4
tags: [v0_4, init, scaffold, pins]
owners: []
links: []
artifacts: []
relates: [prd-1, dec-8, dec-9, edd-2, edd-4, epic-4]
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-03-04
updated: 2026-03-05
---

# Overview

Define the explicit scaffold-file and core-pin behavior for `mdkg init --omni` so bootstrapped repos are deterministic, schema-safe, and constraint-first.

# Acceptance Criteria

- Omni scaffold target paths are documented: `.mdkg/core/SOUL.md`, `.mdkg/core/HUMAN.md`, `.mdkg/skills/`, `.mdkg/work/events/events.jsonl`.
- Skills scaffold directory/registry contract is documented; default example skill file is optional and not required.
- Core pin update behavior is documented as ID-only with no duplicates and priority ordering for SOUL/HUMAN pins.
- `.mdkg/work/events/*.md` guidance files are explicitly excluded in favor of root/core docs guidance.
- No `.mdkg/twin/` dependency is introduced in 0.0.4 docs.

# Files Affected

- src/commands/init.ts
- src/cli.ts
- src/pack/verbose_core.ts
- .mdkg/design/edd-4-mdkg-init-omni-specification-v0-4.md
- .mdkg/design/edd-2-mdkg-v0-4-architecture-indexing-validation-packs-skills.md
- .mdkg/work/task-33-plan-init-omni-flag-and-llm-compatibility.md

# Implementation Notes

- Keep core pin semantics ID-only.
- Keep this pass docs/work-node only.
- Keep default scaffold minimal and deterministic.

# Test Plan

Future implementation should verify scaffold generation, ID-only pin updates, and deterministic non-dup ordering (`test-17`).

# Links / Artifacts

- prd-1
- dec-8
- dec-9
- edd-2
- edd-4
- epic-4
