---
id: chk-3
type: checkpoint
title: Goal 2 discovery gate accepted
checkpoint_kind: implementation
status: done
priority: 9
tags: [ai-native-sdlc, presentation-demo, phase-2, discovery-gate, accepted]
owners: [program-orchestrator, root-integration-owner]
links: []
artifacts: [artifacts/demo-platform/drift-audit.md, artifacts/demo-platform/proposed-source-allowlist.json, artifacts/demo-platform/spike-2-readiness-receipt.json, artifacts/demo-platform/activation-contract.json]
relates: [spike-2]
blocked_by: []
blocks: []
refs: [goal-2, epic-2, spike-2, goal-1, chk-1, chk-2, prd-1, edd-1, dec-4]
context_refs: [goal-2, epic-2, spike-2, goal-1, chk-1, chk-2, prd-1, edd-1, dec-4]
evidence_refs: [chk-1, chk-2]
aliases: []
skills: []
scope: [spike-2]
created: 2026-07-26
updated: 2026-07-26
---
# Summary

Accepted the Goal 2 read-only discovery result. The source-backed audit
recommends static Astro as the canonical reusable-template contract, preserves
historical Demo 1 as immutable evidence, and defines the exact proposed
shared-source mutation surface. This checkpoint does not authorize task-5.

# Scope Covered

- Completed node: spike-2 (Audit Demo 1 template and canonical site drift)
- Node type: spike
- Checkpoint source: `mdkg task done --checkpoint`

## Changed Surfaces

- Goal 2 and spike-2 structured lifecycle state in the nested program graph.
- Program-local activation, drift-audit, proposed-allowlist, and readiness
  artifacts.
- Generated nested indexes and event provenance.

## Boundaries

- in scope: read-only source inspection plus nested graph/artifact evidence
- out of scope: template, historical Demo 1, mdkg.dev, root graph, bundle,
  Git-integration, runtime, provider, deployment, or release mutations
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- Choose static Astro and zero client JavaScript as the canonical source
  template rather than layering a static specialization over a React default.
- Keep `examples/demo-runs/demo-001/**` and
  `mdkg-dev/public/demo-001/**` immutable.
- Use typed per-demo records and a compile-time Astro output-component
  registry.
- Require a manifest-driven deterministic bootstrap with repeat and deliberate
  drift proof.
- Require a clean spike commit, refreshed root projection, and accepted typed
  mutation receipt before task-5.

# Implementation Summary

- Audited template graph/operator contracts, the historical run, canonical demo
  records/pages/sitemap/claims, and five smoke surfaces.
- Recorded exact expected hashes for proposed existing source changes, bounded
  new paths, immutable evidence, integration-only paths, and forbidden actions.
- Confirmed that the start worktree was clean at
  `0399f9dfc241a25d724cdcdf9704776dfdc10b45`.

# Verification / Testing

## Command Evidence

- explicit-edge concise pack: pass, 19 nodes, approximately 3,599 tokens
- explicit-edge standard pack: pass with full PRD, EDD, six decisions,
  predecessor checkpoints, successor context, and four skills
- `mdkg index`: pass
- nested `mdkg validate --json`: pass, 0 warnings, 0 errors
- JSON parsing for activation, allowlist, and readiness artifacts: pass
- `git diff --check`: pass

## Pass / Fail Status

- status: done

## Known Warnings

- warning: none recorded by the completion command

# Known Issues / Follow-ups

- Task-5 is technically ready but not authorized.
- The root integration owner must commit this discovery milestone, refresh the
  private bundle/projection from that clean commit, re-hash every proposed row,
  and accept `goal-2-activation-receipt.json`.

## Follow-up Refs

- goal-2
- task-5
- test-4
- test-5
- test-6

# Links / Artifacts

- artifacts/demo-platform/drift-audit.md
- artifacts/demo-platform/proposed-source-allowlist.json
- artifacts/demo-platform/spike-2-readiness-receipt.json

# Raw Content Safety

- This checkpoint stores the completion summary and artifact refs, not raw prompts, secrets, payloads, or bulky traces.
