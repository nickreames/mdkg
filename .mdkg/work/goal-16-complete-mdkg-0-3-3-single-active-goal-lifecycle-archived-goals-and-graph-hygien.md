---
id: goal-16
type: goal
title: Complete mdkg 0.3.3 single active goal lifecycle archived goals and graph hygiene
status: done
priority: 1
goal_state: achieved
goal_condition: 0.3.3 is dry-run publish ready after goal activate enforces one active root goal, archived goals are historical and non-actionable, superseded legacy goals can be archived safely, and graph hygiene checks are clean.
scope_refs: [epic-85, epic-86, epic-87, epic-88, task-372, task-373, task-374, task-375, task-376, task-377, task-378, task-379, test-158, test-159, test-160, test-161]
last_active_node: task-379
required_skills: [pursue-mdkg-goal, verify-close-and-checkpoint]
required_checks: [npm run build, npm run test, npm run cli:check, npm run cli:contract, node dist/cli.js validate --json, npm run prepublishOnly, node scripts/assert-publish-ready.js, NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json, NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run, git diff --check]
max_iterations: 30
blocked_after_attempts: 3
tags: [release, 0.3.3, goal-lifecycle, archived-goals, graph-hygiene]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Objective

Implement single-active-goal lifecycle safety, introduce an archived legacy-goal state, and clean stale graph hygiene so future release goals route deterministically.

# End Condition

0.3.3 is dry-run publish ready after goal activate enforces one active root goal, archived goals are historical and non-actionable, superseded legacy goals can be archived safely, and graph hygiene checks are clean.

# Non-Goals

- Do not implement ID repair apply, graph clone/import, MCP, live demo deployment, or mdkg.dev site work in 0.3.3.
- Do not manually mark legacy goals archived before the CLI/schema supports archived status/state.
- Do not publish, tag, push, or mutate child repos.

# Recursive Algorithm

1. Inspect current graph, release boundary, selected goal, and scoped nodes.
2. Run or complete the active research spike when present, then claim one implementation task at a time.
3. Keep mutation receipts, test evidence, and checkpoint notes on scoped nodes.
4. Run the required release gates up to dry-run pack and dry-run publish only.
5. Close the goal only after scoped tests and closeout checkpoint are complete.

# Required Checks

- npm run build
- npm run test
- npm run cli:check
- npm run cli:contract
- node dist/cli.js validate --json
- npm run prepublishOnly
- node scripts/assert-publish-ready.js
- NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json
- NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run
- git diff --check

# Acceptance Criteria

- `mdkg goal activate` or the selected command path prevents multiple active root goals.
- Subgraphs remain independently valid and may maintain their own active goal internally.
- `archived` legacy goals are readable, searchable with explicit filters, valid as refs, and excluded from default actionable routing.
- `goal-11`, `goal-12`, and `goal-15` are archived only after support exists and include supersession links.
- A temp-repo smoke proves routing, archive behavior, and strict doctor hygiene.
- Dry-run pack and publish report the 0.3.3 candidate without real publishing.

# Checkpoint Requirement

`task-379` must close with `mdkg task done task-379 --checkpoint "0.3.3 goal lifecycle and archived roadmap readiness"` before `goal-16` is marked done.

# Current State

Achieved. The 0.3.3 release candidate is dry-run publish ready; no real publish, tag, push, deploy, or child-repo mutation was performed.

# Release Boundary

No real npm publish, git tag, git push, website deploy, or child-repo mutation is included unless separately requested.

# Iteration Log

- 2026-06-16: Created during versioned future-goal alignment pass.

# Completion Evidence

- Scoped work completed:
  - `task-372` / `test-158`: versioned roadmap alignment and routing contract.
  - `task-373`: `goal activate` semantics and single-active design.
  - `task-374` / `test-159` / `test-160`: implementation and tests for single active local root goals with independent imported subgraph goals.
  - `task-375`: archived goal status/state support and command/docs updates.
  - `task-376` / `test-161`: archived `goal-11`, `goal-12`, and `goal-15` after support existed and verified archived legacy behavior.
  - `task-377`: active-chain blocker and strict doctor hygiene cleanup.
  - `task-378`: packed `smoke:goal-lifecycle` and prepublish gate.
  - `task-379`: 0.3.3 RC closeout with required checkpoint `chk-142`.
- Release-candidate evidence:
  - Source version is `0.3.3` in `package.json`, `package-lock.json`, and package-lock root metadata.
  - `CHANGELOG.md` includes `0.3.3 - 2026-06-16`.
  - `npm run build` passed with command contract hash `be42c29b89c1c3e3d059a8f9cbc564908d4dd694d848cf3d1b1800e8b30705e5`.
  - `npm run test` passed: 475 tests, 0 failures.
  - `npm run cli:check`, `npm run cli:contract`, `node dist/cli.js validate --json`, `npm run prepublishOnly`, `node scripts/assert-publish-ready.js`, and `git diff --check` passed.
  - `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json` reported `mdkg@0.3.3`, `mdkg-0.3.3.tgz`, shasum `756397498e9247660b32fe9b2028df162995bb54`, unpacked size `1507598`, and 159 package files.
  - `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run` passed and reported `+ mdkg@0.3.3`.
- Release boundary honored:
  - No real `npm publish`.
  - No git tag.
  - No git push.
  - No deploy.
  - No child repo mutation.

# Related Roadmap Goals

- Legacy paused roadmap goals and later versioned release goals were created or linked in this alignment pass.
- Keep exact legacy and replacement goal identifiers on the replacement nodes and legacy supersession notes instead of this active goal body, because current goal traversal treats goal-like refs here as non-actionable scope warnings.
