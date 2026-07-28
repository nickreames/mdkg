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
tags: [ai-native-sdlc, presentation-demo, phase-6, step-8]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-003/sendoff.md, artifacts/demo-003/sendoff.sha256, artifacts/demo-003/event-allowlist.json, artifacts/demo-003/event-authority-policy.json, artifacts/demo-003/preparation-baseline-handoff.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-6, epic-6, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-10, spike-6, task-47, test-25, task-30]
context_refs: [goal-6, epic-6, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-10, spike-6, task-47, test-25, task-30]
evidence_refs: [test-25]
aliases: [phase-6-step-8]
skills: [select-work-and-ground-context, build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-26
---

# Overview

Freeze the timed-run sendoff, exact path allowlist, prospective authority
policy, and preparation-baseline handoff. This is step 8 of 13 in Goal 6.

# Acceptance Criteria

- The named outcome is complete and matches prd-1, edd-1, dec-1 through dec-6, and goal-6.
- Materialize the exact live-sendoff version accepted and verified by test-25
  at `artifacts/demo-003/sendoff.md`; record its SHA-256 in `sendoff.sha256`.
- The materialized bytes and hash must match task-47/test-25's receipt. If the
  accepted result was no change, they must also match task-10 and
  `artifacts/demo-platform/live-sendoff-contract.md`. This node may bind
  event-specific hashes, paths, lease values, and allowlist data but may not
  silently rewrite the contract.
- Build task-31 context with the explicit-edge standard pack and verify
  task-10, spike-6, task-47, test-25, the complete selected normative section,
  and accepted contract hash are present before freezing anything.
- Derive `artifacts/demo-003/event-allowlist.json` from the accepted Goal 2 interface and Demo 3 run contract. It records every exact repo-relative path, owner, operation, reason, expected base hash, base SHA, remote/branch, validity window, authorized actions, and forbidden actions.
- The allowlist includes `presentations/ai-native-sdlc-demo/runs/demo-003/**` plus only specifically enumerated canonical adapter/site paths; globs or “related files” outside those frozen roots are invalid.
- Bind sendoff and allowlist hashes to task-30's preflight base/origin/project
  observations. Any later bound functional/sendoff/allowlist content, HEAD,
  origin, owner, or lease drift requires refreezing.
- Create `event-authority-policy.json`, not the final human authority receipt.
  Bind the exact clean base/origin SHA, source/specialized goal, sendoff and
  allowlist hashes, designated harness, owner handoffs, validity window,
  linear-descendant requirement, maximum commits, two pre-publication repairs,
  one production repair, normal non-force push,
  T+24/T+29:15/T+29:30/T+30 cutoffs, and invalidation conditions. Define the
  post-publication authority-activation
  receipt schema that binds the actual published baseline SHA after the
  separately authorized baseline transaction.
- Inventory exact program-local evidence-only paths that later Goal 6 and Goal
  7 status/events/tests/checkpoints/index/bundle/projection work may update,
  including task-58's preparation-publication and authority-activation
  receipts plus Goal 7 dispatch, timing, blocker, reveal, umbrella-audit, and
  closeout receipts. They are permitted local evidence, excluded from the
  preparation manifest and every timed push, and may not alter any bound
  functional, sendoff, allowlist, source, child-run, or interface hash. A
  correction to a bound hash invalidates authority and requires fresh human
  acceptance.
- Separately enumerate the exact future publication paths: the specialized
  `runs/demo-003/` child graph/public-safe evidence needed by the demo and the
  frozen canonical adapter/site allowlist. Those paths are not dirty-state
  exceptions; they may be staged only by the child publication node after
  local/canonical validation and the writer-lease handoff.
- The policy requires the actual commit range and stable range hash to be
  calculated and proven immediately before push. It must not contain a
  fictional future range hash.
- Write `preparation-baseline-handoff.json` with the exact preparation tree,
  expected paths/hashes, review owner, separate publication-approval
  requirement, and the condition that Goal 7 cannot start `T0` until the
  baseline is published, `HEAD == origin/main`, and the root-integration writer
  lease is released. The manifest explicitly excludes the frozen
  local-evidence-only inventory.
- It explicitly forbids force/history rewrite, unrelated integration, DNS,
  project configuration, manual redeploy, analytics, package publication,
  unlisted paths, and authority expansion. Demo 2 publication approval is not
  evidence of this event approval.
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

# Canonical Contract Source

The version selected by task-47 and verified by test-25 is the normative event
source. When unchanged, task-10 remains its byte-identical origin. Event
bindings belong in `event-allowlist.json` and
`event-authority-policy.json`, not in silently altered sendoff prose.

# Test Plan

- Demo 3 source identity, specialized contrast, graph validation, routing, and concise pack pass.
- No child implementation node has executed.
- Git, dependencies, provider read access, and both project identities are visible without storing credentials.
- The task-31 standard execution pack contains task-10's full normative section; its materialized bytes and SHA-256 match the accepted Goal 2 artifact.
- Sendoff text, allowlist, attempt/time bound, hard blockers, quiet window, and fallback are sealed.
- The prospective policy and preparation-baseline handoff are internally
  consistent and ready for the later human authority gate.
- Dry rehearsal creates no implementation, commit, push, deployment, or provider change.

# Links / Artifacts

- goal-6
- epic-6
- Evidence pending activation.
