---
id: task-47
type: task
title: Author the canonical fork-ready source and run-binding contract
status: done
priority: 1
epic: epic-6
parent: goal-6
prev: spike-6
next: test-25
tags: [ai-native-sdlc, presentation-demo, phase-6, step-2, source-prompt-refinement]
owners: [shared-source-writer]
links: []
artifacts: [artifacts/demo-003/source-prompt-enhancement-receipt.json, artifacts/demo-003/live-sendoff-v2.md, artifacts/demo-platform/timed-run-contract.json, artifacts/demo-platform/source-release-manifest.json, artifacts/demo-platform/run-binding.schema.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-6, epic-6, prd-1, edd-1, dec-3, dec-5, spike-6, task-10]
context_refs: [goal-6, epic-6, prd-1, edd-1, dec-3, dec-5, spike-6, task-10, chk-17]
evidence_refs: [spike-6, chk-17]
aliases: [phase-6-step-2, phase-6-source-prompt-refinement]
skills: [select-work-and-ground-context, build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-27
updated: 2026-07-28
---
# Overview

Apply only the reusable source, operator, binding-schema, bootstrap, or live
sendoff refinements explicitly accepted from spike-6. Produce a semantic
source release that future runs can fork without manual graph edits.

# Acceptance Criteria

- Require an accepted spike-6 recommendation naming exact paths, operations,
  base hashes, owner, reason, expected result, and tests. No user acceptance
  means no mutation.
- Acquire a bounded shared-source lease. Permitted future surfaces are only
  accepted rows under `examples/website-demo-template/**`,
  `scripts/bootstrap-website-demo-run.js`,
  `scripts/smoke-demo-graph.js`, and versioned program-local
  demo-platform/sendoff contract artifacts. Any additional path requires a new
  decision.
- Preserve static Astro, zero client JavaScript, Ocean Flow, public safety,
  accessibility, budgets, mdkg product/CTA identity, stable local IDs, and the
  complete local-to-production child chain.
- Make the complete generic chain authored source: positioning spike ->
  implementation task -> local test -> integration task -> canonical-site test
  -> authority-gated publish task -> exact-SHA/live-URL test -> accepted
  checkpoint. Publication exists as topology but remains disabled and
  caller-owned without external authority.
- Keep source prose state-neutral. Require closure consistency between node
  status, result body, artifacts, checkpoint edge, and goal evidence.
- Preserve the normative continue-until behavior and make the separate
  pre-authorized live authority explicit. Do not weaken hard blockers,
  global deadlines, repair bounds, exact-SHA proof, or fallback honesty.
- Where accepted, make one run-local sendoff authoritative; use explicit
  run-root or `--root` commands; require claim/start/update/done/evaluate
  lifecycle completion; materialize `.gitignore`; resolve warm dependencies in
  one attempt without installation; generate one portable
  `DemoOutput.astro` plus a thin wrapper; use deterministic artifact/receipt
  paths; preserve an active-cursor invariant and state-neutral lifecycle copy;
  and serialize tests that share build output.
- Materialize README and `.gitignore` through the operator inventory and prove
  transient `.mdkg/pack/`, state, index, SQLite, and event outputs cannot enter
  the authored source identity or publication inventory.
- Write `artifacts/demo-platform/source-release-manifest.json` over authored
  graph, operator, skill, README, and ignore inputs. Exclude generated indexes,
  SQLite, events, packs, runtime state, receipts, and run checkpoints.
- Write `artifacts/demo-platform/run-binding.schema.json`. Required fields
  include schema/materializer version, semantic source release, run ID, target
  root, detail/output routes, component key, bounded positioning brief,
  designated harness, timing-profile reference, output/receipt destinations,
  and immutable/runtime-mutable field classes. Forbid credentials, provider
  payloads, human approval, leases, origin state, or self-issued authority.
- Extend only the program-local bootstrap so accepted source plus binding
  creates an absent-target child, copies deterministic operator files, emits
  a child-interface manifest and materialization receipt, validates routing
  and packs, and supports verify-only repeat. Do not add or change a public
  mdkg CLI/package API.
- The bootstrap may not activate work, publish, grant authority, or rewrite
  authored goal/design/work content after the exact fork. Run identity remains
  in the immutable binding; the first positioning node later records a
  decision artifact.
- Write `artifacts/demo-platform/timed-run-contract.json` with `P0`, immutable
  sendoff-invocation `T0`, the P0+00:45 dispatch and T+00:45 acknowledgement
  bounds, stage deadlines, two pre-publication repairs, one production repair,
  T+24 production-repair cutoff, T+29:15 receipt, T+29:30 selection gate,
  T+30 global stop, and required per-stage telemetry.
- If the accepted recommendation is no change, write a no-change receipt with
  verified current hashes; do not create cosmetic churn.
- Write `source-prompt-enhancement-receipt.json` with evidence inputs,
  acceptance, exact changed paths, before/after hashes, updated source and
  semantic manifest identity, binding schema and bootstrap identity, sendoff
  bytes/hash, validation, warnings, and handoff to test-25.

# Files Affected

- Only exact rows accepted after spike-6 from the bounded surfaces above.
- Program-local receipt and versioned sendoff artifact.
- No `mdkg-dev/**`, `src/**`, `tests/**`, `docs/**`, packages, lockfiles,
  deployment configuration, run graph, Git history, or provider surface.

# Implementation Notes

- Use the shared-source writer only after the program writer yields.
- Do not fork Demo 3 or retain a temporary verification run in this node.
- Do not import Demo 2 positioning, navigation-chart design, routes, copy,
  runtime statuses, evidence, SHAs, deployments, screenshots, or checkpoints.

# Test Plan

- Run syntax and targeted graph/bootstrap checks appropriate to changed rows.
- Require nested source validation, complete-chain routing, semantic
  manifest/source consistency, binding-schema validation, and authority
  leakage checks.
- Defer the clean absent-target and pack proof to test-25.

# Results / Evidence

- Authored semantic source release `website-demo-source-v2` with the complete
  generic seven-node chain and accepted source checkpoint `chk-3`.
- Added immutable run-binding, timed-run, operator materialization, child
  interface/seal, and caller-owned authority boundaries without changing the
  mdkg CLI or package API.
- The final targeted smoke passed two materially distinct zero-edit fixtures,
  verify-only repeat, negative tamper classification, complete packs, and
  cleanup after two bounded fix-forward corrections.
- Exact approval, before/after hashes, changed paths, release identities,
  validation, attempts, and the Test 25 handoff are recorded in
  `artifacts/demo-003/source-prompt-enhancement-receipt.json`.
- No Demo 3 run was created and no network, provider, push, or publication
  action occurred.

# Links / Artifacts

- spike-6
- artifacts/demo-003/source-prompt-evaluation.md
- artifacts/demo-003/historical-timing-analysis.json
- task-10
- artifacts/demo-003/source-prompt-enhancement-receipt.json
- artifacts/demo-platform/timed-run-contract.json
