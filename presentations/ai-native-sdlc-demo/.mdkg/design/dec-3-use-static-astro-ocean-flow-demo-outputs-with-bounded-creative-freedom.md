---
id: dec-3
type: dec
title: Use static Astro Ocean Flow demo outputs with bounded creative freedom
status: accepted
tags: [astro, ocean-flow, static, accessibility, demo]
owners: [program-orchestrator]
links: []
artifacts: []
relates: []
refs: [prd-1, edd-1]
aliases: [static-ocean-flow-demo-contract]
created: 2026-07-26
updated: 2026-07-26
---

# Context

The reusable template permits React Islands, while this live-demo contract requires deterministic static output and zero generated client JavaScript. The coding agent still needs meaningful creative latitude.

# Decision

Specialized Demo 2, Demo 3, and Demo 4 outputs use static Astro with no client
directives, generated client JavaScript, third-party runtime scripts, remote
fonts, forms, trackers, or analytics.

Keep Ocean Flow colors, source-backed claims, semantic HTML, keyboard access, reduced motion, responsive reflow, WCAG AA contrast, a 500 KiB initial-transfer budget, and a 250 KiB raster limit.

Require a clear promise, context problem, Plan -> Work -> Evidence, what/why/next, inspectable proof, and quickstart/feedback CTA. Allow the agent to choose composition, metaphor, order, typography, imagery, and bounded marketing copy.

For the timed runs, the agent produces one portable `DemoOutput.astro`; a thin
run-local wrapper and hash-bound canonical registration consume that component.
The live path may not add dependencies, fetch remote assets, perform web
research, or generate images.

# Alternatives Considered

- React Islands: rejected for these runs because it weakens zero-JavaScript proof.
- One hard-coded layout: rejected because it prevents differentiated runs.
- Unbounded stack choice: rejected because it adds event risk.

# Consequences

Goal 2 creates a per-demo static output registry and built-artifact tests. The source template can retain broader reuse while each run records its stricter specialization.

# Links / references

- prd-1
- edd-1
