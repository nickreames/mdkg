---
id: test-336
type: test
title: 0.4.1 npm release and postpublish consumer validation contract
status: blocked
priority: 1
parent: goal-50
tags: [0.4.1, npm, postpublish, consumer-validation]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-648]
blocks: []
refs: [task-645, task-646, task-647, task-648, test-332]
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
cases: []
created: 2026-07-02
updated: 2026-07-02
---
# Overview

Validate the completed `mdkg@0.4.1` npm release, post-publish install proof,
and downstream consumer handoff.

# Target / Scope

- `goal-50`
- `task-645`
- `task-646`
- `task-647`
- `task-648`

# Preconditions / Environment

- `task-648` has prepared the downstream handoff.
- Real npm publish was explicitly approved and completed.

# Test Cases

- Final prepublish gates and registry dry-runs passed before real publish.
- Real npm publish used safe temp npm auth and did not print or commit tokens.
- Npm registry and dist-tags show `0.4.1` as latest.
- Temp global install and fresh workspace probes pass using the published
  package.
- Downstream handoff cites stable generic behavior and leaves Omni Room runtime
  policy downstream-owned.
- Any git push or tag push has separate explicit approval evidence.

# Results / Evidence

Pending.

# Notes / Follow-ups

- None yet.
