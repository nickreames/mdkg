---
id: task-5
type: task
title: Reconcile the website template with static Astro and zero client JavaScript
status: done
priority: 1
epic: epic-2
parent: goal-2
prev: spike-2
next: task-6
tags: [ai-native-sdlc, presentation-demo, phase-2, step-2]
owners: [shared-source-writer]
links: []
artifacts: [artifacts/demo-platform/static-astro-contract.md, artifacts/demo-platform/task-5-static-astro-receipt.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-2, epic-2, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, spike-2]
context_refs: [goal-2, epic-2, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, spike-2]
evidence_refs: []
aliases: [phase-2-step-2]
skills: [build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-26
---

# Overview

Reconcile the website template with static Astro and zero client JavaScript. This is step 2 of 10 in Goal 2; it owns only the outcome named here and the authority granted by goal-2.

# Acceptance Criteria

- The named outcome is complete and matches prd-1, edd-1, dec-1 through dec-6, and goal-2.
- `goal-2-activation-receipt.json` is accepted and still matches HEAD, paths, hashes, owner, and quiet window before this node starts.
- Reconcile the current React-Islands-capable source template with an explicit, deterministic static-Astro specialization contract for Demo 2 and Demo 3.
- The source template may retain broader React capability only when static specialization is the fail-closed default for these runs and requires no client directive, hydration metadata, or generated client JavaScript.
- Remove or replace every `client:*` directive and runtime-only dependency from the canonical mdkg.dev demo-output path and future specialized outputs while preserving Astro build determinism.
- Define a built-output assertion that fails on generated client JavaScript, unexpected `<script>` tags, remote runtime assets, or hydration metadata.
- Keep the reusable template cloneable and record any intentionally retained broader capability outside the specialized output contract.
- Do not modify `examples/demo-runs/demo-001/**` or `mdkg-dev/public/demo-001/**`. Prove the built canonical `/demo/1/` and `/demo/1/output/` routes do not regress.
- Keep all work local; publication is forbidden.
- Changed surfaces, commands, decisions, warnings, and artifacts are recorded in public-safe evidence.
- The successor task-6 does not begin until this node is verified.

# Files Affected

- Only the exact mutable paths in the accepted Goal 2 mutation receipt.
- Program evidence under this nested graph.
- No unrelated root, product, Git, or provider surface.

# Implementation Notes

- Re-read the active writer lease and current state immediately before mutation.
- Prefer deterministic mdkg, build, Git, and provider receipts over narrative claims.
- Keep raw prompts, credentials, tokens, cookies, provider payloads, and unrelated private context out of artifacts.
- Stop rather than broaden scope or authority.

# Test Plan

- Astro build succeeds from the accepted dependency state.
- Source and built-output scans find zero client directives, hydration metadata, or generated client JavaScript on demo routes.
- `npm --prefix mdkg-dev run build` and the accepted mdkg-dev/demo smoke command families pass.
- Canonical Demo 1 remains renderable without changing its historical run or asset, and the contract/receipt name every enforced exclusion.

# Links / Artifacts

- goal-2
- epic-2
- Evidence pending activation.
