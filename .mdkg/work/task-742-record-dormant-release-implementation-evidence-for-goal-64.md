---
id: task-742
type: task
title: Record dormant release implementation evidence for Goal 64
status: progress
priority: 1
epic: epic-240
tags: [release, implementation, goal-63]
owners: []
links: []
artifacts: []
relates: [goal-63]
blocked_by: [task-741]
blocks: [test-407]
refs: [test-401, test-402, test-403, test-404, test-405, test-406, test-407, edd-71, dec-73, dec-74, prd-11, prop-8]
context_refs: [goal-62, goal-63, goal-64, epic-240, dec-74, prop-8, task-740, task-741]
evidence_refs: []
aliases: []
skills: [build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-11
updated: 2026-07-11
---
# Overview

Close the local implementation lane with reproducible evidence, a dormant
source-controlled release manifest, and a clean handoff for Goal 64's final
audit, versioning, publication, push, activation, and production verification.

# Acceptance Criteria

- Confirm every preceding Goal 63 task and `test-401` through `test-406` is
  complete with linked checkpoints/artifacts; `test-407` validates this
  closeout task afterward.
- Run the full Goal 63 required-check ladder and record exact pass/fail receipts.
- Confirm root package version remains 0.4.2 and
  `release/public-release.json.state` remains `draft`.
- Confirm no push, deploy, npm publish, tag, global install, DNS/analytics change,
  or release activation occurred.
- Review the complete source diff for scope, generated-file provenance, dormant
  safety, unsupported claims, local paths, dogfood ids, hashes, and secrets.
- Create one local dormant website/docs implementation commit after all checks
  pass, record its SHA, and leave a clean worktree for Goal 64.
- Create a goal-closeout checkpoint that links four-mode build evidence,
  browser/accessibility artifacts, manifest hash, local commit SHA, and residual
  follow-ups.

# Files Affected

- Goal 63 task/test/checkpoint records
- Local Git history only after validation; no remote mutation

# Implementation Notes

- Goal 64 owns the 0.5.0 version bump, finalized changelog, external advisory
  checks, pushes, npm publication, manifest activation, and production proof.
- Do not create a tag unless the operator later changes Goal 64's accepted
  no-tag default.
- A post-validation local commit is allowed; no push is allowed.

# Test Plan

Run `test-407`, `git status --short --branch`, the full goal checks, commit
inspection, manifest/package assertions, and `git diff --check`; then dry-run a
Goal 64 pack without activating or executing it.

# Links / Artifacts

- `goal-64`
- `test-407`
- `prop-8`
