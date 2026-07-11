---
id: task-675
type: task
title: implement loop node parser schema and attributes
status: done
priority: 1
epic: epic-214
parent: goal-58
tags: [loop, node-type, parser, schema]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-58, edd-66, dec-65, task-667]
context_refs: []
evidence_refs: [chk-383]
aliases: []
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-06
updated: 2026-07-06
---
# Overview

Add `loop` as a first-class mdkg node type at the parser/schema layer. This is
the first implementation task because every later loop behavior depends on
mdkg accepting and indexing loop nodes.

# Acceptance Criteria

- `loop` is included in mdkg node type recognition without changing existing
  `goal` behavior.
- `loop` frontmatter parses with common node fields, graph edges, and loop
  attributes.
- Parser errors for malformed loop nodes are explicit and fixture-backed.

# Files Affected

- `src/graph/node.ts`
- `src/graph/template_schema.ts` or the existing template schema path if needed
- parser/unit fixtures under `tests/`

# Implementation Notes

- Start from `WORK_TYPES` and `ALLOWED_TYPES`.
- Keep `goal` outcome lifecycle separate from loop process lifecycle.
- Do not add separate `loop_template` or `loop_run` node types.

# Test Plan

- Focused parser/node tests for valid and invalid `type: loop`.
- Regression tests for existing work types and MANIFEST/SPEC semantic files.

# Links / Artifacts

- `edd-66`
- `dec-65`
- `task-667`
