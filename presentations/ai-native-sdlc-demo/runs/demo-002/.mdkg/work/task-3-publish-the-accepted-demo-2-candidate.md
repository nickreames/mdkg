---
id: task-3
type: task
title: Publish the accepted Demo 2 candidate
status: done
priority: 1
epic: epic-1
parent: goal-1
prev: test-2
next: test-3
tags: [demo, demo-002, publication, authority-gated]
owners: [demo-002-agent]
links: []
artifacts: [artifacts/publication-receipt.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-1, test-2, prd-2, edd-1, dec-2]
context_refs: [goal-1, test-2, prd-2, edd-1, dec-2]
evidence_refs: []
aliases: []
skills: [pursue-mdkg-goal, verify-close-and-checkpoint]
created: 2026-07-27
updated: 2026-07-27
---
# Overview

Under Goal 5 only, publish the accepted Demo 2 candidate through a bounded
normal push.

# Acceptance Criteria

- A separate human-approved publication receipt binds the sealed candidate,
  allowed paths, base/fetched origin state, complete push range, and expiry.
- Origin is fetched and the branch is zero-behind before staging.
- Only accepted Demo 2 surfaces are staged and committed.
- The complete `origin/main..HEAD` path set is reviewed before a non-force push.
- Force push, history rewrite, unrelated integration, tag, package
  publication, provider mutation, and manual deployment remain forbidden.

# Files Affected

- Only the later Goal 5 publication allowlist.

# Implementation Notes

- This node is intentionally untouched and unclaimed in Goal 4.
- Local success is not publication authority.

# Test Plan

- Push receipt identifies exact local and remote SHA.
- `test-3` independently verifies the exact SHA and live routes.

# Links / Artifacts

- `goal-1`
- `test-2`
- `test-3`
