---
id: task-626
type: task
title: record demo teardown retirement and canonical linking policy
status: blocked
priority: 2
epic: epic-206
parent: goal-46
tags: [demo, teardown, retirement, seo, links]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-625]
blocks: [test-327]
refs: [dec-57, edd-33, edd-59]
context_refs: [dec-57, edd-33, edd-59]
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-06-29
updated: 2026-06-29
---
# Overview

Record how accepted, rejected, retired, and replaced demos are handled after
durable hosting exists.

# Acceptance Criteria

- Canonical mdkg.dev links only accepted durable demos.
- Rejected and retired demos are noindexed, removed, or redirected by explicit
  policy.
- The policy includes owner, evidence, and rollback expectations.
- The final closeout states whether the durable demo should remain linked,
  hidden, retired, or promoted further.

# Files Affected

- mdkg policy/evidence nodes
- public site links only if separately approved during execution

# Implementation Notes

- Do not add canonical mdkg.dev links in this planning task unless the active
  execution explicitly approves source changes.

# Test Plan

- `test-327`
- no-secret and public-claims review

# Links / Artifacts

- `goal-46`
- `test-327`
