---
id: test-12
type: test
title: Verify Demo 2 commit push and exact-SHA deployment evidence
status: backlog
priority: 1
epic: epic-5
parent: goal-5
prev: task-26
next: test-13
tags: [ai-native-sdlc, presentation-demo, phase-5, step-10]
owners: [program-orchestrator]
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-5, epic-5, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-26]
context_refs: [goal-5, epic-5, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-26]
evidence_refs: []
aliases: [phase-5-step-10]
skills: [select-work-and-ground-context, publish-static-demo-with-exact-sha, verify-close-and-checkpoint]
cases: [smoke_contract, local_commit_allowlist, actual_push_range, human_publication_approval, fetched_origin, zero_behind, normal_push, exact_sha_deployments, child_achieved]
created: 2026-07-26
updated: 2026-07-26
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

Pending activation. Record pass/fail per case, commands, hashes, routes, screenshots or receipts, warnings, and follow-up refs.

# Notes / Follow-ups

- Do not advance to test-13 until the required result is evidenced.
