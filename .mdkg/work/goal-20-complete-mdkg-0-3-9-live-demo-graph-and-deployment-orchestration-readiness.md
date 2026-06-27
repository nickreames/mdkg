---
id: goal-20
type: goal
title: Complete mdkg 0.3.9 live demo graph and deployment orchestration readiness
status: archived
priority: 2
goal_state: archived
goal_condition: 0.3.9 is dry-run publish ready after live demo template graphs can drive preview deployments, durable demo subdomains, teardown, and promotion without destabilizing canonical mdkg.dev SEO.
scope_refs: [epic-98, epic-99, epic-100, spike-9, task-398, task-399, task-400, task-401, task-402, task-403, test-171, test-172, test-173]
last_active_node: spike-9
required_skills: [pursue-mdkg-goal, verify-close-and-checkpoint]
required_checks: [npm run build, npm run test, npm run cli:check, npm run cli:contract, node dist/cli.js validate --json, npm run smoke:demo-graph, npm run prepublishOnly, node scripts/assert-publish-ready.js, NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json, NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run, git diff --check]
max_iterations: 30
blocked_after_attempts: 3
tags: [release, 0.3.9, demo, vercel, mdkg-dev]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [chk-283]
evidence_refs: [chk-283]
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-26
---
# Objective

Prepare mdkg for live agent-coding demos where a cloned template graph can drive a one-shot website build and preview deployment.

# End Condition

0.3.9 is dry-run publish ready after live demo template graphs can drive preview deployments, durable demo subdomains, teardown, and promotion without destabilizing canonical mdkg.dev SEO.

# Non-Goals

- Do not swap the canonical mdkg.dev site for disposable demos.
- Do not deploy without explicit approval.
- Do not depend on hidden chat context for demo start state.

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
- npm run smoke:demo-graph
- npm run prepublishOnly
- node scripts/assert-publish-ready.js
- NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json
- NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run
- git diff --check

# Acceptance Criteria

- website-template-mdkg has an ambitious umbrella goal and scoped subnodes for the demo.
- Preview deployment handoff is explicit and testable.
- Durable `demo-N.mdkg.dev` promotion is designed separately from preview URLs.
- Rejected demos have noindex, trash, and teardown guidance.
- Handoff prompts let an agent start from one selected goal with minimal extra context.

# Checkpoint Requirement

`task-403` must close with a checkpoint named `0.3.9 live demo orchestration readiness`.

# Current State

Paused until 0.3.8 warning-scale diagnostics and multi-repo UX hardening is complete.

Archived on 2026-06-26 by `chk-283`. The goal's demo/Vercel scope was too
narrow and stale for the next `0.3.9` release lane after the real `0.3.8`
publish. Replacement ownership is split:

- `goal-41` owns the `0.3.9` CLI/kernel extensibility and release-polish lane.
- `goal-42` owns public examples, demo proof, and mdkg.dev/docs launch polish.

# Release Boundary

No real npm publish, git tag, git push, website deploy, or child-repo mutation is included unless separately requested.

# Iteration Log

- 2026-06-16: Created during versioned future-goal alignment pass.
- 2026-06-21: Retargeted from 0.3.7 to 0.3.9 because 0.3.7 shipped and 0.3.8 is now the warning-scale diagnostics hardening lane.

# Completion Evidence

- Superseded by `goal-41` and `goal-42`; see `chk-283`.
