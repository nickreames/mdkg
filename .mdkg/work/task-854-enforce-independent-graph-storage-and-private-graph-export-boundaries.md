---
id: task-854
type: task
title: Enforce independent graph storage and private graph export boundaries
status: review
priority: 1
parent: goal-90
tags: [cloud-planning, design-only, cloud-implementation]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-90/checks.json, docs/cloud-goal90-design.md]
relates: []
blocked_by: [task-853]
blocks: []
refs: [test-496]
context_refs: [edd-83]
evidence_refs: []
aliases: []
skills: []
created: 2026-10-02
updated: 2026-10-03
---

# Overview

Remove cross-graph storage assumptions under the approved graph context:
IDs/reservations, graph/config/identity, index/cache, locks/journals/events,
goals/claims/loops, DB/snapshots/queues, working artifacts, packs/mirrors/bundles.
Refuse overlapping roots or mirror targets. Default operations never scan an
unregistered private sibling; explicit exports cannot include other graphs.
Exercise a tracked team graph plus large ignored synthetic private graph with
canaries and same-number aliases. Check file reads/writes, Git/package inventory,
output leaks and bounded performance. No hosted queue or cross-graph routing.

# Implementation Notes

Owned by goal-90; follow edd-83. Depends on task-853.
The planning PR supplied requirements, not execution authority. Nick later
expressly authorized the sequential cloud stack, and parent relayed prerequisite
GO at exact PR12 head 1e5b598. The bounded named-root design follows delegated
selector choices in docs/cloud-goal90-design.md. Independent exact-patch design
and implementation review remains pending; no approval is recorded here.

# Acceptance Criteria

Attach reviewed paths/contracts and applicable automated fixture results to
test-496.
Maintain explicit failures/gaps; unknown custody, stale inputs or missing required
platform proof blocks completion. Later Run scope and original implementation
gates apply. No unrelated project/graph writes or publication authority.

# Current State

Owned cloud Run cloud-goal90-20261003 is active. Source implementation and
bounded synthetic source/installed controls pass on three supported native
runtimes; static and full readiness evidence is retained separately. See docs/cloud-goal90-checkpoint.md for the final
checkpoint. Required independent/owner/full release acceptance is pending.
Original dependency edges stay intact: the explicit prerequisite exception is
recorded separately and does not invent READY or done at chk-677/chk-678.

# Files Affected

src/cli.ts command dispatch, src/core configuration/path ownership and affected src/commands and graph helpers; generated contracts/docs/tests. Exact all-command inventory precedes edits.

# Test Plan

Behavior cases are defined by test-496; prepublication evidence by chk-680. All are NOT_RUN.

# Links / Artifacts

edd-83 contains the reviewed proposal; future evidence must be attached explicitly.
