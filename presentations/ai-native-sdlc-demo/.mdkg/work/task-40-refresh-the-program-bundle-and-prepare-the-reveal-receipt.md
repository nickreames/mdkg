---
id: task-40
type: task
title: Refresh the program bundle and prepare the reveal receipt
status: backlog
priority: 1
epic: epic-7
parent: goal-7
prev: test-21
tags: [ai-native-sdlc, presentation-demo, phase-7, step-11]
owners: [root-integration-owner]
links: []
artifacts: [artifacts/demo-003/reveal-receipt.json, artifacts/demo-003/program-bundle-receipt.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-7, epic-7, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, test-21]
context_refs: [goal-7, epic-7, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, test-21]
evidence_refs: []
aliases: [phase-7-step-11]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-26
---

# Overview

Refresh the program bundle and prepare the reveal receipt. This is the final step 11 of 11 in Goal 7; it owns only the outcome named here and the authority granted by goal-7.

# Acceptance Criteria

- The named outcome is complete and matches prd-1, edd-1, dec-1 through dec-6, and goal-7.
- Only after task-35 through task-39 and tests 18–21 pass, have the root integration owner prepare the public-safe reveal receipt and a provisional verified bundle from `presentations/ai-native-sdlc-demo/`.
- Verify that exact ZIP, then from the repository root run `node dist/cli.js subgraph refresh ai_native_sdlc_demo --json`, `node dist/cli.js subgraph verify ai_native_sdlc_demo --json`, and `node dist/cli.js goal show ai_native_sdlc_demo:goal-7 --json` for the projected program evidence.
- Write `artifacts/demo-003/program-bundle-receipt.json` with program root, absolute bundle path, private/root profile, bundle content hash, ZIP SHA-256, alias, create/verify/refresh outputs, root base SHA, owner, and timestamp.
- Write `artifacts/demo-003/reveal-receipt.json` linking source `goal-1`, specialized Demo 3 `goal-1`, achieved child checkpoint, Plan/Work/Evidence summaries, what/why/next, commit/push receipt, exact-SHA deployments, live routes/screenshots, and the bundle projection.
- Complete task-40, create the accepted Goal 7 checkpoint, and close Goal 7 only after all receipts resolve. Then re-index and rebuild the bundle a second time, refresh/verify the root projection, and require `goal show ai_native_sdlc_demo:goal-7` to report achieved; the root integration event records this final post-closeout bundle hash so writing it cannot stale the bundle.
- If any required receipt is blocked or inconsistent, record the blocker and reveal the sealed Demo 2 fallback; never manufacture a Demo 3 success receipt.
- Changed surfaces, commands, decisions, warnings, and artifacts are recorded in public-safe evidence.
- No successor begins; this node owns the two-pass final closeout projection.

# Files Affected

- Only the exact allowlist established by goal-7 at activation.
- Program evidence under this nested graph.
- No unrelated root, product, Git, or provider surface.

# Implementation Notes

- Re-read the active writer lease and current state immediately before mutation.
- Only the root integration owner may rebuild the root-owned bundle, refresh the read-only projection, or mutate root generated indexes.
- Prefer deterministic mdkg, build, Git, and provider receipts over narrative claims.
- Keep raw prompts, credentials, tokens, cookies, provider payloads, and unrelated private context out of artifacts.
- Stop rather than broaden scope or authority.

# Test Plan

- Bundle verification and root projection resolve the final program state through alias `ai_native_sdlc_demo`.
- Reveal receipt resolves every named child and umbrella hash and clearly states Demo 3 success or Demo 2 fallback.
- Only root-owned bundle/config/generated-index surfaces change in this node; the child and provider are read-only.

# Links / Artifacts

- goal-7
- epic-7
- Evidence pending activation.
