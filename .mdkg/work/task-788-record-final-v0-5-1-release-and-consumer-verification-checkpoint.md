---
id: task-788
type: task
title: Record final v0.5.1 release and consumer verification checkpoint
status: todo
priority: 1
epic: epic-253
tags: [release, checkpoint, closeout, fix-forward]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-787, test-448]
blocks: []
refs: [goal-71, edd-77, dec-83]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-14
updated: 2026-07-14
---
# Overview

Compress all immutable release, registry, consumer, root no-touch, docs, and Git
evidence into the final v0.5.1 checkpoint and evaluate Goal 71.

# Acceptance Criteria

- Checkpoint records release SHA/CI, npm integrity, clean/global installs, root
  hashes, deployed docs, live checks, approvals, residual risks, and no-tag state.
- `test-449` passes and Goal 71 evaluates achieved.
- Final Git and graph state are explicit; post-release issues route to separate
  fix-forward work.

# Files Affected

List files/directories expected to change.

- Goal 71, final checkpoint, and test evidence.

# Implementation Notes

- Do not erase intermediate failures or approvals.
- Report the recommended downstream consumer upgrade command and cautions.

# Test Plan

Run final graph/Git/registry/site checks and close `test-449`.

# Links / Artifacts

- `dec-83`
