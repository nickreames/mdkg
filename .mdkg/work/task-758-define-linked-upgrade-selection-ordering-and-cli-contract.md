---
id: task-758
type: task
title: define linked upgrade selection ordering and CLI contract
status: todo
priority: 1
parent: goal-68
next: task-759
tags: [goal-68, selection, cli, compatibility]
owners: []
links: []
artifacts: []
relates: [goal-68]
blocked_by: []
blocks: [task-759]
refs: [goal-68, edd-73, dec-79]
context_refs: [goal-60]
evidence_refs: []
aliases: [linked-upgrade-selection-contract]
skills: [select-work-and-ground-context, service-boundary-ownership-check]
created: 2026-07-11
updated: 2026-07-11
---

# Overview

Freeze additive flags, selected-repository identity, ordering, containment,
include/exclude precedence, and single-repo compatibility.

# Acceptance Criteria

- No flag preserves current single-repo behavior exactly.
- `--linked` selects root then enabled local source paths by alias.
- Repeatable contained `--include` paths require Git root plus `.mdkg/config.json`.
- Repeatable `--exclude` wins; duplicate canonical roots fail.
- `.gitmodules`, bundles, and remote-only subgraphs never become write targets.

# Files Affected

- Upgrade CLI/parser/types and focused contract tests when executed.

# Implementation Notes

Root is always selected in linked mode. External include paths remain out of v1.

# Test Plan

- `test-420`
- `test-422`

# Links / Artifacts

- `dec-79`
