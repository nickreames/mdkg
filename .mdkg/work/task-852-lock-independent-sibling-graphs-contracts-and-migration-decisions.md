---
id: task-852
type: task
title: Lock independent sibling graphs contracts and migration decisions
status: backlog
priority: 1
parent: goal-90
tags: [cloud-planning, design-only]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
blocked_by: [chk-677]
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

Inventory every command family and helper with .mdkg assumptions, including
MCP/diagnostics/generated contracts and future queue state. Compare --graph
alias/ID to positional numeric syntax; .mdkg2/mdkg 2 remain exploratory. Lock
stable graph IDs, alias registry/private registry policy and selection precedence
before effects. Review mirror ownership and all config/index/state/scratch/DB/
publication boundaries. Use only synthetic graphs. Reuse edd-81 identity contracts
and distinguish independent siblings from workspaces/subgraphs; no federation.

# Implementation Notes

Owned by goal-90; follow edd-83. Depends on chk-677.
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
