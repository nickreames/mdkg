---
id: dec-72
type: dec
title: Authorize local-only v0.5.0 backend CLI loop dogfood
status: accepted
tags: [loop, dogfood, backend, cli, approval]
owners: []
links: []
artifacts: []
relates: [loop-6]
refs: [goal-61, goal-60, goal-64]
aliases: []
created: 2026-07-10
updated: 2026-07-10
---
# Context

`loop-6` is the corrected backend/API/CLI bloat audit for `goal-61`. The loop
must establish its source boundary, cache authorization, compatibility-check
boundary, and optimization priority before execution.

# Decision

Answer the `loop-6` pre-run identities as follows:

- `scope_surface`: mdkg's public CLI families, parser/dispatcher, command
  descriptors and generated contract, backend graph/index modules, package
  scripts, and the tests that preserve those surfaces.
- `local_cache_writes_approved`: yes. Local builds, tests, generated references,
  and inventory commands may write caches or generated outputs.
- `external_compatibility_checks_approved`: no. Downstream repositories and
  external services remain outside this local read-only audit.
- `optimization_priority`: preserve compatibility first, then improve public
  CLI ergonomics, modular ownership, and descriptor-driven consistency.

All required evidence lanes can be completed from local source, generated
contracts, package proof, and regression tests; no lane waiver is accepted up
front.

# Alternatives considered

- Audit only `src/cli.ts`: rejected because command ownership also spans command
  modules, generators, package scripts, and tests.
- Optimize solely for fewer lines or fewer flags: rejected because raw size is
  not a sufficient design criterion and can damage compatibility.
- Use compatibility-first, source-grounded recommendations across the complete
  local command surface: selected.

# Consequences

- `loop-6` may inspect and test all local CLI/backend surfaces without making
  unrelated functional changes.
- Findings must distinguish proven behavior risk from maintainability pressure.
- Broader generic CLI redesign remains in `goal-60`; release mutations remain in
  `goal-64`.

# Links / references

- `loop-6`
- `goal-61`
- `goal-60`
- `goal-64`
