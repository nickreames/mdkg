---
id: task-20
type: task
title: Seal the Demo 2 candidate receipt and offline fallback
status: done
priority: 1
epic: epic-4
parent: goal-4
prev: task-19
next: test-10
tags: [ai-native-sdlc, presentation-demo, phase-4, step-7]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-002/candidate-receipt.json, artifacts/demo-002/fallback/manifest.sha256, artifacts/demo-002/fallback/README.md, artifacts/demo-002/reveal/source-vs-specialized-16x9.png, artifacts/demo-002/reveal/detail-desktop.png, artifacts/demo-002/reveal/detail-mobile.png, artifacts/demo-002/reveal/output-desktop.png, artifacts/demo-002/reveal/output-mobile.png]
relates: []
blocked_by: []
blocks: []
refs: [goal-4, epic-4, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-19]
context_refs: [goal-4, epic-4, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-19]
evidence_refs: []
aliases: [phase-4-step-7]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-27
---

# Overview

Seal the Demo 2 candidate receipt and offline fallback. This is step 7 of 9 in Goal 4; it owns only the outcome named here and the authority granted by goal-4.

# Acceptance Criteria

- The named outcome is complete and matches prd-1, edd-1, dec-1 through dec-6, and goal-4.
- Seal `artifacts/demo-002/candidate-receipt.json` with source/fork/specialization/operator/integration receipt hashes, child goal state, exact changed paths, route inventory, local validation commands/results, and creation time.
- Capture a self-contained offline fallback under `artifacts/demo-002/fallback/` containing the rendered detail/output pages, required local assets, source/specialized goal snapshots, reveal images, and reproduction instructions.
- Capture the four named desktop/mobile local route images and one intentionally
  composed 16:9 source-versus-specialized comparison image suitable for later
  full-screen slide use. The 16:9 image must show reusable goal, specialized
  goal, Plan -> Work -> Evidence, and what/why/next without implying
  publication.
- Generate `manifest.sha256` over the fallback inventory in stable path order; the README states the local serving/viewing procedure, expected routes, limitations, and how to verify every hash.
- Treat the sealed fallback as immutable input to Goal 5: later changes require a new candidate receipt and manifest rather than overwriting this one.
- Run `mdkg --root presentations/ai-native-sdlc-demo/runs/demo-002 goal pause goal-1 --json`
  after verifying the publish task is next. Record the paused child goal hash,
  last completed canonical-site-test node, next publish node, and empty
  publication/live evidence in the candidate receipt.
- Do not stage, commit, push, inspect deployments, or claim public availability.
- Changed surfaces, commands, decisions, warnings, and artifacts are recorded in public-safe evidence.
- The successor test-10 does not begin until this node is verified.

# Files Affected

- Only the exact allowlist established by goal-4 at activation.
- Program evidence under this nested graph.
- No unrelated root, product, Git, or provider surface.

# Implementation Notes

- Re-read the active writer lease and current state immediately before mutation.
- Prefer deterministic mdkg, build, Git, and provider receipts over narrative claims.
- Keep raw prompts, credentials, tokens, cookies, provider payloads, and unrelated private context out of artifacts.
- Stop rather than broaden scope or authority.

# Test Plan

- Candidate receipt resolves every prerequisite receipt and its child `goal-1` evaluation.
- Child `goal-1` is paused, unachieved, and routes next to its publish task;
  its publication/live/checkpoint segment is untouched.
- Offline detail/output pages reproduce without network or provider access and preserve the reveal story.
- All fallback files match `manifest.sha256`; an added, missing, or changed file fails verification.
- The reveal images are readable at full-screen 16:9 and the four route
  captures cover both required viewports without relying on a live URL.
- No Git or provider side effect occurred.

# Links / Artifacts

- goal-4
- epic-4
- Evidence pending activation.
