---
id: task-22
type: task
title: Commit and non-force push the accepted Demo 2 surfaces
status: backlog
priority: 1
epic: epic-5
parent: goal-5
prev: task-21
next: task-23
tags: [ai-native-sdlc, presentation-demo, phase-5, step-2]
owners: [root-integration-owner]
links: []
artifacts: [artifacts/demo-002/commit-push-receipt.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-5, epic-5, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-21]
context_refs: [goal-5, epic-5, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-21]
evidence_refs: []
aliases: [phase-5-step-2]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-26
---

# Overview

Commit and non-force push the accepted Demo 2 surfaces. This is step 2 of 9 in Goal 5; it owns only the outcome named here and the authority granted by goal-5.

# Acceptance Criteria

- The named outcome is complete and matches prd-1, edd-1, dec-1 through dec-6, and goal-5.
- Consume the still-valid task-21 preflight and allowlist hashes; rerun task-21 if HEAD, origin, dirty paths, hashes, owner, or lease changed.
- Stage only enumerated accepted Goal 2 platform, Goal 3 deck, and Goal 4 Demo 2 paths; record the exact staged inventory and compare it byte-for-byte with the allowlist before committing.
- Create the planned bounded logical commit or commits with recorded messages and parent SHAs, then fetch and repeat the zero-behind/lease checks.
- Push only with a normal non-force `git push origin main`; never amend, rebase, merge unrelated work, rewrite history, tag, publish a package, or mutate a provider.
- Write `artifacts/demo-002/commit-push-receipt.json` with preflight/allowlist hashes, staged paths, commit SHAs/parents/messages, pre/post remote SHAs, divergence, push command/result, actor, and timestamps.
- Changed surfaces, commands, decisions, warnings, and artifacts are recorded in public-safe evidence.
- The successor task-23 does not begin until this node is verified.

# Files Affected

- Only the exact allowlist established by goal-5 at activation.
- Program evidence under this nested graph.
- No unrelated root, product, Git, or provider surface.

# Implementation Notes

- Re-read the active writer lease and current state immediately before mutation.
- Only the root integration owner may stage, commit, or push; the program writer supplies reviewed hashes and does not mutate the Git index.
- Prefer deterministic mdkg, build, Git, and provider receipts over narrative claims.
- Keep raw prompts, credentials, tokens, cookies, provider payloads, and unrelated private context out of artifacts.
- Stop rather than broaden scope or authority.

# Test Plan

- Staged paths and hashes exactly equal the accepted allowlist and contain no unrelated or generated-local-only state.
- The final pushed SHA is reachable at `origin/main`, the push used no force/history rewrite, and the receipt resolves every commit parent and path.
- Stop after push evidence; deployment and URL verification belong to task-23 and task-24.

# Links / Artifacts

- goal-5
- epic-5
- Evidence pending activation.
