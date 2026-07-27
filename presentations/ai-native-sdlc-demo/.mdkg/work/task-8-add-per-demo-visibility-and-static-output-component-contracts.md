---
id: task-8
type: task
title: Add per-demo visibility and static output component contracts
status: backlog
priority: 1
epic: epic-2
parent: goal-2
prev: task-7
next: task-9
tags: [ai-native-sdlc, presentation-demo, phase-2, step-5]
owners: [shared-source-writer]
links: []
artifacts: [artifacts/demo-platform/output-component-registry-contract.json, artifacts/demo-platform/task-8-output-component-receipt.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-2, epic-2, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-7]
context_refs: [goal-2, epic-2, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-7]
evidence_refs: []
aliases: [phase-2-step-5]
skills: [build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-26
---

# Overview

Add per-demo visibility and static output component contracts. This is step 5 of 10 in Goal 2; it owns only the outcome named here and the authority granted by goal-2.

# Acceptance Criteria

- The named outcome is complete and matches prd-1, edd-1, dec-1 through dec-6, and goal-2.
- The accepted Goal 2 mutation receipt still matches HEAD, paths, hashes, owner, and quiet window.
- Add required per-demo `listed`, `noindex`, and static output-component keys with fail-closed defaults for unreleased demos.
- Map each demo ID to a compile-time Astro output component so Demo 2 and Demo 3 may use distinct agent-selected compositions without runtime imports.
- Reject missing, duplicate, dynamic, or client-hydrated component registrations at build time.
- Ensure unlisted demos remain directly testable while absent from gallery/navigation and sitemap discovery.
- Keep Ocean Flow tokens and shared accessibility/public-safety primitives available without forcing one visual composition.
- Keep all work local; publication is forbidden.
- Changed surfaces, commands, decisions, warnings, and artifacts are recorded in public-safe evidence.
- The successor task-9 does not begin until this node is verified.

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

- Registry fixtures prove stable ID-to-component resolution and fail on all invalid mappings.
- `listed: false` and `noindex: true` behavior is verified independently.
- Built components remain static Astro with zero generated client JavaScript.

# Links / Artifacts

- goal-2
- epic-2
- Evidence pending activation.
