---
id: chk-20
type: checkpoint
title: Demo 2 source-release recommendation ready for human approval
checkpoint_kind: handoff
status: done
priority: 1
tags: [ai-native-sdlc, presentation-demo, phase-6, source-release, human-gate]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-003/source-prompt-evaluation.md, artifacts/demo-003/historical-timing-analysis.json]
relates: [spike-6]
blocked_by: []
blocks: []
refs: [goal-6, epic-6, spike-6, task-47, test-25, chk-17, chk-18, chk-19]
context_refs: [goal-6, epic-6, spike-6, task-47, test-25, prd-1, edd-1, dec-3, dec-5, chk-17, chk-18, chk-19]
evidence_refs: [spike-6, chk-17, test-12, test-13, test-14, chk-18, chk-19]
aliases: [goal-6-source-release-recommendation-ready]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
scope: [spike-6]
created: 2026-07-27
updated: 2026-07-27
---
# Summary

Demo 2 evidence is classified into reusable authored source, immutable
run-binding inputs, child-local runtime evidence, external caller authority,
and rejected Demo-2-specific creative direction. The recommendation is a
bounded semantic source-release and run-binding refinement. It is ready for
explicit human acceptance; no reusable source file has changed.

# Scope Covered

- Completed node: spike-6 (Classify Demo 2 evidence for a fork-ready source release)
- Node type: spike
- Checkpoint source: `mdkg task done --checkpoint`

## Changed Surfaces

- `spike-6` findings, recommendation, and evidence links
- `artifacts/demo-003/source-prompt-evaluation.md`
- `artifacts/demo-003/historical-timing-analysis.json`
- nested mdkg lifecycle, event, index, and checkpoint state

## Boundaries

- in scope: read-only Demo 2/source analysis and durable program evidence
- out of scope: source/template/bootstrap mutation, Demo 3 creation, deck/site
  changes, Git staging/commit/push, deployment, provider action, and event
  authority
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- The reusable graph should contain the complete generic work topology.
- Each run should be specialized by a validated immutable binding, not by
  editing the graph after the fork.
- Authored semantic source identity must exclude generated indexes, SQLite,
  events, packs, receipts, and selected state.
- External Git/provider authority remains caller-owned and hash-bound.
- Demo 2's marketing direction remains child-local evidence, not a source
  default.
- The approximately 30-minute target requires source-first materialization plus
  warm dependencies, portable output, thin integration, build-once serial
  tests, a pre-clock preparation baseline, and a fast reveal verifier.

# Implementation Summary

- Recorded ten ranked findings and their required responses.
- Recorded the five-way ownership classification and the proposed
  source-release/binding/materialization/seal algorithm.
- Recorded exact proposed Task 47 paths, current before hashes, intended
  changes, forbidden surfaces, and eleven regression gates.
- Reconstructed the accepted Demo 2 stage estimates with an explicit
  coarse-receipt-boundary caveat and mapped them to the accepted T+30 budget.

# Verification / Testing

## Command Evidence

- `node -e` JSON parse for `historical-timing-analysis.json`: pass
- `mdkg --root presentations/ai-native-sdlc-demo index --json`: pass
- `mdkg --root presentations/ai-native-sdlc-demo validate --json`: pass before
  checkpoint creation after index refresh
- `git diff --check`: pass before checkpoint creation
- `mdkg --root presentations/ai-native-sdlc-demo task done spike-6
  --checkpoint "Demo 2 source-release recommendation ready for human approval"
  --checkpoint-kind handoff --json`: pass; allocated `chk-20`

## Pass / Fail Status

- status: done

## Known Warnings

- warning: none recorded by the completion command

# Known Issues / Follow-ups

- `task-47` must not start until the user explicitly accepts
  `artifacts/demo-003/source-prompt-evaluation.md` and its exact mutation
  allowlist.
- Acceptance authorizes local source/fixture implementation only. It does not
  authorize Demo 3 materialization, Git staging/commit/push, provider
  inspection, deployment, or event execution.
- Demo 2's pre-existing untracked `.mdkg/pack/` remains untouched.

## Follow-up Refs

- `task-47`, then `test-25`, after explicit human acceptance

# Links / Artifacts

- artifacts/demo-003/source-prompt-evaluation.md
- artifacts/demo-003/historical-timing-analysis.json

# Raw Content Safety

- This checkpoint stores the completion summary and artifact refs, not raw prompts, secrets, payloads, or bulky traces.
