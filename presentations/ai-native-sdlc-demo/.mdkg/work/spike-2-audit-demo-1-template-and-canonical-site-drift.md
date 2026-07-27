---
id: spike-2
type: spike
title: Audit Demo 1 template and canonical site drift
status: todo
priority: 1
epic: epic-2
parent: goal-2
next: task-5
tags: [ai-native-sdlc, presentation-demo, phase-2, step-1]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-platform/drift-audit.md, artifacts/demo-platform/proposed-source-allowlist.json, artifacts/demo-platform/spike-2-readiness-receipt.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-2, epic-2, goal-1, chk-1, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6]
context_refs: [goal-2, epic-2, goal-1, chk-1, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6]
evidence_refs: []
aliases: [phase-2-step-1]
skills: [select-work-and-ground-context, build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-26
---

# Research Question

What evidence, options, tradeoffs, and recommendation are required to audit demo 1 template and canonical site drift under Goal 2?

# Context and Constraints

- Reconcile Demo 1 and template drift before implementation.
- Use static Astro with zero client directives and zero generated client JavaScript.
- Implement per-demo records, visibility, source-versus-specialized evidence, and static output mapping.
- Verify accessibility, noindex, claims, secrets, routes, sitemap, responsive behavior, and asset budgets.
- Keep all work local; publication is forbidden.
- Root source, Git, bundles, indexes, and provider state are read-only during this spike. Writes are limited to the nested program graph and `artifacts/demo-platform/`.
- Treat `examples/demo-runs/demo-001/**` as immutable historical evidence. Regression protection targets canonical `/demo/1/` and `/demo/1/output/`.
- This is step 1 of 10; do not perform successor implementation while researching.

# Search Plan

- Build the explicit-edge standard pack prescribed by goal-2 and confirm it contains prd-1, edd-1, dec-1 through dec-6, goal-1, and chk-1 bodies.
- Inspect `examples/website-demo-template/**` and `examples/demo-runs/demo-001/**` read-only.
- Inspect `mdkg-dev/CLAIMS.md`, `mdkg-dev/src/data/demoSnapshots.ts`, `mdkg-dev/src/pages/demos.astro`, `mdkg-dev/src/pages/demo/[id].astro`, `mdkg-dev/src/pages/demo/[id]/output.astro`, and `mdkg-dev/src/pages/sitemap.xml.ts`.
- Inspect demo-related assertions in `scripts/smoke-demo-graph.js`, `scripts/smoke-mdkg-dev.js`, `scripts/smoke-mdkg-dev-seo.js`, `scripts/smoke-mdkg-dev-a11y.js`, and `scripts/smoke-mdkg-dev-perf.js`; inspect package scripts read-only.
- Prefer primary sources and current command output over prior summaries.
- Record contradictory evidence and ownership gaps instead of guessing.

# Findings

Pending activation. Required findings:

- Current-state matrix for template contracts, historical Demo 1, canonical detail/output routes, registry, gallery, sitemap, claims, and existing smoke coverage.
- At least two viable options when a material choice remains.
- Recommended option with consequences, owner, validation, and follow-up.
- `proposed-source-allowlist.json` with exact planned existing/new paths or bounded new-path prefixes, read/write operation, owner, reason, expected base hash, and explicit forbidden/read-only paths.
- `spike-2-readiness-receipt.json` with base commit, clean/dirty/staged inventory, pack receipt, validation receipts, artifact hashes, unresolved choices, and an explicit task-5 ready/blocker decision.
- Explicit confirmation that task-5 may start only after the root integration owner accepts `goal-2-activation-receipt.json`.

# Recommendation

Pending activation and evidence collection.

# Options And Tradeoffs

- Record at least two viable options and their consequences when a material choice remains.
- Prefer the option that preserves scope, authority, evidence, and recovery.

# Follow-Up Nodes To Create

- Continue to task-5 only after this spike records a supported recommendation and the separate mutation gate is accepted.

# Skill Candidates

- Record a candidate only if execution reveals a genuinely reusable workflow gap.

# Security and Public-Safety Notes

- Retain no raw prompts, credentials, tokens, cookies, provider payloads, or unrelated private context.

# Evidence and Sources

- Pending.
