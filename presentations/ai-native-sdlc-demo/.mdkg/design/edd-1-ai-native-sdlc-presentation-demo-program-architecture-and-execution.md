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

One writable nested graph coordinates the presentation, rehearsal, live demo, and adoption. The parent consumes one private read-only bundle. Demo 2 and Demo 3 are owned run graphs inside this directory and are not separately root-registered.

# Architecture

- Program root: presentations/ai-native-sdlc-demo/.
- Writable graph: presentations/ai-native-sdlc-demo/.mdkg/.
- Deck: deck/.
- Rehearsal graph: runs/demo-002/.mdkg/, created by Goal 4.
- Event graph: runs/demo-003/.mdkg/, created by Goal 6.
- Root alias: ai_native_sdlc_demo.
- Root bundle: .mdkg/bundles/private/presentations/ai-native-sdlc-demo.mdkg.zip.
- Root registration is private, read-only, has no source_path, and uses an 86,400-second freshness threshold.
- Goals 1–8 are the only program lifecycle; no loop coordinates the work.
- Root Remotion research and implementation remain optional independent lanes.

# Data Model

- Program design: PRD, EDD, six decisions, eight goals, phase epics, action nodes, and checkpoints.
- Claim row: era, source, publication date, exact support, approved paraphrase, confidence, and slide usage.
- Deck release: source, assets, notes, citations, PPTX, contact sheet, and QA report.
- Demo run: source hash, fork receipt, specialized design and goal, work chain, checkpoint, and sanitized export.
- Demo 3 child chain: positioning spike -> implementation task -> local test -> integration task -> canonical-site test -> publish task -> exact-SHA/live-URL test -> accepted checkpoint.
- Demo record: id, listed, noindex, sourceGoal, executedGoal, output component, validation, safety, and evidence.
- Publication receipt: allowed paths, baseline/final SHA, divergence, commit/push, both deployment identities, exact-SHA match, routes, and forbidden actions not taken.
- Publication authority receipt: human approval, exact push range and
  allowlist hashes, validity window, owner, authorized/forbidden actions, and
  invalidation rules.
- Source/prompt refinement receipt: Demo 2 evidence inputs, accepted changes
  or accepted no-change result, before/after source and sendoff hashes,
  deterministic bootstrap proof, and the source identity used to fork Demo 3.
- Discovery receipt: read-only audit scope, owning graph/artifact paths, source inventory, and mutation recommendation.
- Writer lease: goal, shared-source writer, root integration owner, exact path/operation allowlist, read-only evidence paths, forbidden paths, clean base commit, dirty/staged inventory hash, quiet-window start/expiry, invalidation rules, and release condition.
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
- Goal 6 freezes a separate human-accepted event-authority receipt. It grants
  the exact live actions named by the sendoff and allowlist before the event,
  so the running agent does not pause for another approval inside the frozen
  scope.

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

# Failure Modes

- Concurrent root mutation: stop root integration and continue only isolated nested work.
- Stale or invalid bundle: rebuild explicitly and verify before root use.
- Origin drift: stop publication; never force or absorb unrelated work.
- Provider or credential failure: record a hard blocker and use Demo 2.
- Unapproved Demo 2 publication or missing Demo 3 event pre-authorization:
  stop before the corresponding commit, push, or provider workflow.
- Partial live output: do not reveal or claim Demo 3 success.
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
- Goal 6: evidence-backed final deck polish, Demo 2 source/prompt evaluation,
  accepted template/sendoff refinement, deterministic fresh-bootstrap proof,
  unexecuted Demo 3 readiness, event pre-authorization, provider preflight,
  and a no-side-effect dry run.
- Goal 7: child completion, canonical gates, exact SHA, URLs, fallback honesty, and event receipt.
- Goal 8: decision provenance, claims, SEO/LLM, accessibility, and new publication authority.

# Rollout Plan

Execute Goal 1 through Goal 8 in order. Every successor begins paused and activates only after its predecessor checkpoint and authority gate. Refresh the root projection only during serialized root milestones and immediately before rehearsal or reveal.
