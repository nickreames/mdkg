---
id: task-21
type: task
title: Preflight Demo 2 ownership allowed paths origin freshness and zero-behind state
status: todo
priority: 1
epic: epic-5
parent: goal-5
next: task-22
tags: [ai-native-sdlc, presentation-demo, phase-5, step-1]
owners: [root-integration-owner]
links: []
artifacts: [artifacts/demo-002/publication-allowlist.json, artifacts/demo-002/publication-preflight.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-5, epic-5, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6]
context_refs: [goal-5, epic-5, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6]
evidence_refs: []
aliases: [phase-5-step-1]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-26
---

# Overview

Preflight Demo 2 ownership allowed paths origin freshness and zero-behind state. This is step 1 of 9 in Goal 5; it owns only the outcome named here and the authority granted by goal-5.

# Acceptance Criteria

- The named outcome is complete and matches prd-1, edd-1, dec-1 through dec-6, and goal-5.
- Derive `artifacts/demo-002/publication-allowlist.json` only from accepted Goal 2–4 receipts. Record each exact repository-relative path, owner, reason, expected hash, allowed operation, base SHA, remote/branch, validity window, and forbidden surfaces.
- Acquire a root-integration-owner lease that names checkout, owner, start/expiry, base SHA, allowed paths, conflict check, release condition, and the parallel-writer acknowledgement.
- Fetch `origin`, record `HEAD`, `origin/main`, merge base, ahead/behind counts, dirty and staged paths, and require zero behind immediately before handoff.
- Write `artifacts/demo-002/publication-preflight.json` with the allowlist hash, candidate receipt/hash, lease, Git commands/results, fetched timestamp, exact staged-path expectation, logical commit/message plan, non-force push command, and abort conditions.
- Abort on origin advancement, unrelated dirty/staged paths, allowlist mismatch, expired lease, force/history-rewrite need, missing access, or any candidate hash drift.
- Changed surfaces, commands, decisions, warnings, and artifacts are recorded in public-safe evidence.
- The successor task-22 does not begin until this node is verified.

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

- Preflight receipt proves the accepted base SHA and fetched `origin/main` are current and the checkout is zero behind.
- Every dirty or proposed staged path is present with the same expected hash in the allowlist; all other paths are absent.
- The lease and preflight receipt remain valid at task-22 start; otherwise task-21 is rerun.

# Links / Artifacts

- goal-5
- epic-5
- Evidence pending activation.
