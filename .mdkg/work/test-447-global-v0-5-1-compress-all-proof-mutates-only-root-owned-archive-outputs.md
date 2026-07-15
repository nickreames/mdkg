---
id: test-447
type: test
title: Global v0.5.1 compress all proof mutates only root-owned archive outputs
status: done
priority: 0
epic: epic-252
tags: [release, root-graph, archive, ownership]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-786]
blocks: [task-787]
refs: [goal-71, task-786]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-07-14
updated: 2026-07-15
---
# Overview

Prove the published global binary fixes the motivating real graph safely.

# Target / Scope

Resolved global CLI, root `archive compress --all --json`, before/after hashes,
Git/subgraph state, and root validation.

# Preconditions / Environment

Accepted `test-446` baseline and approved global/root mutations.

# Test Cases

- Global binary resolves to registry 0.5.1.
- JSON selects local workspaces and excludes imported projections.
- Only local archive ZIP/sidecar outputs may change.
- Bundles, children, raw sidecars, gitlinks, materializations, and unrelated
  state remain unchanged; root validation passes.

# Results / Evidence

Pending global/root checkpoint.

# Notes / Follow-ups

- Any no-touch mismatch blocks deployment and requires fix-forward work.
