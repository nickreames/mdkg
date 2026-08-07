---
id: task-50
type: task
title: Non-force push the approved Demo 2 range to origin main
status: done
priority: 0
epic: epic-5
parent: goal-5
prev: task-49
next: task-23
tags: [ai-native-sdlc, presentation-demo, phase-5, step-5, publication, git-push]
owners: [root-integration-owner]
links: []
artifacts: [artifacts/demo-002/push-receipt.json]
relates: []
blocked_by: [task-49]
blocks: [task-23]
refs: [goal-5, epic-5, prd-1, edd-1, dec-4, dec-5, dec-6, task-49]
context_refs: [goal-5, epic-5, prd-1, edd-1, dec-4, dec-5, dec-6, task-49]
evidence_refs: [task-49]
aliases: [phase-5-step-5, demo-2-normal-push]
skills: [publish-static-demo-with-exact-sha, verify-close-and-checkpoint]
created: 2026-07-27
updated: 2026-07-27
---
# Overview

Consume the still-valid exact-range publication approval and perform one normal
non-force push of the approved `main` range.

# Acceptance Criteria

- Reverify the task-49 approval, exact range-manifest hash, candidate/checkpoint
  hashes, lease, actor, remote, branch, expiry, and forbidden actions.
- Immediately fetch `origin` again. Require the fetched SHA, HEAD, commit/path
  range, zero-behind state, and local-evidence dirty exception to match the
  approval byte-for-byte; otherwise return to task-49.
- Require an empty Git index. Never stage or commit the local approval,
  preflight, or push-range evidence as part of the approved range.
- Push only with normal `git push origin main`. Never force, amend, rebase,
  rewrite, merge unrelated work, tag, publish a package, or mutate Vercel.
- Verify `origin/main` resolves to the approved HEAD after the push and the
  local branch is neither ahead nor behind.
- Write `push-receipt.json` with approval/range hashes, pre/post remote SHAs,
  exact command/result, actor, timestamps, and an explicit no-force finding.
- Mirror the approved push receipt into the Demo 2 child and complete child
  publication `task-3`; require child `test-3` to become next without marking
  the child goal achieved.

# Files Affected

- Git `origin/main` only through the approved normal push
- Local push evidence and Goal 5/child mdkg state
- No source, Git history rewrite, tag, package, deployment, DNS, analytics,
  provider configuration, or manual deployment

# Implementation Notes

- Commit authority from task-22 does not authorize this node.
- Provider read access begins in task-23, after Git publication is proven.

# Test Plan

- The remote SHA equals the approved HEAD and the published range equals the
  accepted manifest.
- Push output and ancestry prove a normal fast-forward without force.
- Child `task-3` has the mirrored receipt and child `test-3` is next.

# Links / Artifacts

- `goal-5`
- `task-49`
- Demo 2 child `task-3`
