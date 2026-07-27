---
id: task-31
type: task
title: Freeze the live sendoff prompt and exact path allowlist
status: backlog
priority: 1
epic: epic-6
parent: goal-6
prev: task-30
next: task-32
tags: [ai-native-sdlc, presentation-demo, phase-6, step-5]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-003/sendoff.md, artifacts/demo-003/sendoff.sha256, artifacts/demo-003/event-allowlist.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-6, epic-6, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-30]
context_refs: [goal-6, epic-6, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-30]
evidence_refs: []
aliases: [phase-6-step-5]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-26
---

# Overview

Freeze the live sendoff prompt and exact path allowlist. This is step 5 of 10 in Goal 6; it owns only the outcome named here and the authority granted by goal-6.

# Acceptance Criteria

- The named outcome is complete and matches prd-1, edd-1, dec-1 through dec-6, and goal-6.
- Materialize this node's exact sendoff, child chain, authorized actions, three-attempt/twenty-minute bounds, hard blockers, and fallback rule at `artifacts/demo-003/sendoff.md`; record its SHA-256 in `sendoff.sha256`.
- Derive `artifacts/demo-003/event-allowlist.json` from the accepted Goal 2 interface and Demo 3 run contract. It records every exact repo-relative path, owner, operation, reason, expected base hash, base SHA, remote/branch, validity window, authorized actions, and forbidden actions.
- The allowlist includes `presentations/ai-native-sdlc-demo/runs/demo-003/**` plus only specifically enumerated canonical adapter/site paths; globs or “related files” outside those frozen roots are invalid.
- Bind sendoff and allowlist hashes to task-30's preflight base/origin/project observations. Any later content, HEAD, origin, owner, or lease drift requires refreezing.
- Changed surfaces, commands, decisions, warnings, and artifacts are recorded in public-safe evidence.
- The successor task-32 does not begin until this node is verified.

# Files Affected

- Only the exact allowlist established by goal-6 at activation.
- Program evidence under this nested graph.
- No unrelated root, product, Git, or provider surface.

# Implementation Notes

- Re-read the active writer lease and current state immediately before mutation.
- Prefer deterministic mdkg, build, Git, and provider receipts over narrative claims.
- Keep raw prompts, credentials, tokens, cookies, provider payloads, and unrelated private context out of artifacts.
- Stop rather than broaden scope or authority.

# Frozen Sendoff Contract

> Continue until the specialized goal is achieved, the approved commit is non-force pushed to `origin/main`, both production deployments for that exact SHA are READY, and the public detail and output URLs pass verification. Do not stop at a local build or commit. Fix transient in-scope failures forward. Stop only for an enumerated hard blocker.

The frozen child chain is:

`positioning spike -> implementation task -> local test -> integration task -> canonical-site test -> publish task -> exact-SHA/live-URL test -> accepted checkpoint`

Authorized actions are limited to the frozen Goal 2 allowlist plus the Demo 3 run directory, local validation and production-safe smoke tests, bounded in-scope fix-forward commits, a non-force `origin/main` push, read-only inspection of existing Vercel deployments and public URLs, and integration-owner refresh and verification of the program bundle.

Hard blockers are:

- Origin advances after the final preflight.
- Push would require force, history rewriting, or unrelated integration.
- Credentials or provider access are unavailable.
- A provider outage or unresolved production failure exceeds three complete fix-forward attempts or twenty minutes.
- Passing requires DNS, project configuration, manual redeploy, analytics, package publication, or out-of-scope source changes.

# Test Plan

- Demo 3 source identity, specialized contrast, graph validation, routing, and concise pack pass.
- No child implementation node has executed.
- Git, dependencies, provider read access, and both project identities are visible without storing credentials.
- Sendoff text, allowlist, attempt/time bound, hard blockers, quiet window, and fallback are sealed.
- Dry rehearsal creates no implementation, commit, push, deployment, or provider change.

# Links / Artifacts

- goal-6
- epic-6
- Evidence pending activation.
