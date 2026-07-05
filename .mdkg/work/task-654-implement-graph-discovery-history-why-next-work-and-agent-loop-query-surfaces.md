---
id: task-654
type: task
title: implement mdkg git clone fetch inspect and graph discovery surfaces
status: done
priority: 1
parent: goal-52
tags: [0.4.2, git, remote-git, graph-discovery, clone, fetch, inspect, cli]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-653]
blocks: [task-656, test-339]
refs: [goal-51, goal-53, task-650, test-338, dec-63, dec-64, edd-62, edd-63, edd-64]
context_refs: []
evidence_refs: []
aliases: []
skills: [service-boundary-ownership-check, verify-close-and-checkpoint]
created: 2026-07-03
updated: 2026-07-05
---
# Overview

Implement low-level `mdkg git` clone/fetch/inspect behavior plus the graph
discovery needed to make descriptor-backed remote Git context reviewable.

# Acceptance Criteria

- Graph discovery reports local, remote descriptor, bundle, and subgraph context
  with stale/fresh evidence.
- `mdkg git` uses the system Git CLI as the v1 backend and preserves external
  auth boundaries.
- `mdkg git` clone/fetch/inspect records source descriptor, accepted revision,
  remote, branch/ref, commit/tree hash, freshness, visibility, and validation
  evidence.
- `mdkg git` clone/fetch/inspect supports real remote repositories while tests
  use safe local temp remotes where possible.
- Project-memory semantic query UX for `history`, `why`, and `next-work` is not
  implemented here and remains deferred to `goal-53`.

# Files Affected

- CLI/API modules selected during `task-651`
- graph/source discovery and Git CLI wrapper tests
- docs/generated references after command behavior stabilizes

# Implementation Notes

- Remote descriptors may inform clone/fetch/inspect; they do not authorize
  push.
- External Git auth is used by the system Git CLI and never copied into mdkg.

# Test Plan

- clone/fetch/inspect and graph discovery unit tests
- CLI contract/help checks if new commands or flags are added
- `npm run cli:check`
- `npm run cli:contract`

# Links / Artifacts

- `edd-62`
- `edd-63`
- `edd-64`
- `goal-53`
- `test-339`
