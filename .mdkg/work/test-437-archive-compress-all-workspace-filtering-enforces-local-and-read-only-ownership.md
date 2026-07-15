---
id: test-437
type: test
title: Archive compress all workspace filtering enforces local and read-only ownership
status: done
priority: 0
epic: epic-249
tags: [archive, workspace, read-only]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-777]
blocks: []
refs: [goal-70, task-777]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-07-14
updated: 2026-07-14
---
# Overview

Validate `--ws` semantics for bulk local ownership.

# Target / Scope

Two enabled local workspaces plus one imported alias.

# Preconditions / Environment

Each workspace has a distinguishable archive and complete before hashes.

# Test Cases

- `--all --ws <local>` changes only that local workspace.
- `--all --ws <imported>` emits the stable read-only error and writes nothing.
- Unknown and disabled workspace errors also precede writes.

# Results / Evidence

Passed: `--all --ws secondary` selected only the enabled secondary local
workspace; `--all --ws child_subgraph` returned the stable read-only workspace
error before changing any local or imported hash.

# Notes / Follow-ups

- Help and command contracts must show the accepted syntax.
