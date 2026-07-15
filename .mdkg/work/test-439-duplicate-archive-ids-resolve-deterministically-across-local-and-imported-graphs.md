---
id: test-439
type: test
title: Duplicate archive IDs resolve deterministically across local and imported graphs
status: done
priority: 1
epic: epic-249
tags: [archive, identity, determinism]
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

Prevent merged-graph duplicate IDs from selecting an arbitrary owner.

# Target / Scope

Same portable archive ID in root, another local workspace, and imported graph.

# Preconditions / Environment

Fixture paths and payloads must make every candidate distinguishable.

# Test Cases

- Explicit qid and `--ws` always select the intended local candidate.
- Bulk ordering and exclusions sort by qid.
- Ambiguous unsupported direct forms fail rather than selecting an import.

# Results / Evidence

Passed: `--all` sorted and compressed `root:archive.shared` and
`secondary:archive.shared`, while deterministically excluding
`child_subgraph:archive.shared`; exact qids remained unambiguous.

# Notes / Follow-ups

- Preserve existing unambiguous plain-ID compatibility.
