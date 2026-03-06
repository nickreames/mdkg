---
id: task-36
type: task
title: plan pack skill inclusion
status: done
priority: 1
epic: epic-4
tags: [v0_4, pack, skills]
owners: []
links: []
artifacts: []
relates: [prd-1, dec-8, dec-9, edd-2, edd-3, edd-5]
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-02-27
updated: 2026-03-05
---

# Overview

Define how packs can optionally include skill instructions while preserving deterministic pack assembly and predictable limits.

# Acceptance Criteria

- Optional skill inclusion is documented as planned behavior and remains policy-driven.
- Progressive disclosure guidance is explicit (meta for planning, full for execution).
- Target pack assembly order is explicit: root first, pinned core docs second, related nodes third, skills last.
- Default inclusion of the latest checkpoint (when available) is documented as planned behavior.
- Ordering and limit interactions are documented for deterministic outputs.
- Current `pack` behavior gap is captured with source references.

# Files Affected

- src/commands/pack.ts
- src/pack/pack.ts
- src/cli.ts
- .mdkg/core/rule-2-context-pack-rules.md
- .mdkg/design/edd-2-mdkg-v0-4-architecture-indexing-validation-packs-skills.md

# Implementation Notes

- Do not change current pack defaults in this planning pass.
- Keep pack profile and budget behavior as compatibility constraints.
- Skills/events CLI names remain deferred; any examples are non-normative.
- Keep single-writer and commit-cadence rules documented as external orchestrator guidance.

# Test Plan

Future implementation should verify pack determinism with and without skill inclusion and enforce limits consistently (`test-10`).

# Links / Artifacts

- prd-1
- dec-8
- dec-9
- edd-2
- edd-3
- edd-5
- epic-4
