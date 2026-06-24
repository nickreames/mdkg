---
id: spike-19
type: spike
title: research pass-4 audit into a launch-quality docs DX QA execution model
status: done
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

- The audit sequence is correct: fix agent-readable text first, then docs TOC/outline, command-example trust, homepage density, deterministic demo proof, docs layout, user-facing reference hierarchy, measured QA, frontmatter examples, and generated-reference depth.
- The existing site/docs structure can support the pass without an architecture rewrite: `mdkg-dev/` owns the marketing and LLM text endpoints; `docs/` owns Starlight docs; scripts already cover marketing, docs, SEO, demo graph, and pass-3 polish gates.
- `task-535` proved the right pattern for pass-4 work: patch the public surface, add a focused smoke assertion that catches the audit failure, then record direct HTTP/build evidence.
- Product Design and Creative Production reviews should happen after structural docs and homepage copy are close to final; otherwise they will spend effort on issues already called out by the audit.
- Vercel proof belongs near closeout, after local Browser/Chrome QA and local gates pass, because preview deployment validation should confirm the pushed artifact rather than guide early editing.

# Options And Tradeoffs

- Structural docs/DX fixes first: preferred because Product Design and Creative Production review should evaluate near-final content.
- Review first: faster feedback, but risks reviewing stale scaffolding and creating churn.

# Recommendation

Use this execution order:

1. Complete agent-readable text and canonical path proof (`task-535`, done).
2. Fix Starlight TOC and heading-outline quality (`task-536`).
3. Add command-example validation before expanding reference/docs content (`task-537`).
4. Polish homepage density and public narrative (`task-538`).
5. Add deterministic demo/first-success proof (`task-539`).
6. Improve docs IA, responsive components, meta cleanup, examples, and generated reference (`task-540` through `task-544`).
7. Add measured a11y/perf gates before external review (`task-545`).
8. Run Product Design and Creative Production review on near-final content (`task-546`).
9. Run Browser/Chrome E2E, Vercel proof, logical commits, push, and closeout (`task-547` and `task-548`).

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
