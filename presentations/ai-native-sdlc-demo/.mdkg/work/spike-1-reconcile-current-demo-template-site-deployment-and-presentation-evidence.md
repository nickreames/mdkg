---
id: spike-1
type: spike
title: Reconcile current demo template site deployment and presentation evidence
status: done
priority: 1
epic: epic-1
parent: goal-1
next: task-1
tags: [ai-native-sdlc, presentation-demo, phase-1, step-1]
owners: [program-orchestrator]
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-1, epic-1, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6]
context_refs: [goal-1, epic-1, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6]
evidence_refs: []
aliases: [phase-1-step-1]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-26
---

# Research Question

What evidence, options, tradeoffs, and recommendation are required to reconcile current demo template site deployment and presentation evidence under Goal 1?

# Context and Constraints

- Reconcile the live repository and template facts without mutating product surfaces.
- Keep all authoring inside the nested graph except the explicitly deferred root handoff.
- Prove exactly eight goals, no loops, one active authoring goal, and deterministic routing.
- Record the private bundle, root projection, Remotion placeholder, and closeout gates.
- Do not create deck content, run graphs, source changes, Git history, or provider state.
- This is step 1 of 8; do not perform successor implementation while researching.

# Search Plan

- Read goal-1, epic-1, prd-1, edd-1, and dec-1 through dec-6.
- Inspect the current owning graph, source, Git, artifacts, and runtime receipts named by the goal.
- Prefer primary sources and current command output over prior summaries.
- Record contradictory evidence and ownership gaps instead of guessing.

# Findings

- The canonical template currently permits Astro plus React Islands, while the accepted demo specialization requires static Astro and zero generated client JavaScript.
- mdkg.dev currently stores Demo 1 in a monolithic demoSnapshots data module and uses one hard-coded output route, so Goal 2 must introduce per-demo records, visibility fields, source-versus-specialized evidence, and static output components.
- Existing public routes already establish the /demo/N/ and /demo/N/output/ shape; Demo 2 and Demo 3 should extend that model rather than create subdomains.
- In-repository graph projections use explicit private bundles without source_path; subgraph sync is for clean child Git repositories.
- The root checkout has an active Goal 78 writer, but the new presentations/ai-native-sdlc-demo directory is a disjoint nested graph writer lane. Root registration and root Remotion nodes remain integration-owner work.
- The current repository has no Remotion dependency; the accepted program keeps it optional and non-blocking.
- The nested graph allocated prd-1, edd-1, dec-1 through dec-6, goal-1 through goal-8, epic-1 through epic-8, five spikes, forty-six tasks, and twenty-four tests.
- Nested validation passes with zero warnings and errors; all eight goals route to their intended first node with no warnings; no authored loop exists; all seventy-five actionable prev/next links are symmetric.
- The private program bundle verifies with source tree hash sha256:5ba8de12dcf3e64d6f810f922ab063279d67bacf0ffbbd8a9fd75106c0e5da2d and zip SHA-256 sha256:cfa824a1e102e4917d1e74feb408f2ce1b24ec75d21c524b3e0e007e90706cc8.

# Recommendation

Proceed with the accepted eight-goal, no-loop program. Keep presentation and run work in this nested graph, use explicit private root projection, preserve the conservative source template, specialize authority only in Demo 2 and Demo 3, and serialize root registration and Remotion placeholders through the root integration owner.

# Options And Tradeoffs

- Dedicated worktree versus graph-only lane: graph-only is selected; it reduces path conflicts but still requires serialized root Git and mdkg mutations.
- Root-register every run versus one program projection: register only the program; keep Demo 2 and Demo 3 as owned writable artifacts.
- React Islands versus static Astro: specialize the event demos to static Astro and zero JavaScript while preserving the reusable source's broader default.
- Live-only versus rehearsal plus fallback: use Demo 2 production rehearsal and immutable fallback before Demo 3.

# Follow-Up Nodes To Create

- Continue to task-1 only after this spike records a supported recommendation.

# Skill Candidates

- Record a candidate only if execution reveals a genuinely reusable workflow gap.

# Security and Public-Safety Notes

- Retain no raw prompts, credentials, tokens, cookies, provider payloads, or unrelated private context.

# Evidence and Sources

- Current source: examples/website-demo-template/.mdkg/, examples/website-demo-template/DEMO_HANDOFF_PROMPT.md, and mdkg-dev/src/data/demoSnapshots.ts.
- Current routes: mdkg-dev/src/pages/demo/[id].astro and mdkg-dev/src/pages/demo/[id]/output.astro.
- Program design: prd-1, edd-1, and dec-1 through dec-6.
- Validation: nested index, validate, goal next for goals 1–8, no-loop inventory, chain invariant probe, and concise pack dry run.
- Bundle: ../../.mdkg/bundles/private/presentations/ai-native-sdlc-demo.mdkg.zip.
