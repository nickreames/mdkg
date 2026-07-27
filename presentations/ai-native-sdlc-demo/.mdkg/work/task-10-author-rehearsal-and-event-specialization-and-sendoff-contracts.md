---
id: task-10
type: task
title: Author rehearsal and event specialization and sendoff contracts
status: done
priority: 1
epic: epic-2
parent: goal-2
prev: task-9
next: test-4
tags: [ai-native-sdlc, presentation-demo, phase-2, step-7]
owners: [shared-source-writer]
links: []
artifacts: [artifacts/demo-platform/rehearsal-specialization-contract.md, artifacts/demo-platform/event-specialization-contract.md, artifacts/demo-platform/live-sendoff-contract.md]
relates: []
blocked_by: []
blocks: []
refs: [goal-2, epic-2, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-9]
context_refs: [goal-2, epic-2, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-9]
evidence_refs: []
aliases: [phase-2-step-7]
skills: [select-work-and-ground-context, build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-26
---

# Overview

Author rehearsal and event specialization and sendoff contracts. This is step 7 of 10 in Goal 2; it owns only the outcome named here and the authority granted by goal-2.

# Acceptance Criteria

- The named outcome is complete and matches prd-1, edd-1, dec-1 through dec-6, and goal-2.
- Author separate Demo 2 rehearsal and Demo 3 event contracts from the same canonical source `goal-1`.
- Require each specialization to record source hash, run root, specialized PRD/EDD/decisions, specialized `goal-1`, exact output route, positioning, frozen allowlist, authority, tests, hard blockers, and checkpoint policy.
- Demo 2 remains local until Goal 5 grants publication; Demo 3 remains unexecuted until Goal 7 grants the event authority.
- The `Normative Live Sendoff Contract` section in this node is the canonical graph source for the event continuation text, child chain, authorized actions, hard blockers, attempt/time bound, exact-SHA proof, and transparent Demo 2 fallback.
- Materialize that complete section with exactly one trailing LF in
  `artifacts/demo-platform/live-sendoff-contract.md` and record its SHA-256 in
  the accepted specialization contract evidence.
- Future task-31 consumes and freezes this accepted contract byte-for-byte while adding event-specific hashes and allowlist values; task-10 does not depend on future task-31.
- Produce public-safe contract artifacts consumable by a fresh agent without private prompts or implicit provider authority.
- Changed surfaces, commands, decisions, warnings, and artifacts are recorded in public-safe evidence.
- The successor test-4 does not begin until this node is verified.

# Files Affected

- Only the exact allowlist established by goal-2 at activation.
- Program evidence under this nested graph.
- No unrelated root, product, Git, or provider surface.

# Implementation Notes

- Re-read the active writer lease and current state immediately before mutation.
- Prefer deterministic mdkg, build, Git, and provider receipts over narrative claims.
- Keep raw prompts, credentials, tokens, cookies, provider payloads, and unrelated private context out of artifacts.
- Stop rather than broaden scope or authority.

# Normative Live Sendoff Contract

> Continue until the specialized goal is achieved, the approved commit is non-force pushed to `origin/main`, both production deployments for that exact SHA are READY, and the public detail and output URLs pass verification. Do not stop at a local build or commit. Fix transient in-scope failures forward. Stop only for an enumerated hard blocker.

The child work chain is:

`positioning spike -> implementation task -> local test -> integration task -> canonical-site test -> publish task -> exact-SHA/live-URL test -> accepted checkpoint`

Authorized actions are:

- Edit only the frozen path-and-operation allowlist established by Goal 2 and the Demo 3 run directory.
- Run local validation and production-safe smoke tests.
- Create one or more bounded in-scope fix-forward commits.
- Non-force push the approved commits to `origin/main`.
- Inspect existing Vercel deployments and public URLs without mutating provider configuration.
- Have the root integration owner refresh and verify the program bundle.

Hard blockers are:

- Origin advances after the final preflight.
- Push would require force, history rewriting, or unrelated integration.
- Credentials or provider access are unavailable.
- A provider outage or unresolved production failure exceeds three complete fix-forward attempts or twenty minutes.
- Passing requires DNS, project configuration, manual redeploy, analytics, package publication, or out-of-scope source changes.

On a hard blocker, record precise evidence and reveal the sealed Demo 2 fallback transparently; do not claim Demo 3 succeeded.

# Test Plan

- Rehearsal and event contracts resolve all source, target, goal, route, allowlist, authority, test, stop, and checkpoint fields.
- The materialized contract preserves the complete `Normative Live Sendoff
  Contract` text, normalized to exactly one trailing LF, and records its
  SHA-256 for later task-31 verification.
- A fresh-agent concise preview proves task-10 and its contract artifact are present; the explicit-edge standard execution pack proves the complete normative body without exposing secrets or provider payloads.

# Links / Artifacts

- goal-2
- epic-2
- `artifacts/demo-platform/rehearsal-specialization-contract.md`
- `artifacts/demo-platform/event-specialization-contract.md`
- `artifacts/demo-platform/live-sendoff-contract.md`
- accepted live-sendoff SHA-256:
  `63c3991d84b608eb6be0ee95cf5d7fa077e08758b598c5afa02dffaa2c461220`
- accepted live-sendoff byte length: `1605`
