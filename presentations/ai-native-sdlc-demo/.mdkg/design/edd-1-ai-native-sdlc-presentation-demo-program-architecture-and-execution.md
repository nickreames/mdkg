---
id: edd-1
type: edd
title: AI-native SDLC presentation demo program architecture and execution
tags: [architecture, presentation, live-demo, subgraph, authority]
owners: [program-orchestrator]
links: [https://mdkg.dev/, https://docs.mdkg.dev/]
artifacts: [artifact://ai-native-sdlc-demo/private-bundle, artifact://ai-native-sdlc-demo/root-registration]
relates: []
refs: [prd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6]
aliases: [ai-native-sdlc-program-architecture]
created: 2026-07-26
updated: 2026-07-26
---

# Overview

One writable nested graph coordinates the presentation, production fallback,
timed dress rehearsal, fresh live demo, and adoption. The parent consumes one
private read-only bundle. Demo 2, Demo 3, and Demo 4 are owned run graphs inside
this directory and are not separately root-registered.

# Architecture

- Program root: presentations/ai-native-sdlc-demo/.
- Writable graph: presentations/ai-native-sdlc-demo/.mdkg/.
- Deck: deck/.
- Golden fallback graph: runs/demo-002/.mdkg/, created by Goal 4.
- Timed dress-rehearsal graph: runs/demo-003/.mdkg/, created by Goal 6.
- Fresh live-event graph: runs/demo-004/.mdkg/, created by Goal 9.
- Root alias: ai_native_sdlc_demo.
- Root bundle: .mdkg/bundles/private/presentations/ai-native-sdlc-demo.mdkg.zip.
- Root registration is private, read-only, has no source_path, and uses an 86,400-second freshness threshold.
- Goals 1–10 form the program lifecycle; no loop coordinates the work.
- Root Remotion research and implementation remain optional independent lanes.

# Data Model

- Program design: PRD, EDD, six decisions, ten goals, phase epics, action nodes, and checkpoints.
- Claim row: era, source, publication date, exact support, approved paraphrase, confidence, and slide usage.
- Deck release: source, assets, notes, citations, PPTX, contact sheet, and QA report.
- Demo run: source hash, fork receipt, specialized design and goal, work chain, checkpoint, and sanitized export.
- Demo 3 and Demo 4 child chain: positioning spike -> implementation task ->
  local test -> integration task -> canonical-site test -> publish task ->
  exact-SHA/live-URL test -> accepted checkpoint.
- Demo record: id, listed, noindex, sourceGoal, executedGoal, output component, validation, safety, and evidence.
- Publication receipt: allowed paths, baseline/final SHA, divergence, commit/push, both deployment identities, exact-SHA match, routes, and forbidden actions not taken.
- Prospective publication authority: human approval, exact published
  preparation manifest/tree, clean pre-publication origin,
  sendoff/allowlist/policy hashes, validity window,
  designated harness and owners, linear-descendant rule, commit/repair limits,
  activation rule, authorized/forbidden actions, and invalidation rules. The
  actual published baseline SHA is bound in an activation receipt after the
  baseline push; the actual event range and stable range hash are calculated
  immediately before the later event push.
- Source/prompt refinement receipt: Demo 2 evidence inputs, accepted changes
  or accepted no-change result, before/after source and sendoff hashes,
  deterministic bootstrap proof, and the source identity used to fork Demo 3.
- Discovery receipt: read-only audit scope, owning graph/artifact paths, source inventory, and mutation recommendation.
- Writer lease: goal, shared-source writer, root integration owner, exact path/operation allowlist, read-only evidence paths, forbidden paths, clean base commit, dirty/staged inventory hash, quiet-window start/expiry, invalidation rules, and release condition.
- Timing ledger: stage, `started_at`, `completed_at`, `duration_ms`,
  `attempt_count`, retry classification, `external_wait_ms`, intervention
  count, blocker, and fallback selection.
- Adoption record: separate demo retention decisions and separately accepted canonical ideas.

# APIs / interfaces

- Nested planning uses this directory as the mdkg root.
- Source and run graphs are inspected through their own explicit roots.
- Root reads the program through `ai_native_sdlc_demo:<local-id>`, for example `ai_native_sdlc_demo:goal-1`.
- Public routes are /demo/N/ and /demo/N/output/.
- Goal 2 adds listed, noindex, sourceGoal, executedGoal, evidence, and static output component fields.
- Vercel is observed for existing deployments only; production delivery is caused by an approved non-force Git push.
- No mdkg CLI, package API, or external schema change belongs to this program.
- The event sendoff is a frozen interface: it requires continuation until child achievement, approved push, exact-SHA deployment readiness, and public-route verification, and it permits stopping only for an enumerated hard blocker.
- Goal 6 freezes Demo 3's prospective authority policy and a
  baseline-publication handoff. Goal 7 publishes that preparation baseline
  before `T0`, activates authority only after base/origin equality is proven,
  and runs one designated harness.
- Goal 9 repeats that preparation boundary for fresh Demo 4 after Demo 3
  findings and human-approved final polish. Goal 10 executes it.

# Writer Topology

- Program writer: this directory and nested mdkg commands.
- Root integration owner: root config, bundle, root graph, Git index, commits, and pushes.
- Shared-source writer: only paths frozen by its active phase.
- Goal 2 discovery may run `spike-2` before a shared-source lease because it is read-only outside this program directory.
- Goal 2 mutation cannot begin at `task-5` until the integration owner accepts the spike recommendation and `artifacts/demo-platform/goal-2-activation-receipt.json`.
- The program orchestrator yields after spike-2; one shared-source writer then owns the receipt's exact source paths plus the minimum nested task/evidence/index paths through test-6, and yields before root integration.
- `examples/demo-runs/demo-001/**` is historical read-only evidence; canonical `/demo/1/` and `/demo/1/output/` are the regression surfaces.
- Root and source mutations require an exclusive integration window.
- Run graphs remain artifacts and never become writable root projections.
- Timed execution has one designated child writer and one root integration
  owner with non-overlapping leases. Mirrored Codex/Claude files do not create
  a multi-harness claim.

# Failure Modes

- Concurrent root mutation: stop root integration and continue only isolated nested work.
- Stale or invalid bundle: rebuild explicitly and verify before root use.
- Origin drift: stop publication; never force or absorb unrelated work.
- Provider or credential failure: record a hard blocker and use Demo 2.
- Unapproved publication or missing Demo 3/Demo 4 authority:
  stop before the corresponding commit, push, or provider workflow.
- Partial timed output: select sealed Demo 2 and do not claim the timed run
  succeeded.
- Deadline overrun: T+24 prevents a new production repair, T+29:15 closes
  receipt consolidation, T+29:30 closes the independent reveal-selection
  gate, and T+30 stops live actions regardless of remaining retries.
- Unsupported claim: remove or hold it.
- JavaScript, accessibility, secret, or asset-budget failure: fail acceptance.
- Run confusion: always record owning root and source hash.

# Observability

- Nested validate, index, goal next/evaluate, pack stats, and checkpoints.
- Hashes for source graph, run output, deck, bundle, and fallback.
- Git baseline, divergence, staged paths, commits, and pushes.
- Exact-SHA READY evidence for both production projects.
- Desktop/mobile route, accessibility, noindex, zero-JS, and page-weight evidence.
- Timed rehearsal and reveal decision receipts.

# Security / Privacy

- Store no credentials, tokens, cookies, raw prompts, provider payloads, or unrelated private content.
- Public pages consume explicit sanitized exports only.
- Bundles stay private and demos stay noindex/unlisted until adoption.
- Provider observation and provider mutation remain distinct.

# Testing Strategy

- Goal 1: graph shape, references, routing, no loops, pack, bundle, and projection.
- Goal 2: read-only drift inventory; accepted mutation receipt; static build, routes, sitemap, zero JS, accessibility, budgets, claims, secrets, executable fork/operator bootstrap, and context-complete fresh-agent packs.
- Goal 3: primary sources, rendered QA, notes, and timing.
- Goal 4: child local segment completion, local integration, publication-gate
  pause, and fallback capture.
- Goal 5: reconcile the canonical Demo 2 smoke contract; create bounded local
  commits; freeze and separately approve the actual fetched push range; then
  complete the child publication, exact-SHA deployments, routes, rehearsal,
  and immutable fallback.
- Goal 6: Demo 2 timing/prompt evaluation, accepted source/sendoff refinement,
  deterministic fresh-bootstrap proof, pre-test deck baseline, unexecuted
  Demo 3 readiness, single-harness timing/authority contracts, provider
  preflight, and a no-side-effect dry run.
- Goal 7: root-integration-owned pre-clock baseline publication, timed Demo 3
  rehearsal, T+29:15 receipt and T+29:30 selection gate, exact SHA/URLs,
  measured stage ledger, fallback honesty, then post-reveal evidence hardening.
- Goal 9: Demo 3 evaluation, accepted final deck/source/sendoff polish,
  unexecuted fresh Demo 4, authority, fallback, and dry rehearsal.
- Goal 10: root-integration-owned pre-clock baseline publication, fresh Demo 4
  live run, T+29:15 receipt and T+29:30 selection gate, exact SHA/URLs,
  fallback honesty, and post-reveal closeout.
- Goal 8: post-event decision provenance, claims, SEO/LLM, accessibility, and
  new publication authority.

# Rollout Plan

Execute `Goal 1 -> Goal 2 -> Goal 3 -> Goal 4 -> Goal 5 -> Goal 6 -> Goal 7
-> Goal 9 -> Goal 10 -> Goal 8`. Every successor begins paused and activates
only after its predecessor checkpoint and authority gate. Refresh the root
projection only during serialized root milestones and immediately before a
rehearsal or reveal.
