---
id: task-45
type: task
title: Update the claim map and implement accepted canonical changes
status: backlog
priority: 2
epic: epic-8
parent: goal-8
prev: task-44
next: task-46
tags: [ai-native-sdlc, presentation-demo, phase-8, step-6]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/adoption/canonical-change-allowlist.json, artifacts/adoption/claim-map-receipt.json, artifacts/adoption/canonical-implementation-receipt.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-8, epic-8, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-44]
context_refs: [goal-8, epic-8, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-44]
evidence_refs: []
aliases: [phase-8-step-6]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-26
---

# Overview

Update the claim map and implement accepted canonical changes. This is step 6 of 10 in Goal 8; it owns only the outcome named here and the authority granted by goal-8.

# Acceptance Criteria

- The named outcome is complete and matches prd-1, edd-1, dec-1 through dec-6, and goal-8.
- Consume only accepted idea IDs from task-44 and derive `artifacts/adoption/canonical-change-allowlist.json` with accepted base SHA, exact `mdkg-dev/**` paths, owner, reason, expected hash, operation, lease/quiet-window bounds, and explicit forbidden paths.
- Update `mdkg-dev/CLAIMS.md` first. Write `artifacts/adoption/claim-map-receipt.json` with idea-to-claim/source mappings, primary evidence, approved paraphrase, unsupported/rejected items, changed-path hash, and reviewer acceptance.
- Do not edit public copy or implementation until the claim-map receipt is accepted; unsupported claims remain rejected even when a visual or marketing idea is selected.
- Implement only accepted idea IDs on exact allowlisted canonical-site paths, preserving static Astro, SEO/LLM metadata, robots/sitemap/navigation rules, accessibility, privacy, and zero-client-JavaScript contracts.
- Write `artifacts/adoption/canonical-implementation-receipt.json` with accepted idea IDs, allowlist/claim-map hashes, exact changed paths, local commands/results, route/metadata/accessibility/asset measurements, base/final working-tree hashes, and no-publication assertion.
- Changed surfaces, commands, decisions, warnings, and artifacts are recorded in public-safe evidence.
- The successor task-46 does not begin until this node is verified.

# Files Affected

- Only the exact allowlist established by goal-8 at activation.
- Program evidence under this nested graph.
- No unrelated root, product, Git, or provider surface.

# Implementation Notes

- Re-read the active writer lease and current state immediately before mutation.
- Prefer deterministic mdkg, build, Git, and provider receipts over narrative claims.
- Keep raw prompts, credentials, tokens, cookies, provider payloads, and unrelated private context out of artifacts.
- Stop rather than broaden scope or authority.

# Test Plan

- Feedback contains no personal contact data, raw prompts, secrets, or provider payloads.
- Each demo has a separate evidence-backed reversible retention decision.
- Every selected canonical idea maps to evidence, claim-map support, and an owner.
- Local site, SEO/LLM metadata, robots, sitemap, navigation, accessibility, static, and privacy gates pass.
- Claim-map acceptance precedes every public-copy edit in the receipt timestamps and change chain.
- No staging, commit, push, deployment, or provider action occurs in this node.

# Links / Artifacts

- goal-8
- epic-8
- Evidence pending activation.
