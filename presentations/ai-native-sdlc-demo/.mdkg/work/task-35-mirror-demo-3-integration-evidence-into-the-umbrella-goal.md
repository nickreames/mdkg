---
id: task-35
type: task
title: Mirror Demo 3 integration evidence into the umbrella goal
status: backlog
priority: 1
epic: epic-7
parent: goal-7
prev: task-34
next: task-36
tags: [ai-native-sdlc, presentation-demo, phase-7, step-2]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-003/umbrella/integration-receipt.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-7, epic-7, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-34]
context_refs: [goal-7, epic-7, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-34]
evidence_refs: []
aliases: [phase-7-step-2]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-26
---

# Overview

Mirror the Demo 3 child goal's integration evidence into the audience-facing umbrella without repeating its source mutation. This is step 2 of 11 in Goal 7.

# Acceptance Criteria

- Consume only `runs/demo-003/artifacts/receipts/integration.json`; do not edit the adapter, output, run graph, or canonical site from this node.
- Verify the receipt binds the specialized `goal-1`, allowed paths, output hashes, adapter contract, and local integration checks.
- If integration is incomplete, keep the child goal running within its authority or record its hard blocker; do not create a second writer.
- Record only sanitized evidence needed for the reveal.
- Write `artifacts/demo-003/umbrella/integration-receipt.json` with child receipt path/hash, child QID/checkpoint, allowlist hash, adapter/schema version, exact changed paths/output hashes, local command results, review time, and pass/blocker status.
- The successor task-36 does not begin until this node is verified.

# Files Affected

- Program evidence under this nested graph only.
- No run graph, adapter, canonical source, Git, or provider mutation.

# Implementation Notes

- Re-read the child receipt and writer lease before recording the mirror.
- Prefer deterministic mdkg and build receipts over narrative claims.
- Keep raw prompts, credentials, tokens, cookies, provider payloads, and unrelated private context out of artifacts.
- Stop rather than broaden scope or authority.

# Test Plan

- Child integration evidence resolves to the specialized `goal-1` and frozen adapter.
- The umbrella mirror hashes match `runs/demo-003/artifacts/receipts/integration.json` and introduces no mutation.

# Links / Artifacts

- goal-7
- epic-7
- Evidence pending activation.
