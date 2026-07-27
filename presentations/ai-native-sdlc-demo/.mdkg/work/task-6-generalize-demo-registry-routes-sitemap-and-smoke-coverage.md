---
id: task-6
type: task
title: Generalize demo registry routes sitemap and smoke coverage
status: backlog
priority: 1
epic: epic-2
parent: goal-2
prev: task-5
next: task-7
tags: [ai-native-sdlc, presentation-demo, phase-2, step-3]
owners: [shared-source-writer]
links: []
artifacts: [artifacts/demo-platform/route-registry-contract.json, artifacts/demo-platform/task-6-route-registry-receipt.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-2, epic-2, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-5]
context_refs: [goal-2, epic-2, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-5]
evidence_refs: []
aliases: [phase-2-step-3]
skills: [build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-26
---

# Overview

Generalize demo registry routes sitemap and smoke coverage. This is step 3 of 10 in Goal 2; it owns only the outcome named here and the authority granted by goal-2.

# Acceptance Criteria

- The named outcome is complete and matches prd-1, edd-1, dec-1 through dec-6, and goal-2.
- The accepted Goal 2 mutation receipt still matches HEAD, paths, hashes, owner, and quiet window.
- Replace the Demo 1-only monolith with independent typed records addressable by stable demo ID.
- Generate detail and output routes statically for every configured demo and fail on duplicate or missing IDs.
- Filter `listed: false` records from gallery/navigation and filter `noindex: true` records from sitemap generation.
- Generalize separate route/build and safety smoke surfaces for existing Demo 1 plus fixture-only reserved Demo 2 and Demo 3 route shapes without inventing public records.
- Reconcile `mdkg-dev/CLAIMS.md` with the accepted local proof and keep every public-facing claim bound to evidence.
- Preserve `/demo/N/` and `/demo/N/output/` as the only route convention.
- Keep all work local; publication is forbidden.
- Changed surfaces, commands, decisions, warnings, and artifacts are recorded in public-safe evidence.
- The successor task-7 does not begin until this node is verified.

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

- Build-time route inventory equals the configured demo IDs and required detail/output pair.
- Negative fixtures catch duplicate IDs, missing records, listed-navigation drift, and noindex-sitemap drift.
- Existing Demo 1 route and sitemap behavior changes only where the accepted visibility policy requires it.
- `npm --prefix mdkg-dev run build`, `npm run smoke:mdkg-dev`, `npm run smoke:mdkg-dev-seo`, and the generalized demo-graph smoke pass with receipt evidence.

# Links / Artifacts

- goal-2
- epic-2
- Evidence pending activation.
