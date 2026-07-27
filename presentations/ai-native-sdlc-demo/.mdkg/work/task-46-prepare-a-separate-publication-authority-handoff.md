---
id: task-46
type: task
title: Prepare a separate publication authority handoff
status: backlog
priority: 2
epic: epic-8
parent: goal-8
prev: task-45
next: test-22
tags: [ai-native-sdlc, presentation-demo, phase-8, step-7]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/adoption/publication-handoff.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-8, epic-8, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-45]
context_refs: [goal-8, epic-8, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-45]
evidence_refs: []
aliases: [phase-8-step-7]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-26
---

# Overview

Prepare a separate publication authority handoff. This is step 7 of 10 in Goal 8; it owns only the outcome named here and the authority granted by goal-8.

# Acceptance Criteria

- The named outcome is complete and matches prd-1, edd-1, dec-1 through dec-6, and goal-8.
- Write `artifacts/adoption/publication-handoff.json` with accepted idea/change IDs, base SHA, current HEAD and origin SHA, exact changed paths/hashes, allowlist and claim-map receipts, required local checks/results, proposed remote/branch, designated approver/integration owner, lease requirement, logical commit plan, allowed actions, prohibited actions, rollback/fallback, unresolved risks, and expiration condition.
- State one of two outcomes explicitly: `deferred` with no publication authority, or `ready-for-separate-authorization` pending an identified approver and fresh Git/provider preflight.
- The handoff never itself authorizes or performs staging, commit, push, deployment, project/DNS/analytics changes, tag, package publication, or history rewrite.
- Any later publication must recheck base/origin state, renew the quiet-window lease, and obtain authority scoped to the exact handoff hash.
- Changed surfaces, commands, decisions, warnings, and artifacts are recorded in public-safe evidence.
- The successor test-22 does not begin until this node is verified.

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
- Handoff resolves every accepted implementation/check receipt, has no ambiguous paths/actions, and records deferred or fresh-authorization status.
- Git index/history/remote and provider state are unchanged by this node.

# Links / Artifacts

- goal-8
- epic-8
- Evidence pending activation.
