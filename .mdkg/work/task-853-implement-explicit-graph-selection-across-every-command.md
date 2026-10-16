---
id: task-853
type: task
title: Implement explicit graph selection across every command
status: backlog
priority: 1
parent: goal-90
tags: [cloud-planning, design-only]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
blocked_by: [chk-678]
blocks: []
refs: [test-496]
context_refs: [edd-83]
evidence_refs: []
aliases: []
skills: []
created: 2026-10-02
updated: 2026-10-02
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
This record is a future task, not execution authorization in this PR. Resolve
the design decisions at the named design checkpoint before changing behavior.

# Acceptance Criteria

Attach reviewed paths/contracts and applicable automated fixture results to
test-496.
Maintain explicit failures/gaps; unknown custody, stale inputs or missing required
platform proof blocks completion. Later Run scope and original implementation
gates apply. No unrelated project/graph writes or publication authority.

# Current State

Backlog, unclaimed. Implementation and acceptance: NOT_RUN.

# Files Affected

src/cli.ts command dispatch, src/core configuration/path ownership and affected src/commands and graph helpers; generated contracts/docs/tests. Exact all-command inventory precedes edits.

# Test Plan

Behavior cases are defined by test-496; prepublication evidence by chk-680. All are NOT_RUN.

# Links / Artifacts

edd-83 contains the reviewed proposal; future evidence must be attached explicitly.
