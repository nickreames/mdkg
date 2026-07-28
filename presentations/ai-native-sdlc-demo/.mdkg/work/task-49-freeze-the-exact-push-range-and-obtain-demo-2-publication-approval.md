---
id: task-49
type: task
title: Freeze the exact push range and obtain Demo 2 publication approval
status: done
priority: 0
epic: epic-5
parent: goal-5
prev: task-22
next: task-50
tags: [ai-native-sdlc, presentation-demo, phase-5, step-4, publication-approval, exact-sha]
owners: [root-integration-owner]
links: []
artifacts: [artifacts/demo-002/push-range-manifest.json, artifacts/demo-002/publication-approval.json, artifacts/demo-002/publication-preflight.json]
relates: []
blocked_by: [task-22]
blocks: [task-50]
refs: [goal-5, epic-5, prd-1, edd-1, dec-4, dec-5, dec-6, goal-4, chk-14, task-22]
context_refs: [goal-5, epic-5, prd-1, edd-1, dec-4, dec-5, dec-6, goal-4, chk-14, task-22]
evidence_refs: [chk-14, task-22]
aliases: [phase-5-step-4, demo-2-publication-approval]
skills: [select-work-and-ground-context, publish-static-demo-with-exact-sha, verify-close-and-checkpoint]
created: 2026-07-27
updated: 2026-07-27
---
# Overview

Freeze the actual post-commit push range and obtain separate explicit human
publication approval before any Git push or provider read is performed.

# Acceptance Criteria

- Consume the accepted task-22 local-commit receipt; no planned or uncommitted
  future commit may stand in for the exact publication range.
- Fetch `origin` and require `main` to be linear and zero behind. Record HEAD,
  fetched `origin/main`, merge base, ahead/behind counts, and observation time.
- Enumerate every commit, parent, subject, and changed repository-relative path
  in the actual `origin/main..HEAD` range, including all pre-existing ahead
  commits. Hash the stable manifest and summarize high-risk/public surfaces.
- Record the exact local evidence-only dirty paths that will remain untracked
  or unstaged through the push. All other dirty or staged paths are blockers.
- Obtain explicit human acceptance in `publication-approval.json` binding the
  candidate and `chk-14` hashes, fetched origin SHA, exact HEAD, complete
  push-range manifest hash, local-evidence exception hash, actor, remote,
  branch, validity window, allowed normal push and read-only deployment/URL
  inspections, forbidden actions, and invalidation conditions.
- The approval remains local evidence and is never added to the approved push
  range unless a later separate authority gate explicitly includes it.
- No commit, push, provider query, deployment, URL claim, or source mutation
  occurs in this node after the manifest is frozen.
- Any origin, HEAD, path, hash, writer, lease, or expiry drift invalidates the
  approval and requires this node to be repeated.

# Files Affected

- Only the three named local evidence artifacts and Goal 5 mdkg state
- Git remote-tracking refs may update through fetch
- No Git index, commit, push, source, deployment, or provider mutation

# Implementation Notes

- Approval is for actual SHAs and paths, not “Demo 2” as a feature label.
- A normal push publishes every ahead commit; the manifest must make that
  consequence explicit before approval.

# Test Plan

- Recompute the stable manifest and require the same hash.
- Require zero behind, a linear merge base, empty staged state, and only the
  declared local-evidence dirty exception.
- A fresh operator can tell exactly what the push would publish and what
  remains forbidden.

# Links / Artifacts

- `goal-5`
- `task-22`
- `chk-14`
