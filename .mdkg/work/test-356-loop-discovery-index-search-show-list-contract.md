---
id: test-356
type: test
title: loop discovery index search show list contract
status: done
priority: 1
epic: epic-216
parent: goal-58
tags: [loop, index, search, show, list]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-58, edd-66, dec-65, test-345, task-680, chk-386, task-682, chk-388, chk-390]
context_refs: []
evidence_refs: [chk-386, chk-390]
aliases: []
skills: [verify-close-and-checkpoint]
cases: []
created: 2026-07-06
updated: 2026-07-06
---
# Overview

Validate loop discovery across index/search/show/list.

# Target / Scope

- `task-680`

# Preconditions / Environment

Loop fixtures exist and `mdkg index` has run.

# Test Cases

- `mdkg search loop --json` includes loop nodes.
- Broad `mdkg search loop --json` output remains valid JSON when result volume
  is high; if output is truncated, truncation is represented explicitly instead
  of cutting the JSON stream.
- `mdkg show <loop> --json` renders loop attributes and edges.
- `mdkg list --type loop --json` or equivalent type filtering discovers loops.
- Non-loop discovery behavior is unchanged.

# Results / Evidence

PASS. The implemented contract is covered by the current loop, graph, pack,
template, CLI, and regression suites as applicable. Historical milestone
evidence is linked in frontmatter and consolidated by `chk-390`.

# Notes / Follow-ups

- Capability discovery should only change if explicitly implemented.
