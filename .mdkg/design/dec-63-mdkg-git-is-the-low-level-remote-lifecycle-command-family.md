---
id: dec-63
type: dec
title: mdkg git is the low-level remote lifecycle command family
status: accepted
tags: [0.4.2, git, remote-git, command-surface]
owners: []
links: []
artifacts: []
relates: []
refs: [goal-52, goal-51, task-650, test-338]
aliases: []
created: 2026-07-05
updated: 2026-07-05
---
# Context

`goal-52` needs to own direct remote Git lifecycle behavior for agent state and
context engineering. The public command surface should be explicit and low
level enough that users understand mdkg is wrapping Git operations, not hiding a
runtime-specific policy layer.

# Decision

Use `mdkg git` as the v1 public command family for generic remote lifecycle
primitives.

The first implementation lane should plan clone, fetch, inspect/status,
closeout, push-readiness, and explicit-authority push behavior under this
family. The system Git CLI is the v1 execution backend. mdkg is responsible for
validation, graph/source descriptors, accepted revision evidence, closeout
receipts, push-readiness gates, and public-safe output.

# Alternatives considered

- `mdkg remote`: clearer for source descriptors, but less explicit that the
  command performs Git operations.
- Runtime-owned Git execution only: rejected because mdkg needs a generic
  origin-to-origin lifecycle for ephemeral agent work.
- New project-memory query namespace in this release: deferred to `goal-53`.

# Consequences

- CLI docs and generated references should present `mdkg git` as low-level.
- Downstream runtimes can call `mdkg git` but own their orchestration policy.
- `mdkg git` receipts must be refs-first and safe to commit.

# Links / references

- `goal-52`
- `task-654`
- `task-656`
