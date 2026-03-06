---
id: task-44
type: task
title: plan mdkg dev ia and homepage positioning
status: todo
priority: 1
epic: epic-4
tags: [v0_4, mdkg-dev, docs, ia]
owners: []
links: []
artifacts: []
relates: [prd-2, dec-8, dec-9, epic-4]
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-03-04
updated: 2026-03-04
---

# Overview

Define mdkg.dev site IA and homepage positioning so mdkg is discoverable and understandable without prior history.

# Acceptance Criteria

- Top-level navigation is specified: Home, Docs, Examples, CLI, Blog, GitHub/npm.
- Home-page section plan is explicit and high-signal (what, how, 3-layer memory model, deterministic stance, quickstart, CTA).
- Positioning differentiates deterministic memory from vector-first systems while preserving source-truth caveats.
- Messaging avoids claiming unimplemented runtime command surfaces.

# Files Affected

- README.md
- .mdkg/design/prd-2-mdkg-dev-website-and-documentation-plan-v0-4.md
- .mdkg/work/task-39-mdkg-dev-deterministic-memory-vs-vectors-content.md
- .mdkg/work/task-40-mdkg-dev-skills-tools-and-episodic-trace-content.md

# Implementation Notes

- Keep this as website/docs strategy planning in this pass.
- Preserve current CLI truth and roadmap labels.

# Test Plan

Validate IA and messaging consistency against source-truth command docs (`test-15`).

# Links / Artifacts

- prd-2
- dec-8
- dec-9
- epic-4
