---
id: test-12
type: test
title: Verify Demo 2 commit push and exact-SHA deployment evidence
status: done
priority: 1
epic: epic-5
parent: goal-5
prev: task-26
next: test-13
tags: [ai-native-sdlc, presentation-demo, phase-5, step-10]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-002/local-commit-receipt.json, artifacts/demo-002/publication-approval.json, artifacts/demo-002/push-range-manifest.json, artifacts/demo-002/push-receipt.json, artifacts/demo-002/deployment-receipt.json, runs/demo-002/artifacts/publication-receipt.json, runs/demo-002/artifacts/live-verification-receipt.json]
relates: []
blocked_by: [task-26]
blocks: [test-13]
refs: [goal-5, epic-5, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-26]
context_refs: [goal-5, epic-5, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-26]
evidence_refs: [task-21, task-22, task-49, task-50, task-23, task-24, task-26]
aliases: [phase-5-step-10]
skills: [select-work-and-ground-context, publish-static-demo-with-exact-sha, verify-close-and-checkpoint]
cases: [smoke_contract, local_commit_allowlist, actual_push_range, human_publication_approval, fetched_origin, zero_behind, normal_push, exact_sha_deployments, child_achieved]
created: 2026-07-26
updated: 2026-07-27
---

# Overview

Independently verify the complete local-gate, commit, approval, normal-push,
exact-SHA deployment, and child-goal evidence as step 10 of Goal 5.

# Target / Scope

- goal-5
- epic-5
- task-26

# Preconditions / Environment

- Goal 5 Activation Conditions and writer ownership are accepted.
- All predecessor nodes are done with evidence.
- The current source, Git, graph, artifact, and provider state has been re-read where applicable.

# Test Cases

- The canonical smoke contract is green before local commit preparation.
- Local commits exactly match the accepted integration allowlist and no
  publication occurs before approval.
- Human approval binds every actual commit/path in the fetched push range and
  remains valid through the normal push.
- Origin is re-fetched and zero behind immediately before push; HEAD, range,
  lease, and local-evidence exception are unchanged.
- Remote `origin/main` equals the approved HEAD after a normal non-force push.
- The resumed Demo 2 child goal completes publish and exact-SHA/live-URL work,
  has an accepted checkpoint, and evaluates achieved.
- Both production projects are READY for the exact final pushed SHA.
- Any skipped or unavailable check is a failure or explicit blocker, not an implicit pass.

# Results / Evidence

Passed on 2026-07-27.

- The accepted local candidate and canonical smoke contract preceded the two
  bounded integration commits recorded in
  `artifacts/demo-002/local-commit-receipt.json`.
- The user-approved fetched range ended at
  `f6af6410cf03ae222c4ee102844a678373b35d93` with stable range hash
  `da3fedcae13fa1e34d7f126b1950f46d925508d7f4c431ead653aa090026953d`.
- The final pre-push receipt proves an empty index, zero-behind state, unchanged
  range and local evidence exceptions, and unexpired approval.
- `git push origin main` advanced `origin/main` normally from `f5135be5` to
  `f6af6410`; no force, rewrite, tag, package publication, or provider mutation
  occurred. Post-push HEAD and `origin/main` are equal with `0 0` divergence.
- The Demo 2 child `goal-1` is `done/achieved`, has accepted production
  checkpoint `chk-3`, and validates with zero warnings and zero errors.
- Existing `mdkg-dev` and `mdkg-docs` production deployments are both `READY`
  and report the exact pushed SHA. The deployment receipt's final comparison
  and read-only provider-mutation assertions pass.
- An independent receipt parse rechecked approval binding, normal non-force
  semantics, exact-SHA deployment identity, provider read-only status, and the
  final comparison. All cases passed.

# Notes / Follow-ups

- The optional Git dry run was not performed because the sandbox approval
  reviewer timed out twice before process creation. It was optional, the
  explicit approval and live Git invariants remained green, and the exact
  normal push succeeded. This is recorded as a tooling warning, not hidden.
