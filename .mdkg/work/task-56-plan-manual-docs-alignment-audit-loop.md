---
id: task-56
type: task
title: plan manual docs alignment audit loop
status: done
priority: 1
epic: epic-5
tags: [v0_4, docs, governance, audit]
owners: []
links: []
artifacts: []
relates: [prd-1, prd-2, dec-10, edd-2, edd-3, edd-7, edd-8, epic-5]
blocked_by: []
blocks: []
refs: []
aliases: [docs-audit-loop]
created: 2026-03-04
updated: 2026-03-05
---

# Overview

Define the manual 0.0.4 docs alignment audit cadence for command parity, source-gap freshness, and planned-vs-implemented wording.

# Acceptance Criteria

- A repeatable manual audit checklist is documented.
- Audit cadence is defined for each 0.0.4.x release cut.
- `mdkg --help` vs README parity checks are included.
- Source-gap matrix refresh checks are included for core PRD/EDD docs.
- Audit results are expected to be captured in mdkg work/checkpoint records.

# Files Affected

- README.md
- .mdkg/design/prd-1-mdkg-product-spec-v0-4-deterministic-agent-memory-and-skills.md
- .mdkg/design/prd-2-mdkg-dev-external-docs-handoff-note.md
- .mdkg/design/edd-7-v0-4-agent-skills-standards-alignment-and-research-snapshot.md

# Implementation Notes

- Keep governance process lightweight and human-executable.
- Avoid introducing scripted parity checks in 0.0.4 planning.

# Test Plan

Validate audit-loop contract presence and completeness (`test-25`).

# Links / Artifacts

- prd-1
- prd-2
- dec-10
- edd-7
- edd-8
- epic-5
