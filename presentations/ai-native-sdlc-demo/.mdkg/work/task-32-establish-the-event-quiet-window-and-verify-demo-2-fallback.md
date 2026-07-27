---
id: task-32
type: task
title: Establish the event quiet window and verify Demo 2 fallback
status: backlog
priority: 1
epic: epic-6
parent: goal-6
prev: task-31
next: task-33
tags: [ai-native-sdlc, presentation-demo, phase-6, step-6]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-003/event-writer-lease.json, artifacts/demo-003/fallback-readiness.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-6, epic-6, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-31]
context_refs: [goal-6, epic-6, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-31]
evidence_refs: []
aliases: [phase-6-step-6]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-26
---

# Overview

Establish the event quiet window and verify Demo 2 fallback. This is step 6 of 10 in Goal 6; it owns only the outcome named here and the authority granted by goal-6.

# Acceptance Criteria

- The named outcome is complete and matches prd-1, edd-1, dec-1 through dec-6, and goal-6.
- Establish `artifacts/demo-003/event-writer-lease.json` with the child implementation writer and root integration owner identities, checkout, start/expiry, base and origin SHA, sendoff/allowlist hashes, exact non-overlapping phases and allowed paths, excluded parallel writers, conflict check, heartbeat/renewal rule, canonical-test handoff, publication handoff, and release condition.
- Reverify Demo 2's golden-fallback manifest, candidate/deployment/route/deck hashes, public URLs, offline files, and recovery instructions without changing it.
- Write `artifacts/demo-003/fallback-readiness.json` with Demo 2 manifest hash, exact immutable artifact inventory, live route observations, offline verification, reveal switch procedure, speaker wording, and pass/blocker status.
- Do not activate Goal 7 until every parallel root writer acknowledges the quiet window and both lease and fallback receipts pass at the current base SHA.
- Changed surfaces, commands, decisions, warnings, and artifacts are recorded in public-safe evidence.
- The successor task-33 does not begin until this node is verified.

# Files Affected

- Only the exact allowlist established by goal-6 at activation.
- Program evidence under this nested graph.
- No unrelated root, product, Git, or provider surface.

# Implementation Notes

- Re-read the active writer lease and current state immediately before mutation.
- Prefer deterministic mdkg, build, Git, and provider receipts over narrative claims.
- Keep raw prompts, credentials, tokens, cookies, provider payloads, and unrelated private context out of artifacts.
- Stop rather than broaden scope or authority.

# Test Plan

- Exactly one child writer is authorized before publication and one root integration owner is authorized for the child publish node plus root bundle/Git operations; their leases never overlap.
- Demo 2 live and offline fallback hashes match the sealed Goal 5 receipt and the recovery procedure is executable.
- Lease, allowlist, sendoff, preflight, and fallback receipts all bind the same base SHA.

# Links / Artifacts

- goal-6
- epic-6
- Evidence pending activation.
