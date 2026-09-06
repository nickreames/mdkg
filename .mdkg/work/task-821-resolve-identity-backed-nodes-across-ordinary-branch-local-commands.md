---
id: task-821
type: task
title: Resolve identity-backed nodes across ordinary branch-local commands
status: todo
priority: 1
epic: epic-83
parent: goal-82
tags: [alignment-002, implementation-unapproved]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-820]
blocks: []
refs: [edd-81, dec-93]
context_refs: []
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-09-05
updated: 2026-09-05
---

# Overview

Use one identity-aware resolver across graph-facing commands, so new branch-local
nodes remain ordinary usable nodes before staging/commit/integration. Unclaimed.

# Acceptance Criteria

- new/show/list/search/pack and task/goal/loop/checkpoint use one identity model.
- Cover refs, archive/work/manifest, event references, import/export, validation,
  indexes and read-only MCP; document any command not applicable to a node type.
- Existing alias/QID inputs and output fields remain compatible, with additive
  stable identity where needed. Explicit identity resolves alias collisions;
  ambiguous bare aliases fail instead of choosing lexical/newest nodes.
- Staged, unstaged and untracked authored nodes use the working-tree graph.
  Optional staged-view inspection is read-only, not a second mutation target.
- Conflict markers can be diagnosed, not treated as a valid writable graph.
- Checkout-local selection and transient execution ownership do not merge into
  canonical knowledge; durable task lifecycle remains a semantic graph change.

# Files Affected

Future shared graph loading/resolution/types, command adapters, MCP and parity tests.

# Implementation Notes

Current goal claim also changes shared task status and goal active_node. Define
its compatibility treatment explicitly; do not silently relabel existing claims
as local leases or break single-writer main. Index rebuild preserves identity.

# Test Plan

For each applicable command, exercise branch-local new nodes before and after
staging and after alias reconciliation; compare outcomes/targets by identity.
Include JSON/SQLite parity, MCP read parity, legacy selectors and ordinary main.
test-475 owns the executable matrix.

# Links / Artifacts

- edd-81, goal-82; evidence pending implementation.
