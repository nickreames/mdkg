---
id: test-101
type: test
title: SPEC discovery and capability index contract validation
status: todo
priority: 1
epic: epic-48
parent: goal-8
tags: [spec, capability-index, discovery, validation]
owners: []
links: []
artifacts: []
relates: [goal-8, task-272]
blocked_by: [task-272]
blocks: [task-279]
refs: []
aliases: [spec-discovery-index-validation]
skills: []
cases: []
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Validate that SPEC discovery and capability-index behavior is specified.

# Test Cases

- `SPEC section contract` is discoverable.
- `runtime agent manifest` is discoverable.
- Projection and validation terms are discoverable.
- Imported subgraph SPECs are read-only.

# Validation Evidence

- `task-272` is done and defines future `kind: spec` capability record fields,
  read-only search/show/resolve behavior, freshness handling, visibility, and
  imported subgraph read-only policy.
- `chk-50` records the capability discovery contract.
- `node dist/cli.js capability search "SPEC section contract" --json`
  resolves `edd-14`.
- `node dist/cli.js capability search "runtime agent manifest" --json`
  resolves `edd-14`.
- `node dist/cli.js capability search "SPEC capability index discovery"
  --json` resolves `edd-14`.
