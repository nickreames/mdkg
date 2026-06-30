---
id: spike-24
type: spike
title: research embedded workspace viewer options and bundle tradeoffs
status: blocked
priority: 3
epic: epic-207
parent: goal-47
tags: [demo, viewer, research, bundle, performance]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [test-325, test-329]
blocks: [task-627, test-328]
refs: [edd-61, goal-44]
context_refs: []
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-06-29
updated: 2026-06-29
---
# Research Question

What is the smallest embedded workspace viewer that helps readers understand an
accepted mdkg demo without harming homepage/docs performance or exposing
private files?

# Context And Constraints

- Do not start before `goal-44` proves the read-only `/demo/1` explorer and
  homepage isolation contract.
- Compare static code panes, Monaco, Sandpack, WebContainer-style approaches,
  and Astro-friendly lazy islands.
- Treat bundle weight, mobile usability, accessibility, public-safety, and
  implementation complexity as first-class criteria.

# Search Plan

- Inspect the accepted `/demo/1` source proof and its snapshot data model.
- Review the mdkg-dev build output and current frontend dependencies.
- Research candidate editor/workspace libraries only if existing code does not
  already provide a suitable static viewer.

# Findings

Pending.

# Options And Tradeoffs

Pending.

# Recommendation

Pending. Default bias is a static/read-only viewer unless a heavier embedded
workspace provides clear value and can be lazy-loaded safely.

# Follow-Up Nodes To Create

- Update `task-627` or split it if the chosen viewer requires staged
  implementation.
- Add a product-design or accessibility test if the workspace introduces new
  interaction complexity.

# Skill Candidates

- `browser:control-in-app-browser`
- `chrome:control-chrome`
- `product-design:audit` if interaction density becomes high.

# Data Structures And Algorithms Notes

- Prefer static data and deterministic snapshots over live filesystem reads.

# UX Notes

- Preserve the three-surface relationship: graph, files, output.

# Security Notes

- Never expose raw prompts, tokens, cookies, Vercel payloads, or arbitrary local
  paths.

# mdkg.dev Launch Implications

- Do not block `/demo/1` publication on embedded workspace research.

# Evidence And Sources

- `goal-44`
- `edd-61`
