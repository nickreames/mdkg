---
id: task-26
type: task
title: Seal Demo 2 as the immutable golden fallback
status: backlog
priority: 1
epic: epic-5
parent: goal-5
prev: task-25
next: test-12
tags: [ai-native-sdlc, presentation-demo, phase-5, step-9]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-002/golden-fallback.json, artifacts/demo-002/golden-fallback.sha256, artifacts/demo-002/golden-fallback-recovery.md]
relates: []
blocked_by: [task-25]
blocks: [test-12]
refs: [goal-5, epic-5, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-25]
context_refs: [goal-5, epic-5, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-25]
evidence_refs: []
aliases: [phase-5-step-9]
skills: [select-work-and-ground-context, publish-static-demo-with-exact-sha, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-26
---

# Overview

Seal Demo 2 as the immutable golden fallback. This is step 9 of 12 in Goal 5.

# Acceptance Criteria

- The named outcome is complete and matches prd-1, edd-1, dec-1 through dec-6, and goal-5.
- Seal `artifacts/demo-002/golden-fallback.json` with accepted commit SHA, both production project/deployment IDs and URLs, exact Git SHA match, detail/output URLs, route/screenshot receipts, deck/source/notes/cue hashes, candidate/offline manifest hashes, and rehearsal receipt.
- Generate `golden-fallback.sha256` over every referenced local fallback artifact in stable path order and record remote observations separately with time and expected identity.
- Write `golden-fallback-recovery.md` with live reveal, offline reveal, source-versus-specialized comparison, hash verification, speaker disclosure, and recovery steps that require no provider mutation.
- “Immutable” means Goal 6 and Goal 7 consume these hashes read-only; a changed artifact creates a newly versioned fallback and requires Goal 5 reacceptance rather than overwriting the seal.
- Changed surfaces, commands, decisions, warnings, and artifacts are recorded in public-safe evidence.
- The successor test-12 does not begin until this node is verified.

# Files Affected

- Only the exact allowlist established by goal-5 at activation.
- Program evidence under this nested graph.
- No unrelated root, product, Git, or provider surface.

# Implementation Notes

- Re-read the active writer lease and current state immediately before mutation.
- Prefer deterministic mdkg, build, Git, and provider receipts over narrative claims.
- Keep raw prompts, credentials, tokens, cookies, provider payloads, and unrelated private context out of artifacts.
- Stop rather than broaden scope or authority.

# Test Plan

- Every local file resolves and matches `golden-fallback.sha256`; every remote identity matches the accepted commit/deployment/route receipts.
- A fresh operator can reveal the live or offline fallback and explain Demo 3's blocker using only the recovery document.
- No provider, Git, source, or deck mutation is needed to recover.

# Links / Artifacts

- goal-5
- epic-5
- Evidence pending activation.
