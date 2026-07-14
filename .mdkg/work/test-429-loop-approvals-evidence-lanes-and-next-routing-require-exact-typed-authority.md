---
id: test-429
type: test
title: Loop approvals evidence lanes and next routing require exact typed authority
status: done
priority: 1
epic: epic-243
tags: [security, regression, v0.5.0]
owners: []
links: []
artifacts: []
relates: [goal-69]
blocked_by: []
blocks: []
refs: [edd-75, dec-80]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-07-12
updated: 2026-07-12
---
# Overview

Prove loop readiness and routing cannot be satisfied by case variants, unrelated
nodes, wrong evidence kinds/statuses, bare URIs, or pending approvals.

# Target / Scope

`task-769`; loop parse/plan/next/readiness/authorization surfaces.

# Preconditions / Environment

Purpose-built loops with mixed lanes, decisions, approvals, evidence, and children.

# Test Cases

- Case-normalized approved/prohibited action conflicts fail closed.
- Only the exact completed child satisfies its lane.
- Wrong-kind, incomplete, unrelated, or merely existing evidence is rejected.
- URI refs without verified approval state remain pending.
- When child-to-action authorization cannot be proven, pending required approval
  keeps routing conservative; plan and next output agree.

# Results / Evidence

- Action identities must be lowercase and conflicting normalized approval,
  gated, and prohibition sets fail parsing.
- Child readiness requires an explicit parent, epic, or relates edge to the loop;
  unrelated completed nodes are treated as missing lanes.
- Evidence requires completed typed local state; approvals require accepted
  decisions, done checkpoints, or verified receipts. Bare URIs do not satisfy
  either authority class.
- `loop next` returns no selected lane when a required approval-gated action is
  pending, matching `loop plan` readiness.
- Passed 619 package tests, 8 public-release tests, CLI parity, and the installed
  seven-template loop smoke. See `chk-504`.

# Notes / Follow-ups

- Preserve existing status vocabulary and single loop node type.
