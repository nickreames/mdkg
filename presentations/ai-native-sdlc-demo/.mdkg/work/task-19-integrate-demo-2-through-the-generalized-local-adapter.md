---
id: task-19
type: task
title: Integrate Demo 2 through the generalized local adapter
status: backlog
priority: 1
epic: epic-4
parent: goal-4
prev: task-18
next: task-20
tags: [ai-native-sdlc, presentation-demo, phase-4, step-6]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-002/integration-receipt.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-4, epic-4, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-18]
context_refs: [goal-4, epic-4, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-18]
evidence_refs: []
aliases: [phase-4-step-6]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-26
---

# Overview

Integrate Demo 2 through the generalized local adapter. This is step 6 of 9 in Goal 4; it owns only the outcome named here and the authority granted by goal-4.

# Acceptance Criteria

- The named outcome is complete and matches prd-1, edd-1, dec-1 through dec-6, and goal-4.
- Consume the accepted Goal 2 per-demo record and output-component interfaces and the task-18 local output; do not introduce a Demo 2-only adapter path.
- Register the Demo 2 record, source/executed goal evidence, and selected static Astro output component so local builds emit `/demo/2/` and `/demo/2/output/`.
- Write `artifacts/demo-002/integration-receipt.json` with adapter input/output schema versions, exact changed paths, record/component keys, route inventory, build command, output hashes, and static/public-safety results.
- Unknown demo IDs must retain Goal 2's deterministic not-found behavior; Demo 2 remains `listed: false` and `noindex: true`.
- Mirror the accepted adapter receipt into the child run, complete the child's
  integration task and canonical-site test through the child mdkg lifecycle,
  and require `goal next goal-1` to select the untouched publish task.
- Do not mark the child goal achieved and do not claim or mutate its publish,
  exact-SHA/live-URL, or accepted-checkpoint segment.
- Do not stage, commit, push, inspect deployments, or claim public availability.
- Changed surfaces, commands, decisions, warnings, and artifacts are recorded in public-safe evidence.
- The successor task-20 does not begin until this node is verified.

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

- The local output is static, zero-JavaScript, accessible, noindex/unlisted, public-safe, responsive, and within budgets.
- Both local routes render from the generalized record/component registry and show inspectable source-versus-specialized evidence.
- Child integration and canonical-site-test nodes are done with receipt hashes;
  the publish task is next and the child goal remains unachieved.
- The route inventory contains no third-party runtime script, remote font, form, tracker, or generated client JavaScript.
- No Git or provider side effect occurred.

# Links / Artifacts

- goal-4
- epic-4
- Evidence pending activation.
