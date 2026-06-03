---
id: task-215
type: task
title: cross subgraph reference contract and validation
status: done
priority: 1
epic: epic-38
next: task-216
tags: [subgraph, references, validation]
owners: []
links: []
artifacts: []
relates: [epic-21, edd-11]
blocked_by: []
blocks: []
refs: [rule-3]
aliases: [cross-graph-refs]
skills: []
created: 2026-06-03
updated: 2026-06-03
---

# Overview

Allow local and bundled graph records to reference configured subgraph nodes
with prefix qids, including portable agent workflow ids.

# Acceptance Criteria

- `alias:task-1` and `alias:work.example` resolve when the alias is configured
  and the projected node exists.
- URI refs such as `artifact://...` and `archive://...` remain distinct from
  qids.
- Relationship/reference fields support subgraph qids.
- Missing strict subgraph targets fail validation.
- Ownership fields for root-authored nodes remain local-only in behavior.

# Files Affected

- `src/graph/edges.ts`
- `src/util/refs.ts`
- `src/graph/agent_file_types.ts`
- `src/commands/format.ts`
- tests

# Implementation Notes

Broaden portable-ref validation where graph refs are intended, but do not treat
`scheme://...` as qids. Preserve visibility fail-closed checks for private
subgraphs.

# Test Plan

- Unit tests for portable qid refs and URI refs.
- CLI validation test with a local node relating to `child:work.child-work`.
- Failure test for a missing enabled subgraph target.

# Links / Artifacts

- `edd-11`
- Implemented parser/format/validation support for subgraph qids in references and workflow mirror refs.
- Evidence: `npm run test` passed; focused subgraph tests cover cross-subgraph qids and disabled-target validation.
