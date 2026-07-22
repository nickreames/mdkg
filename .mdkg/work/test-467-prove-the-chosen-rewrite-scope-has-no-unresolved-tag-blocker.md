---
id: test-467
type: test
title: Prove the chosen rewrite scope has no unresolved tag blocker
status: todo
priority: 1
parent: goal-76
tags: [git-gud, tag, read-only]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-808]
blocks: [task-809]
refs: [goal-76, task-808]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: [fresh clean clone, exact origin parity, audit-only command, approved range identity, no unresolved tag blocker, no raw artifacts]
created: 2026-07-21
updated: 2026-07-21
---
# Overview

Prove the future scope is technically compatible with the approved tag policy
before any rewrite goal is authored or activated.

# Target / Scope

Fresh live-remote clone, approved range from task 808, tag reachability, and the
read-only git-gud audit contract.

# Preconditions / Environment

Clean exact-parity clone and an accepted human decision. No plan/apply/push,
override, tag mutation, or durable raw JSON.

# Test Cases

- Audit command is exactly `git-gud audit --range <approved-range> --format
  json`.
- `dirty_at_plan=false`; audited tips and tag identities match live origin.
- No unresolved merge, signed, or tag warning remains for the chosen scope.
- Only bounded counts, hashes, and conclusion enter Git.

# Results / Evidence

Pending separate activation and accepted decision.

# Notes / Follow-ups

- A clean audit grants eligibility only, never rewrite or force-push authority.
