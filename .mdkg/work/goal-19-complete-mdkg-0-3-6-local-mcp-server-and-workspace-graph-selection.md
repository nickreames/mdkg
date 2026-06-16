---
id: goal-19
type: goal
title: Complete mdkg 0.3.6 local MCP server and workspace graph selection
status: todo
priority: 2
goal_state: paused
goal_condition: 0.3.6 is dry-run publish ready after mdkg exposes a local read-only MCP server with explicit workspace and subgraph selection plus a documented future mutation boundary.
scope_refs: [epic-95, epic-96, epic-97, spike-8, task-392, task-393, task-394, task-395, task-396, task-397, test-168, test-169, test-170]
active_node: spike-8
required_skills: [pursue-mdkg-goal, verify-close-and-checkpoint]
required_checks: [npm run build, npm run test, npm run cli:check, npm run cli:contract, node dist/cli.js validate --json, npm run smoke:mcp, npm run prepublishOnly, node scripts/assert-publish-ready.js, NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json, NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run, git diff --check]
max_iterations: 30
blocked_after_attempts: 3
tags: [release, 0.3.6, mcp, workspace, subgraph]
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

Provide a safe local MCP entrypoint so orchestrators can inspect mdkg graphs and subgraphs without bypassing single-writer CLI ownership.

# End Condition

0.3.6 is dry-run publish ready after mdkg exposes a local read-only MCP server with explicit workspace and subgraph selection plus a documented future mutation boundary.

# Non-Goals

- Do not enable broad mutating MCP tools in the first implementation.
- Do not make MCP responsible for filling out detailed node bodies.
- Do not replace the CLI as the canonical mutation surface.

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
- npm run smoke:mcp
- npm run prepublishOnly
- node scripts/assert-publish-ready.js
- NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json
- NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run
- git diff --check

# Acceptance Criteria

- MCP tools expose status, search, show, pack, and selected graph information read-only.
- Workspace and subgraph selection are explicit and root-contained.
- Mutation attempts are refused unless future allowlist work explicitly enables them.
- Security notes describe full CLI parity as a future path, not a current promise.

# Checkpoint Requirement

`task-397` must close with a checkpoint named `0.3.6 local MCP readiness`.

# Current State

Paused until clone and import workflows clarify root graph and subgraph selection behavior. The matching legacy deferred-execution roadmap remains historical context until archived support ships.

# Release Boundary

No real npm publish, git tag, git push, website deploy, or child-repo mutation is included unless separately requested.

# Iteration Log

- 2026-06-16: Created during versioned future-goal alignment pass.

# Completion Evidence

- Pending.
