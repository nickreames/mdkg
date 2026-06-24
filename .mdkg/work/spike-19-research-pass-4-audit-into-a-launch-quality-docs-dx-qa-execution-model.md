---
id: spike-19
type: spike
title: research pass-4 audit into a launch-quality docs DX QA execution model
status: todo
priority: 1
parent: goal-34
tags: [mdkg-dev, research, pass-4]
owners: []
links: []
artifacts: []
relates: [goal-34, task-535, task-545, task-546]
blocked_by: []
blocks: []
refs: [archive://archive.mdkg-dev-preview-audit-pass-4-2026-06-24]
context_refs: [prd-9, edd-43, edd-44, edd-45, edd-46, edd-47, dec-42, dec-43, dec-44, dec-45]
evidence_refs: []
aliases: []
skills: []
created: 2026-06-24
updated: 2026-06-24
---
# Research Question

How should pass-4 convert the latest audit into a launch-quality execution model that improves docs, DX, visual quality, accessibility, and preview proof without drifting into production-launch side effects?

# Context And Constraints

- Strategy is no longer the main blocker; presentation quality is.
- Work must sequence content fixes, deterministic proof, measured QA, plugin-assisted review, and Vercel proof.
- DNS, production promotion, analytics activation, npm publish, tag, GitHub settings mutation, and public launch remain out of scope.

# Search Plan

- Review `archive://archive.mdkg-dev-preview-audit-pass-4-2026-06-24`.
- Inspect pass-3 smokes, docs generation scripts, Starlight docs structure, and mdkg-dev design files.
- Re-ground Product Design and Creative Production expectations before review tasks.
- Confirm Browser/Chrome/Vercel proof paths from previous goal evidence.

# Findings

- Pending implementation run.

# Options And Tradeoffs

- Structural docs/DX fixes first: preferred because Product Design and Creative Production review should evaluate near-final content.
- Review first: faster feedback, but risks reviewing stale scaffolding and creating churn.

# Recommendation

Start with `task-535`, then move through command validation, docs structure, homepage/demo/reference work, measured QA, plugin review, Browser/Chrome E2E, Vercel proof, and closeout.

# Follow-Up Nodes To Create

- Existing scoped nodes are `task-535` through `task-548` and `test-259` through `test-268`.

# Skill Candidates

- Consider a reusable mdkg.dev launch-QA skill after pass-4 proves the Browser/Chrome/Vercel/Product Design/Creative Production sequence.

# Data Structures And Algorithms Notes

- Command-example validation should model examples as records with source path, command text, validation mode, and placeholder policy.

# UX Notes

- The homepage and docs should become less dense, more intent-routed, and more copy/paste friendly.

# Security Notes

- Do not store or display raw secrets, tokens, prompts, provider payloads, or private runtime payloads in docs, checkpoints, screenshots, or handoffs.

# mdkg.dev Launch Implications

- Deterministic demo proof and measured QA are prerequisites before cold public launch traffic.

# Evidence And Sources

- `archive://archive.mdkg-dev-preview-audit-pass-4-2026-06-24`
