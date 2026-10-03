---
id: task-853
type: task
title: Implement explicit graph selection across every command
status: review
priority: 1
parent: goal-90
tags: [cloud-planning, design-only, cloud-implementation]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-90/checks.json, docs/cloud-goal90-design.md]
relates: []
blocked_by: [chk-678]
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

Implement the accepted global selector/resolver and pass immutable graph
context through all command dispatch, config reads, nested helpers and MCP.
No selector keeps .mdkg. Unknown/ambiguous/unsupported selection refuses before
creation/index/write; never falls back to default. Registry actions are explicit,
opt-in, contained and privacy-aware; refuse alias/ID/path collisions. Update
generated command/help/docs contracts for every family. Test every family with
positive explicit selection and invalid-selector no-effects checks; audit global
flags with --ws and node aliases. No sticky unreviewed selection state.

# Implementation Notes

Owned by goal-90; follow edd-83. Depends on chk-678.
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
