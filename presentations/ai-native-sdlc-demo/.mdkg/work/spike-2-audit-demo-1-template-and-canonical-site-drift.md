---
id: spike-2
type: spike
title: Audit Demo 1 template and canonical site drift
status: done
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

- The reusable template is graph/operator material rather than an implemented
  site, and all execution-driving template records currently require Astro plus
  React Islands. That is the primary source-contract drift.
- Historical Demo 1 is a valid completed React-capable run with preserved IDs,
  a `client:load` island, local validation, and a public-safe receipt. It must
  remain immutable evidence rather than become the zero-JavaScript source.
- The canonical site is already static and rejects generated client
  JavaScript, but its demo interface is one monolithic Demo 1 record, one
  output composition, an unfiltered gallery, and a hard-coded sitemap entry.
- The canonical demo interface has no independent `listed`/`noindex` policy,
  source-versus-executed goal model, Plan/Work/Evidence fields, or compile-time
  output-component key.
- Claims still mark all demo graphs pending even though Demo 1 has accepted
  local proof and canonical routes; Demo 2/3 remain unexecuted and must not be
  implied.
- Existing graph, site, SEO, accessibility, and performance smokes each cover
  part of the desired outcome but do not jointly prove the Goal 2 record,
  visibility, output-component, route-level budget, or executable bootstrap
  contracts.
- `artifacts/demo-platform/drift-audit.md` contains the complete source-backed
  matrix and material options.
- `artifacts/demo-platform/proposed-source-allowlist.json` records the exact
  planned existing and new source paths, owner, operations, reasons, expected
  hashes, immutable historical paths, integration-only paths, and forbidden
  actions.

# Recommendation

Adopt static Astro with zero client directives and zero generated client
JavaScript as the canonical reusable-template contract. Keep Ocean Flow,
semantic HTML, CSS motion, section order, visual metaphor, and bounded
marketing copy open to the coding agent.

Split the canonical demo data into typed per-demo records, filter navigation by
`listed`, filter sitemap discovery by `noindex`, render source versus executed
goals plus Plan -> Work -> Evidence, and select distinct Astro output
components through a compile-time registry.

Add one manifest-driven bootstrap that forks the graph, materializes operator
files and skill projections, validates and routes the target, builds concise and
standard packs, verifies repeat equality, and fails closed on deliberate drift.

`task-5` may not start until this spike is committed, the root projection is
refreshed from that clean commit, and the root integration owner accepts the
typed mutation receipt.

# Options And Tradeoffs

- Option A, recommended: make static Astro the source template. It is the
  lowest-risk live-demo contract and aligns directly with mdkg.dev, at the cost
  of deferring client-state interaction ideas.
- Option B: retain React capability and layer a Demo 2/3 static specialization
  on top. It preserves optional interactivity but adds a second source of truth,
  more failure cases, and no material benefit for this presentation contract.

# Follow-Up Nodes To Create

- No new work nodes are required. Continue through the existing task-5 ->
  test-6 chain only after the separate mutation gate is accepted.

# Skill Candidates

- Record a candidate only if execution reveals a genuinely reusable workflow gap.

# Security and Public-Safety Notes

- Retain no raw prompts, credentials, tokens, cookies, provider payloads, or unrelated private context.

# Evidence and Sources

- `artifacts/demo-platform/drift-audit.md`
- `artifacts/demo-platform/proposed-source-allowlist.json`
- `artifacts/demo-platform/spike-2-readiness-receipt.json`
- Read-only sources: `examples/website-demo-template/**`,
  `examples/demo-runs/demo-001/**`, `mdkg-dev/CLAIMS.md`,
  `mdkg-dev/src/data/demoSnapshots.ts`, demo pages, sitemap, and the five
  declared smoke scripts.
- Discovery baseline: commit
  `0399f9dfc241a25d724cdcdf9704776dfdc10b45`, clean worktree, verified private
  projection, nested validation with 0 warnings and 0 errors.
