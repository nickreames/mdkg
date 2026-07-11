---
id: test-345
type: test
title: Loop node discoverability search show and pack contract
status: done
priority: 1
parent: goal-57
tags: [loop, implementation-contract, discoverability, pack, search]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-673]
blocks: []
refs: [goal-57, goal-58, task-673, edd-66, dec-65]
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
cases: []
created: 2026-07-05
updated: 2026-07-05
---
# Overview

Future implementation contract: prove `loop` nodes are discoverable and
packable through normal mdkg graph surfaces.

# Target / Scope

- `goal-58`
- Future `loop` parser/template/index/search/show/list/pack work.
- Future seeded loop fixtures.

# Preconditions / Environment

- `goal-57` has accepted a loop design and activated `goal-58`.
- Source implementation creates at least one canonical loop fixture.

# Test Cases

- `mdkg new loop "<title>"` or the selected scaffold path creates a
  validation-clean loop node.
- `mdkg search "loop"` can find canonical loop nodes and seeded loop templates.
- `mdkg show <loop>` exposes purpose, scope, mode, lineage, status, linked
  goals/subgoals, and evidence refs.
- `mdkg loop list` and `mdkg loop show <loop> --json` return deterministic
  structured output.
- `mdkg pack <loop> --pack-profile concise --dry-run --stats` includes bounded
  loop context without bulky artifacts.
- Existing `goal`, `task`, `test`, and work-mirror discovery remains unchanged.

# Results / Evidence

Contract authored for `goal-58`.

This test node is complete for the planning pass because it defines the future
implementation acceptance contract. It is not evidence that `loop` source
behavior already exists.

# Notes / Follow-ups

- CocoIndex and semantic search are not part of this contract.
- Execute this contract after `goal-58` expands into source work.
