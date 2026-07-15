---
id: bug-1
type: bug
title: Reproduce imported archive compression selection in a disposable fixture
status: done
priority: 0
epic: epic-249
tags: [archive, regression, fixture, subgraph]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: [task-777]
refs: [goal-70, edd-76, dec-82]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-14
updated: 2026-07-14
---
# Overview

`archive compress --all` selects archive nodes from the merged index, including
read-only imported projections, and can write local archives before failing on a
virtual ZIP-fragment path.

# Reproduction Steps

1. Create a disposable root with one local archive and one bundle-backed
   imported subgraph containing an archive with a duplicate-capable ID.
2. Snapshot local archive outputs, bundle bytes, child tree, and filesystem-call
   inputs.
3. Run the current CLI only inside the fixture and capture the failure/no-touch
   evidence needed by tests `test-435` through `test-440`.

# Expected vs Actual

- expected: `--all` selects only writable local archives and reports exclusions.
- actual: imported projections are treated as local paths; earlier local writes
  may occur before failure.

# Suspected Cause

Merged-index selection ignores ownership, `--ws` is ignored under `--all`, and
`archiveNodePaths` receives projected `<bundle>.zip#<path>` values.

# Fix Plan

Lock the fixture and assertions first; implementation belongs to `task-777` and
`task-778`.

# Test Plan

The same fixture must later pass `test-435` through `test-440` with zero imported
or preflight-failure mutation.

# Links / Artifacts

- `edd-76`
- `dec-82`
- `task-777`
