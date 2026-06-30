---
id: test-327
type: test
title: canonical mdkg dev links only accepted demos contract
status: blocked
priority: 2
epic: epic-206
parent: goal-46
tags: [demo, seo, links, canonical, hosting]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-626, test-326]
blocks: []
refs: [dec-57, edd-33, edd-59]
context_refs: [dec-57, edd-33, edd-59]
evidence_refs: []
aliases: []
skills: []
cases: [canonical mdkg.dev links only accepted durable demos., rejected or retired demos are noindexed removed or redirected by policy., demo pages do not compete with canonical mdkg.dev seo.]
created: 2026-06-29
updated: 2026-06-29
---
# Overview

Validate that canonical mdkg.dev only points at accepted durable demos and does
not leak rejected or retired demo surfaces into public navigation.

# Target / Scope

- `task-626`
- canonical mdkg.dev link policy

# Preconditions / Environment

- `test-326` has passed or the demo is explicitly not hosted.
- Link/teardown policy has been recorded.

# Test Cases

- Canonical mdkg.dev links only accepted durable demos.
- Rejected or retired demos are noindexed, removed, or redirected by policy.
- Demo pages do not compete with canonical mdkg.dev SEO.

# Results / Evidence

Pending.

# Notes / Follow-ups

- Public site source changes require a separate explicit implementation scope.
