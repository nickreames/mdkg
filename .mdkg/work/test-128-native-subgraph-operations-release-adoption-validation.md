---
id: test-128
type: test
title: native subgraph operations release adoption validation
status: todo
priority: 2
epic: epic-68
tags: [test, release, adoption, downstream]
owners: []
links: []
artifacts: []
relates: [goal-12, task-321]
blocked_by: [task-321]
blocks: []
refs: []
aliases: [subgraph-operations-adoption-validation]
skills: []
cases: [docs, command-matrix, downstream-handoff]
created: 2026-06-07
updated: 2026-06-07
---
# Overview

Validate that native subgraph operations are ready for downstream adoption once
the future implementation lands.

# Target / Scope

- Documentation.
- CLI command matrix.
- Downstream migration handoff.

# Preconditions / Environment

- Implementation and tests are complete in a future resumed goal.

# Test Cases

- README and command matrix describe the command surface.
- Help snapshots include new commands.
- Downstream repos can consume audit and upgrade-plan JSON without mutation.
- No product-specific naming appears in public mdkg command names.

# Results / Evidence

Pending.

# Notes / Follow-ups

- None.
