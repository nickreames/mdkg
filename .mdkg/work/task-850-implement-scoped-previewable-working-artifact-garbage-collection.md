---
id: task-850
type: task
title: Implement scoped previewable working artifact garbage collection
status: backlog
priority: 1
parent: goal-89
tags: [cloud-planning, design-only]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
blocked_by: [task-849]
blocks: []
refs: [test-495]
context_refs: [edd-83]
evidence_refs: []
aliases: []
skills: []
created: 2026-10-02
updated: 2026-10-02
---

# Overview

Implement explicit selected-entry GC preview, hash-bound apply, protected
active/pinned work and quarantine journal. Resume interruptions idempotently and
restore retained originals from reviewed receipts. Purge is a separate scoped
preview/action after retention; state irrecoverability once purged. Re-inventory
activity and path ownership under the writer lock. Refuse unknown journals,
symlink/traversal/Git metadata/hardlink ambiguity; preserve unrelated files.
Age/missing PID never releases active custody automatically. Include crash,
repeat, stale preview, activity-change and recovery positive/negative controls.

# Implementation Notes

Owned by goal-89; follow edd-83. Depends on task-849.
This record is a future task, not execution authorization in this PR. Resolve
the design decisions at the named design checkpoint before changing behavior.

# Acceptance Criteria

Attach reviewed paths/contracts and applicable automated fixture results to
test-495.
Maintain explicit failures/gaps; unknown custody, stale inputs or missing required
platform proof blocks completion. Later Run scope and original implementation
gates apply. No unrelated project/graph writes or publication authority.

# Current State

Backlog, unclaimed. Implementation and acceptance: NOT_RUN.

# Files Affected

A new selected working-storage command/helper family under src, its local manifest/ignore policy, docs/contracts and synthetic tests. Directory/CLI names are locked at the design checkpoint; existing scratch is preserved.

# Test Plan

Behavior cases are defined by test-495; prepublication evidence by chk-677. All are NOT_RUN.

# Links / Artifacts

edd-83 contains the reviewed proposal; future evidence must be attached explicitly.
