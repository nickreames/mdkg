---
id: task-390
type: task
title: consolidate native subgraph operations into 0.3.5 lane
status: done
priority: 2
epic: epic-94
parent: goal-18
tags: [0.3.5, subgraph]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-389]
blocks: [task-391]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-17
---
# Overview

Align existing subgraph sync/materialize safety with clone/import workflows.

# Acceptance Criteria

- Existing surfaces are audited as current functionality.
- No-cross-repo-mutation guarantees are documented.
- Materialized-tree safety remains strict.

# Files Affected

- src/**
- tests/**
- CLI_COMMAND_MATRIX.md

# Implementation Notes

- Do not reintroduce existing commands as new.

# Test Plan

- Subgraph smoke remains green.

# Links / Artifacts

- Add command receipts, validation output, and checkpoint ids during execution.

# Evidence

- `npm run smoke:graph-clone` passed after adding an isolated temp npm cache for the packed tarball install flow.
- `npm run smoke:subgraph` passed, confirming native read-only subgraph audit/upgrade-plan/sync/materialize behavior remains intact.
- `node scripts/assert-publish-ready.js` passed with graph clone/fork/import-template docs and smoke coverage checks.
- `npm run cli:check` passed after the graph help targets and command matrix updates.
- `node dist/cli.js validate --json` passed with zero warnings and zero errors.

# Closeout

The 0.3.5 graph lane now separates authored graph creation from read-only subgraph orchestration:

- `mdkg graph clone` and `mdkg graph fork` create separate target graphs and preserve IDs.
- `mdkg graph import-template` imports authored work nodes into the current graph with deterministic ID/link rewrites.
- `mdkg subgraph ...` remains the read-only child graph planning surface and its packed smoke still passes.
