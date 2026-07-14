---
id: test-436
type: test
title: Imported bundles child trees and ZIP fragment paths never enter mutation
status: done
priority: 0
epic: epic-249
tags: [archive, subgraph, filesystem, no-touch]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-778]
blocks: []
refs: [goal-70, task-777, task-778]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-07-14
updated: 2026-07-14
---
# Overview

Prove imported transport and source assets are never filesystem mutation inputs.

# Target / Scope

Bundle bytes, child source tree, git state, materialized view, and instrumented
filesystem helper inputs in the disposable fixture.

# Preconditions / Environment

Capture hashes/tree state and intercept relevant path operations.

# Test Cases

- Bundle and child hashes/state are unchanged after successful `--all`.
- No operation receives a path containing the virtual ZIP fragment.
- No gitlink or materialized subgraph path is written.

# Results / Evidence

Passed in the disposable fixture: bundle SHA-256, child-tree hash, materialized
subgraph hash, and the root Git index's mode-160000 child gitlink entry were
identical before and after compression. Direct imported qid failure occurred
before path derivation and emitted no ZIP-fragment filesystem error.

# Notes / Follow-ups

- Any observed imported path access is release-blocking.
