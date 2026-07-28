---
id: spike-1
type: spike
title: Finalize the Demo 2 durable-continuity page direction
status: done
priority: 1
epic: epic-1
parent: goal-1
next: task-1
tags: [demo, demo-002, website, strategy, durable-continuity]
owners: [demo-002-agent]
links: []
artifacts: [artifacts/creative-direction.md]
relates: [task-1, test-1, task-2, test-2, task-3, test-3, prd-2, dec-1, dec-2, edd-1]
blocked_by: []
blocks: [task-1]
refs: [goal-1, prd-2, edd-1, dec-1, dec-2, chk-2]
context_refs: [goal-1, prd-2, edd-1, dec-1, dec-2, chk-2]
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-06-29
updated: 2026-07-27
---
# Research Question

How should the accepted “Keep the plan when the agent changes” position become
a complete light-mode Ocean Flow landing page that proves durable
source-to-execution continuity without overclaiming mdkg?

# Context And Constraints

- Start from the specialized `goal-1`, retained source snapshot, and accepted
  program positioning brief.
- Keep the product as mdkg public alpha and pre-v1.
- Keep the quickstart and GitHub Issues feedback CTAs.
- Use static Astro with zero client-side JavaScript for the eventual
  implementation.
- Use the navigation-chart metaphor, Plan -> Work -> Evidence, reusable versus
  specialized `goal-1`, and what completed, why, and what comes next.
- Do not store secrets, raw prompt transcripts, provider payloads, credentials,
  or private repo context.
- Do not stage, commit, push, inspect deployments, or imply publication.

# Search Plan

- Inspect the retained source goal, specialized goal, program positioning
  brief, activation receipt, `DESIGN.md`, `prd-2`, `dec-1`, `dec-2`, and
  `edd-1`.
- Resolve page hierarchy, proof model, responsive behavior, palette roles,
  CSS-only motion, copy boundaries, and validation risks.
- Record audience, offer, page structure, visual territory, CSS-only motion,
  static proof concepts, asset plan, source-backed content facts, explicit
  non-goals, and risks for `test-1`.

# Findings

The accepted durable-continuity position translates cleanly into a navigation
chart: the page begins with the handoff problem, plots Plan -> Work -> Evidence,
then proves continuity through same-ID source and specialized goal cards. The
light-mode Ocean Flow system can be implemented entirely with semantic HTML and
CSS. No raster or remote asset is needed.

# Options And Tradeoffs

- A terminal-led page would feel familiar to developers but repeat Demo 1's
  product-engineering visual language.
- A governance dashboard would over-index on enterprise controls.
- The selected navigation chart is distinct, explains continuity visually, and
  stays legible as a linear mobile route.

# Recommendation

Build the six-section navigation-chart direction recorded in
`artifacts/creative-direction.md`. Keep evidence cards concise, use no runtime
assets, and state the local-only next step explicitly.

# Follow-Up Nodes To Create

- Complete `task-1` using the accepted compact direction.

# Skill Candidates

- `select-work-and-ground-context`
- `verify-close-and-checkpoint`
- `creative-production:explore`

# Data Structures And Algorithms Notes

Render static arrays for the three lifecycle stages and the source/specialized
goal comparison. No client state or runtime algorithm is required.

# UX Notes

Use semantic landmarks, a skip link, visible focus, high-contrast ink, a
single-column mobile flow, and reduced-motion overrides.

# Security Notes

Never retain secrets, raw prompts, provider payloads, or private context in the
template graph, generated website, or checkpoints.

# mdkg.dev implications

Goal 4 owns local canonical integration. Goal 5 separately owns publication.

# Evidence And Sources

- `artifacts/creative-direction.md`
- `goal-1`
- `prd-2`
- `edd-1`
- `dec-1`
- `dec-2`
