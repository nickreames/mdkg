---
id: task-34
type: task
title: plan init ignore defaults change
status: done
priority: 1
epic: epic-4
tags: [v0_4, init, safety]
owners: []
links: []
artifacts: []
relates: [prd-1, dec-8, dec-9, edd-4, epic-4]
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-02-27
updated: 2026-03-05
---

# Overview

Plan the 0.0.4 change where `mdkg init` updates ignore entries by default, with opt-out behavior defined in implementation design.

# Acceptance Criteria

- Planned default behavior is documented clearly.
- Safety rationale and migration impact are documented.
- Opt-out behavior is identified as implementation detail to finalize later.
- Planned ignore entries include `.mdkg/work/events/*.jsonl` for episodic log safety.

# Files Affected

- src/commands/init.ts
- README.md
- .mdkg/core/rule-4-repo-safety-and-ignores.md
- .mdkg/design/prd-1-mdkg-product-spec-v0-4-deterministic-agent-memory-and-skills.md
- .mdkg/design/edd-4-mdkg-init-agent-specification-0-0-5.md

# Implementation Notes

- Keep package publish safety (`package.json` files allowlist) unchanged.
- Ensure cache/pack ignore requirements remain deterministic and explicit.

# Test Plan

Future implementation should verify init writes expected ignore entries by default and respects explicit opt-out.

# Links / Artifacts

- prd-1
- dec-8
- dec-9
- edd-4
- epic-4
