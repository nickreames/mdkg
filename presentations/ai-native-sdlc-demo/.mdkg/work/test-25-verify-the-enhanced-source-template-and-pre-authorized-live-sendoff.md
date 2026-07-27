---
id: test-25
type: test
title: Verify the enhanced source template and pre-authorized live sendoff
status: backlog
priority: 1
epic: epic-6
parent: goal-6
prev: task-47
next: task-28
tags: [ai-native-sdlc, presentation-demo, phase-6, step-4, source-prompt-refinement]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-003/source-prompt-verification-receipt.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-6, epic-6, prd-1, edd-1, dec-3, dec-5, task-47]
context_refs: [goal-6, epic-6, prd-1, edd-1, dec-3, dec-5, task-47]
evidence_refs: []
aliases: [phase-6-source-prompt-proof]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
cases: [source_hash, bootstrap_repeat, pack_coverage, sendoff_authority, no_retained_run]
created: 2026-07-27
updated: 2026-07-27
---
# Overview

Prove that the accepted revised or unchanged source template and sendoff are a
deterministic, context-complete, pre-authorizable starting point for Demo 3.

# Target / Scope

- task-47
- canonical website-demo source graph and operator manifest
- versioned live sendoff selected for Demo 3

# Preconditions / Environment

- task-47 receipt is accepted and all source/manifest/sendoff hashes resolve.
- Use an absent temporary target outside `runs/demo-003`; Demo 3 must remain
  absent.

# Test Cases

- Create a temporary absent-target bootstrap using the exact accepted source,
  manifest, wrapper, and `goal-1`; prove preserved IDs, zero-warning
  validation, deterministic routing, and complete concise/standard packs.
- Run verify-only repeat and require identical inventory/hashes and zero
  overwritten files.
- Require packs to contain source goal, PRD, EDD, decisions, work/test chain,
  accepted source checkpoint, and required skills without truncation.
- Verify the selected live sendoff still requires continuation through normal
  push, exact-SHA READY deployments, live URLs, bounded fix-forward, and the
  truthful Demo 2 fallback.
- Verify the future event-authority schema can pre-authorize every in-scope
  action without granting force, provider mutation, DNS, unrelated
  integration, or out-of-scope edits.
- Remove the temporary target and prove `runs/demo-003` remains absent.

# Results / Evidence

Write `artifacts/demo-003/source-prompt-verification-receipt.json` with source,
manifest, sendoff, pack, inventory, repeat, cleanup, and pass/fail evidence.

# Notes / Follow-ups

- task-28 may begin only when this test passes and its receipt hash is recorded.
