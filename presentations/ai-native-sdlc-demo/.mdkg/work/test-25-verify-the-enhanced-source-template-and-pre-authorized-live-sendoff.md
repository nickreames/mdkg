---
id: test-25
type: test
title: Verify the fork-ready source with two zero-edit fixtures
status: backlog
priority: 1
epic: epic-6
parent: goal-6
prev: task-47
next: task-27
tags: [ai-native-sdlc, presentation-demo, phase-6, step-3, source-prompt-refinement]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-003/source-prompt-verification-receipt.json, artifacts/demo-003/source-fixture-verification.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-6, epic-6, prd-1, edd-1, dec-3, dec-5, goal-2, chk-4, goal-5, chk-17, spike-6, task-47]
context_refs: [goal-6, epic-6, prd-1, edd-1, dec-3, dec-5, goal-2, chk-4, goal-5, chk-17, spike-6, task-47]
evidence_refs: [spike-6, task-47, chk-17]
aliases: [phase-6-step-3, phase-6-source-prompt-proof]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
cases: [semantic_source_release, two_distinct_bindings, exact_authored_fork, bootstrap_repeat, pack_coverage, no_authority_leakage, no_retained_run]
created: 2026-07-27
updated: 2026-07-27
---
# Overview

Prove that the accepted source release, binding schema, bootstrap, and sendoff
produce context-complete, zero-manual-edit children for materially distinct
runs before Demo 3 exists.

# Target / Scope

- task-47
- canonical website-demo source graph and operator manifest
- semantic source-release manifest, immutable binding schema, bootstrap, and
  versioned live sendoff

# Preconditions / Environment

- task-47 receipt is accepted and all source/manifest/sendoff hashes resolve.
- Use two absent temporary targets outside `runs/demo-003`; Demo 3 must remain
  absent.

# Test Cases

- Create two temporary fixture bindings with different run IDs, routes,
  component keys, and bounded positioning briefs. Both use the same source
  release and generic chain.
- Bootstrap each absent target without manually editing any authored goal,
  design, work, test, skill, or operator file. Prove preserved IDs,
  byte-identical authored graph content, zero-warning validation,
  deterministic routing, and complete concise/standard packs.
- Run verify-only repeat for both and require identical inventories, binding
  and interface hashes, zero overwritten files, and no state transition.
- Require packs to contain source goal, PRD, EDD, decisions, work/test chain,
  accepted source checkpoint, and required skills without truncation.
- Verify the selected live sendoff still requires continuation through normal
  push, exact-SHA READY deployments, live URLs, bounded fix-forward, and the
  truthful Demo 2 fallback.
- Verify the future event-authority schema can pre-authorize every in-scope
  action without granting force, provider mutation, DNS, unrelated
  integration, or out-of-scope edits.
- Prove the fresh run starts from its explicit root, has one normative sendoff,
  materializes `.gitignore`, resolves warm dependencies without installation,
  produces no untracked pack artifacts, includes all required skills/design
  context without truncation, and defines a portable output component plus
  thin wrapper.
- Prove lifecycle copy is state-neutral, the active cursor invariant is
  explicit, shared-output tests are serialized, and the prospective authority
  schema contains no invented future range hash.
- Prove the global T+30 deadline, T+24 repair cutoff, at most two
  pre-publication repairs, one production repair, and single-harness/no-
  endurance boundaries are present.
- Prove the first positioning spike is the only initial actionable node and
  records creative specialization as a decision artifact without rewriting
  authored graph content.
- Prove the semantic source release excludes generated indexes, SQLite,
  events, packs, runtime state, and run receipts; prove the immutable child
  seal excludes normal mutable statuses/evidence/checkpoints.
- Prove bindings and child packs contain no human approval, secrets, provider
  payloads, writable authority, live credentials, or self-authorization.
- Remove both temporary targets and prove `runs/demo-003` remains absent.

# Results / Evidence

Write `artifacts/demo-003/source-prompt-verification-receipt.json` and
`source-fixture-verification.json` with source release, both binding hashes,
authored-content comparisons, bootstrap/interface/seal identities, sendoff,
pack, repeat, authority-leakage, cleanup, and pass/fail evidence.

# Notes / Follow-ups

- task-27 may begin only when this test passes and its receipt hash is recorded.
