---
id: goal-18
type: goal
title: Complete mdkg 0.3.5 graph clone fork and template import workflows
status: done
priority: 2
goal_state: achieved
goal_condition: 0.3.5 is dry-run publish ready after mdkg can clone or fork complete graphs across repos, import templates into the same repo with safe ID rewrites, and dogfood website-template-mdkg bootstrap planning.
scope_refs: [epic-92, epic-93, epic-94, spike-7, task-386, task-387, task-388, task-389, task-390, task-391, test-165, test-166, test-167]
last_active_node: task-391
required_skills: [pursue-mdkg-goal, verify-close-and-checkpoint]
required_checks: [npm run build, npm run test, npm run cli:check, npm run cli:contract, node dist/cli.js validate --json, npm run smoke:graph-clone, npm run prepublishOnly, node scripts/assert-publish-ready.js, NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json, NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run, git diff --check]
max_iterations: 30
blocked_after_attempts: 3
tags: [release, 0.3.5, graph-clone, templates, subgraph]
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
updated: 2026-06-17
---
# Objective

Make whole-graph cloning, forking, and template import safe enough for agent demo templates and downstream planning workflows.

# End Condition

0.3.5 is dry-run publish ready after mdkg can clone or fork complete graphs across repos, import templates into the same repo with safe ID rewrites, and dogfood website-template-mdkg bootstrap planning.

# Non-Goals

- Do not rewrite IDs when preserving a graph in a separate repository.
- Do not allow same-repo imports without deterministic ID and link rewriting.
- Do not start website implementation here.

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
- npm run smoke:graph-clone
- npm run prepublishOnly
- node scripts/assert-publish-ready.js
- NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json
- NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run
- git diff --check

# Acceptance Criteria

- Separate-repo clone preserves IDs and graph validity.
- Same-repo template import rewrites IDs and all links deterministically.
- Template import can select a starting goal for demos.
- Existing subgraph sync/materialize surfaces are accounted for rather than reintroduced as new commands.
- website-template-mdkg dogfood planning exists without mutating another repo.

# Checkpoint Requirement

`task-391` must close with a checkpoint named `0.3.5 graph clone template import readiness`.

# Current State

Paused until branch-safe ID repair exists. The matching legacy roadmap goal remains historical context until archived support ships.

# Release Boundary

No real npm publish, git tag, git push, website deploy, or child-repo mutation is included unless separately requested.

# Iteration Log

- 2026-06-16: Created during versioned future-goal alignment pass.
- 2026-06-17: Completed graph template/fork UX research, implemented graph clone/fork/import-template, validated subgraph boundary preservation, prepared 0.3.5 RC metadata, and completed dry-run publish readiness.

# Completion Evidence

- `spike-7`, `task-386` through `task-391`, and `test-165` through `test-167` are complete.
- Checkpoints: `chk-153`, `chk-154`, `chk-155`, `chk-156`, `chk-157`, `chk-158`, `chk-159`, `chk-160`, `chk-161`, and `chk-162`.
- `npm run build`, `npm run test`, `npm run cli:check`, `npm run cli:contract`, `node dist/cli.js validate --json`, `npm run smoke:graph-clone`, `npm run prepublishOnly`, `node scripts/assert-publish-ready.js`, `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`, `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run`, and `git diff --check` all passed.
- `npm pack --dry-run --json` reported `mdkg@0.3.5`, tarball `mdkg-0.3.5.tgz`, shasum `a8c23d41988f030d377b81231281b658281cf20e`, and `160` files.
- `npm publish --dry-run` completed with `+ mdkg@0.3.5`.
- No real npm publish, git tag, git push, global install, website deploy, or downstream repo mutation was performed.
