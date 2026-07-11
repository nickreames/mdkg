---
id: prop-5
type: prop
title: Decompose loop command internals before broader descriptor rollout
tags: [loop, cli, modularity, proposal, dogfood]
owners: []
links: []
artifacts: [src/commands/loop.ts:2035-lines, src/cli.ts:3677-lines, dist/command-contract.json:116-commands]
relates: [loop-6, goal-60]
refs: [loop-6, goal-60, prop-4, task-728, test-399, goal-59]
aliases: []
created: 2026-07-10
updated: 2026-07-10
---
# Summary

Decompose the 2,035-line loop command module into template/provenance,
fork/materialization, readiness, routing, and thin command-adapter boundaries
without changing public commands or JSON. Use the result as evidence for
`goal-60`, not as permission to begin the generic CLI redesign immediately.

# Motivation

The descriptor pilot succeeded, but `src/commands/loop.ts` became mdkg's largest
command module. It currently owns several algorithms with different mutation,
validation, and testing concerns. Copying that shape to other descriptor-backed
families would replace metadata drift with module-level coupling.

The current regression baseline is strong: 572 tests, generated help/contract
checks, and installed SQLite smoke for all seven seeds. This is the right time
to define internal boundaries while behavior is well specified.

# Proposal

Recommended sequence:

1. Write an ownership map and dependency direction in `task-728`.
2. Extract pure readiness/identity and routing logic first.
3. Extract template/provenance resolution and fork planning/writes next.
4. Keep `runLoopListCommand`, `runLoopShowCommand`, `runLoopForkCommand`,
   `runLoopPlanCommand`, `runLoopNextCommand`, and `runLoopRunsCommand` stable.
5. Run `test-399` plus existing descriptor, dry-run, provenance, pack, init,
   upgrade, and tarball smoke gates after each extraction.

Candidate module boundaries:

- template catalog and provenance resolution;
- fork planning, ID allocation, materialization, and mutation receipts;
- readiness requirement/binding projection;
- next-lane routing and blocker exhaustion;
- text/JSON command adapters.

# Impact

- Smaller review surfaces and clearer read-only versus mutation ownership.
- Reusable pure readiness/routing functions for future generic design work.
- No command-name, flag, JSON-envelope, template, or graph-schema change.
- Better evidence for choosing descriptor rollout order in `goal-60`.

# Risks

- Moving code can create subtle output-order or JSON-shape drift. Require exact
  focused and generated-contract gates after each step.
- Premature generic abstractions could couple goal/work/loop semantics. Keep
  extracted modules loop-owned until `goal-60` accepts a shared contract.
- Splitting only by file size can worsen cohesion. Boundaries must follow
  algorithms and side-effect ownership, not arbitrary line targets.

# Alternatives

- Option 1: incremental loop-owned decomposition with exact parity. Recommended.
- Option 2: build the generic descriptor/router framework first. Defer until
  `goal-60` resolves generic semantics and migration order.
- Option 3: retain the monolith and rely on tests. Lowest immediate effort, but
  leaves poor precedent and a growing review surface.

# Next Steps

- Keep `goal-60` paused until explicit operator activation.
- Add `task-728` and `test-399` as source-grounded planning inputs to `goal-60`.
- Do not make this decomposition a v0.5.0 publish blocker unless a later audit
  finds an actual behavior or safety defect in the module boundary.
