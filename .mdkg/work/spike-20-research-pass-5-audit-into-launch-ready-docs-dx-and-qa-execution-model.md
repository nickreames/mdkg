---
id: spike-20
type: spike
title: research pass-5 audit into launch-ready docs DX and QA execution model
status: done
priority: 1
epic: epic-181
parent: goal-35
tags: [mdkg-dev, research, pass-5]
owners: []
links: []
artifacts: [archive://archive.mdkg-dev-preview-audit-pass-5-2026-06-24]
relates: [goal-35, task-550, task-552, task-558, task-559]
blocked_by: [task-549]
blocks: []
refs: [archive://archive.mdkg-dev-preview-audit-pass-5-2026-06-24]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-24
updated: 2026-06-24
---
# Research Question

What is the smallest launch-ready pass that resolves the pass-5 audit without turning mdkg.dev into a broad redesign or production launch?

# Context And Constraints

- Public previews already exist for `mdkg-dev` and `mdkg-docs`.
- Goal-35 may push implementation work later, but this creation pass must not.
- Docs links use preview URLs until DNS is live.
- Product Design and Creative Production are review gates, not final asset-production requirements.

# Search Plan

- Review the archived pass-5 audit.
- Compare current docs and marketing surfaces against `prd-10`, `edd-48` through `edd-53`, and prior pass checkpoints.
- Ground command examples against the generated command contract/help before implementation.

# Findings

- The key launch-ready risks are link correctness, command correctness, docs outline quality, first-success friction, agent-readable text formatting, and measured QA proof.

# Recommendation

Execute the scoped task queue in order, treating docs link/TOC/command correctness as prerequisites before copy, design, QA, push, and Vercel proof.

# Follow-Up Nodes To Create

- Only create follow-up nodes for work that is explicitly out of scope, such as generated image/video assets, DNS cutover, production promotion, analytics activation, or GitHub settings mutation.

# Evidence And Sources

- `archive://archive.mdkg-dev-preview-audit-pass-5-2026-06-24`

# Options And Tradeoffs

# Skill Candidates
