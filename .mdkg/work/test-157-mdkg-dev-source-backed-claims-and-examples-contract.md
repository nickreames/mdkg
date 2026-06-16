---
id: test-157
type: test
title: mdkg.dev source backed claims and examples contract
status: todo
priority: 2
epic: epic-79
parent: goal-15
tags: [mdkg-dev, claims, examples, evidence, docs-gate]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-370, task-356, task-357, task-358]
blocks: []
refs: [spike-1, spike-2, spike-3, spike-4, spike-5]
aliases: []
skills: []
cases: [claim matrix covers public pages, examples map to smoke proof, trust claims map to no-secret review, seo claims map to source evidence]
created: 2026-06-15
updated: 2026-06-15
---
# Overview

Validate that mdkg.dev public claims, examples, and launch pages are backed by
generated command metadata, smoke-tested examples, source references, or
accepted spike evidence.

# Target / Scope

- `task-370`
- `task-356`
- `task-357`
- `task-358`
- `spike-1` through `spike-5`

# Preconditions / Environment

- Generated command contract exists and passes drift check.
- Public examples have temp-repo proof or are marked blocked.
- Security/trust copy has no-secret audit coverage.

# Test Cases

- Claim matrix covers every public launch page and every major positioning
  claim.
- Generated command reference pages include command-contract source hash.
- Example pages link to smoke scripts or temp-repo proof.
- Trust/security pages link to no-secret policy and state-boundary evidence.
- SEO/positioning pages do not claim deferred public worker execution, public
  internal DB event/reducer/lease/materializer CLI, hosted queue behavior, or
  automatic research/SKILL generation.

# Results / Evidence

- Pending implementation.

# Notes / Follow-ups

- This is a launch gate for `goal-15`, not a website implementation task.
