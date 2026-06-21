---
id: goal-19
type: goal
title: Complete mdkg 0.3.6 graph import hardening and local MCP workspace selection
status: done
priority: 2
goal_state: achieved
goal_condition: 0.3.6 is dry-run publish ready after graph import selected-goal activation is hardened and mdkg exposes a local read-only MCP server with explicit workspace and subgraph selection plus a documented future mutation boundary.
scope_refs: [epic-104, epic-95, epic-96, epic-97, task-410, task-411, task-412, test-178, test-179, spike-8, task-392, task-393, task-394, task-395, task-396, task-397, test-168, test-169, test-170]
last_active_node: task-397
required_skills: [pursue-mdkg-goal, verify-close-and-checkpoint]
required_checks: [npm run build, npm run test, npm run cli:check, npm run cli:contract, node dist/cli.js validate --json, npm run smoke:graph-clone, npm run smoke:mcp, npm run prepublishOnly, node scripts/assert-publish-ready.js, NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json, NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run, git diff --check]
max_iterations: 30
blocked_after_attempts: 3
tags: [release, 0.3.6, graph-import, mcp, workspace, subgraph]
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

Harden graph template import selected-goal behavior, then provide a safe local MCP entrypoint so orchestrators can inspect mdkg graphs and subgraphs without bypassing single-writer CLI ownership.

# End Condition

0.3.6 is dry-run publish ready after graph import selected-goal activation is hardened and mdkg exposes a local read-only MCP server with explicit workspace and subgraph selection plus a documented future mutation boundary.

# Non-Goals

- Do not enable broad mutating MCP tools in the first implementation.
- Do not make MCP responsible for filling out detailed node bodies.
- Do not replace the CLI as the canonical mutation surface.
- Do not republish `0.3.5`; the post-publish import hardening fix belongs to `0.3.6`.

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
- npm run smoke:mcp
- npm run prepublishOnly
- node scripts/assert-publish-ready.js
- NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json
- NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run
- git diff --check

# Acceptance Criteria

- `graph import-template --select-goal --apply` activates the rewritten imported start goal and pauses competing active local root goals.
- Importing a template start goal cannot leave multiple active root goals or partial invalid selected-goal state.
- MCP tools expose status, search, show, pack, and selected graph information read-only.
- Workspace and subgraph selection are explicit and root-contained.
- Mutation attempts are refused unless future allowlist work explicitly enables them.
- Security notes describe full CLI parity as a future path, not a current promise.

# Checkpoint Requirement

`task-397` must close with a checkpoint named `0.3.6 local MCP readiness`.

# Current State

The graph import selected-goal hardening prerequisite is complete and `goal-19` now routes back to the read-only MCP work from `spike-8`. The matching legacy deferred-execution roadmap remains historical context.

# Release Boundary

No real npm publish, git tag, git push, website deploy, or child-repo mutation is included unless separately requested.

# Iteration Log

- 2026-06-16: Created during versioned future-goal alignment pass.
- 2026-06-17: Folded the post-publish `0.3.5` graph import selected-goal hardening gap into the `0.3.6` lane before local MCP work.

# Completion Evidence

- 2026-06-17: `epic-104` completed the `graph import-template --select-goal --apply` hardening prerequisite with `task-410`, `task-411`, `task-412`, `test-178`, and `test-179` closed. Remaining `goal-19` work starts at `spike-8` for local MCP security and workspace selection.
