---
id: test-336
type: test
title: 0.4.1 npm release and downstream-private consumer validation contract
status: done
priority: 1
parent: goal-50
tags: [0.4.1, npm, postpublish, consumer-validation]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-648]
blocks: []
refs: [task-649, test-337, task-645, task-646, task-647, task-648, test-332]
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
cases: []
created: 2026-07-02
updated: 2026-07-04
---
# Overview

Validate the completed `mdkg@0.4.1` npm release, post-publish install proof,
generic public naming gate, and downstream-private consumer handoff.

# Target / Scope

- `goal-50`
- `task-649`
- `test-337`
- `task-645`
- `task-646`
- `task-647`
- `task-648`

# Preconditions / Environment

- `test-337` has proved the generic public naming gate.
- `task-648` has prepared any downstream-private handoff.
- Real npm publish was explicitly approved and completed.

# Test Cases

- Final prepublish gates and registry dry-runs passed before real publish.
- Public mdkg release claims name generic CLI/template/schema/validator
  capabilities, not downstream product branding.
- Real npm publish used safe temp npm auth and did not print or commit tokens.
- Npm registry and dist-tags show `0.4.1` as latest.
- Temp global install and fresh workspace probes pass using the published
  package.
- Downstream-private handoff cites stable generic behavior and leaves consumer
  runtime policy downstream-owned.
- Remote Git/project-memory primitive claims are absent from public 0.4.1
  release evidence except as deferred generic successor planning.
- Any git push or tag push has separate explicit approval evidence.

# Results / Evidence

Pending.

# Notes / Follow-ups

- None yet.
