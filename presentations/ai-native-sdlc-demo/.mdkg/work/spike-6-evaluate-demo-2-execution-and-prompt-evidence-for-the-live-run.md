---
id: spike-6
type: spike
title: Classify Demo 2 evidence for a fork-ready source release
status: done
priority: 1
epic: epic-6
parent: goal-6
next: task-47
tags: [ai-native-sdlc, presentation-demo, phase-6, step-1, fork-ready-source]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-003/source-prompt-evaluation.md, artifacts/demo-003/historical-timing-analysis.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-6, epic-6, prd-1, edd-1, dec-3, dec-5, goal-2, chk-4, goal-4, chk-14, goal-5, chk-17, test-12, test-13, test-14]
context_refs: [goal-6, epic-6, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, goal-2, chk-4, goal-4, chk-14, goal-5, chk-17, test-12, test-13, test-14, chk-18, chk-19]
evidence_refs: [chk-14, chk-17, test-12, test-13, test-14, chk-18, chk-19]
aliases: [phase-6-step-1, phase-6-source-prompt-evaluation]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-27
updated: 2026-07-27
---
# Research Question

What did Demo 2 prove or expose about deterministic forking, fresh-agent
context, positioning latitude, the source template, the sendoff prompt,
authority handoffs, failure recovery, and audience-facing evidence, and which
changes belong in a reusable source release before the timed Demo 3 dress
rehearsal?

# Context And Constraints

- Consume only accepted Demo 2 child, candidate, publication, deployment,
  route, rehearsal, fallback, and prompt observations.
- Separate source-template defects, sendoff/prompt defects, operator or pack
  defects, site-adapter defects, execution variance, and presentation-only
  findings.
- Classify every observed delta as reusable authored source, immutable
  run-binding input, child-local runtime state/evidence, external authority, or
  rejected Demo-2-specific creative direction.
- Keep mdkg CLI/package APIs, canonical-site adoption, docs, and deployment
  configuration out of this refinement lane.
- A no-change recommendation is valid when the accepted evidence supports it.
- task-47 cannot begin until the user explicitly accepts the recommendation
  and exact future mutation allowlist.
- Treat Demo 2 as durable, resumable multi-stage execution evidence, not proof
  of uninterrupted eight-hour autonomy or harness equivalence.
- The rehearsal must complete with one designated harness in approximately
  30 minutes; rank latency reductions by their contribution to that bound.

# Search Plan

- Compare the canonical source `goal-1`, Demo 2 specialized/executed `goal-1`,
  bootstrap receipts, pack inventories, child node timing, all fix-forward or
  blocker evidence, and Goal 5 rehearsal notes.
- Inspect the current source template, operator manifest, specialization
  contract, and normative live sendoff at their recorded hashes.
- Test the proposed prompt against the hard requirement to continue through
  push, exact-SHA READY deployments, and live URLs without mid-run approval.
- Write `historical-timing-analysis.json` with the observed Demo 2 stages,
  including approximately 0:30 positioning, 11:32 implementation, 0:43 local
  validation, 10:03 canonical integration, 0:47 canonical validation, 24:22
  child-to-canonical wall time, 7:35 commit preparation, 2:29 deployment
  readiness, 15:06 comprehensive production-route verification, and 51:44
  comparable serialized execution excluding human approval.
- Rank root-safe sendoff, warm one-attempt dependency resolution,
  `.gitignore` materialization, portable `DemoOutput.astro` plus thin wrapper,
  deterministic receipt schemas, cursor invariants, state-neutral lifecycle
  copy, serial shared-output tests, build-once validation, and a fast
  production verifier.
- Audit whether README, `.gitignore`, operator inventory, semantic source
  identity, stable chain topology, closure consistency, and explicit-root
  commands survived the Demo 2 fork.
- Identify all Demo 2 post-fork authored-node changes. Promote generic
  topology and guardrails into the source, but reject Demo 2 positioning,
  metaphor, copy, IDs, routes, SHAs, deployments, screenshots, statuses,
  events, indexes, packs, receipts, and checkpoints as source defaults.

# Findings

Demo 2 proved the static Astro, Ocean Flow, public-safety, noindex/unlisted,
source-versus-specialized, Plan → Work → Evidence, exact-SHA deployment, live
route, and golden fallback contracts. The accepted implementation produced a
30,205-byte static page with zero client JavaScript, scripts, remote fonts,
forms, trackers, and raster assets; the minimum measured text contrast was
4.66:1 and desktop/mobile overflow checks passed.

It did not prove zero-edit specialization:

- The source chain stopped after local validation. Demo 2 added integration,
  canonical validation, publication, and production verification nodes by
  rewriting the child after the fork.
- The operator manifest omitted the source root `README.md` and `.gitignore`.
  The copied prompt nevertheless instructed the agent to read `README.md`, and
  generated child packs remain untracked.
- The handoff prompt used root-ambiguous commands and encoded a local-only
  stopping point rather than a state-neutral full lifecycle.
- The bootstrap hardcoded the four-node local chain and hashed generated mdkg
  state together with authored source.
- Demo 2 required three dependency/build attempts, duplicated substantial
  integration work, and exposed a shared-dist race when smoke suites ran in
  parallel.
- Child closure evidence is inconsistent: achieved state does not uniformly
  preserve epic scope, final evidence refs, and accepted-checkpoint routing.

The evidence supports a semantic authored source release plus an immutable run
binding, not post-fork graph editing. It also supports one designated harness,
warm dependencies, one portable output component plus thin wrapper, build-once
serial validation, and a fast reveal verifier. It does not support
multi-harness equivalence or uninterrupted eight-hour execution.

The complete classification and exact proposed path/hash allowlist are in
`artifacts/demo-003/source-prompt-evaluation.md`. The timing ledger is in
`artifacts/demo-003/historical-timing-analysis.json`.

# Options And Tradeoffs

- retain unchanged: safest when Demo 2 evidence shows the contract is
  deterministic and clear.
- bounded refinement: improve only evidenced template/prompt defects while
  preserving source lineage and fixed guardrails.
- broader redesign: reject and route to a later goal if evidence implies CLI,
  package, canonical-site, or external schema changes.

# Recommendation

Accept the bounded source-release refinement in
`artifacts/demo-003/source-prompt-evaluation.md`. Promote generic topology and
guardrails into the reusable authored source, specialize immutable values
through a validated run binding, produce an authored child-contract seal, and
keep runtime evidence and external authority in their separate owners.

Preserve creative latitude through the child positioning decision rather than
a post-fork graph rewrite. Reject Demo 2 creative copy, runtime evidence,
provider identity, and event authority as source defaults.

Task 47 remains gated on explicit user acceptance of the recorded
recommendation and exact future mutation allowlist.

# Follow-Up Nodes To Create

- task-47 and test-25 already own the accepted refinement and clean-bootstrap
  proof. Create no additional node unless the evidence requires out-of-scope
  work.

# Skill Candidates

- Record only a genuinely reusable workflow gap; do not edit skills here.

# Data Structures And Algorithms Notes

- Preserve deterministic absent-target creation, stable IDs, explicit
  prev/next routing, semantic source-release hashes, immutable run-binding
  hashes, child-contract seals, and pack coverage.

# UX Notes

- Keep mdkg fixed as the product and quickstart/issues fixed as CTAs; improve
  only the agent's audience angle, promise, composition, and bounded copy
  instructions when Demo 2 evidence supports it.

# Security Notes

- Preserve public safety, exact allowlists, separate writer roles, and the
  distinction between Demo 2 publication approval and Demo 3 event authority.

# mdkg.dev Launch Implications

- No canonical mdkg.dev adoption belongs to this spike.

# Evidence And Sources

- `artifacts/demo-003/source-prompt-evaluation.md`
- `artifacts/demo-003/historical-timing-analysis.json`
- `chk-14`, `chk-17`, `test-12`, `test-13`, `test-14`, `chk-18`, and
  `chk-19`
- Demo 2 bootstrap, implementation, local execution, integration, commit,
  deployment, live-route, smoke-contract, and rehearsal receipts
- Current source graph, operator manifest, bootstrap, smoke, specialization,
  and normative live-sendoff contracts at the hashes recorded in the
  evaluation
