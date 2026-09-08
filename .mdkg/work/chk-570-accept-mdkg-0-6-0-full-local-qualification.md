---
id: chk-570
type: checkpoint
title: Accept mdkg 0.6.0 full local qualification
status: backlog
priority: 1
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
blocked_by: [task-830, task-828]
blocks: []
refs: []
context_refs: [goal-83, goal-84, goal-85]
evidence_refs: []
aliases: []
skills: []
scope: [task-823, task-824, task-825, task-826, task-827, task-829, task-830, test-477, test-478, test-479, test-480, test-481, test-482]
created: 2026-09-07
updated: 2026-09-07
checkpoint_kind: goal-closeout
---

# Summary

PLANNED ACCEPTANCE GATE — incomplete. This checkpoint does not claim qualification.

# Scope Covered

Full Goal 83 qualification plus Goal 84 independent blocker verification.

# Decisions Captured

Direct 0.6.0 after full qualification; no publication in the current pass. Preserve complete identity and compact bootstrap architecture.

# Implementation Summary

Pending final verified implementation and exact candidate.

# Verification / Testing

Before status done, require task-828/829/830 completion, all six installed test families, full unchanged-threshold ladder, source SHA, tarball SHA-512/SHA-256 and package manifest/input hashes, both security reports, graph/SQLite/diff checks and protected before/after hashes.

# Known Issues / Follow-ups

All open Goal 84 bugs block this gate. goal-85 remains paused until new explicit publication approval even after this checkpoint is done.

# Links / Artifacts

Initial audit: chk-571. Final evidence pending; do not fill placeholders with inferred passes.
