---
id: goal-21
type: goal
title: Complete mdkg 0.4.0 canonical mdkg.dev launch readiness
status: todo
priority: 2
goal_state: paused
goal_condition: 0.4.0 is launch ready after canonical mdkg.dev docs, generated command reference, SEO-oriented guides, trust posture, public examples, and downstream upgrade narratives are validated.
scope_refs: [epic-101, epic-102, epic-103, spike-10, task-404, task-405, task-406, task-407, task-408, task-409, test-174, test-175, test-176, test-177]
active_node: spike-10
required_skills: [pursue-mdkg-goal, verify-close-and-checkpoint]
required_checks: [npm run build, npm run test, npm run cli:check, npm run cli:contract, node dist/cli.js validate --json, npm run smoke:mdkg-dev, npm run prepublishOnly, node scripts/assert-publish-ready.js, NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json, NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run, git diff --check]
max_iterations: 30
blocked_after_attempts: 3
tags: [release, 0.4.0, mdkg-dev, docs, seo, launch]
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

Launch canonical mdkg.dev as stable public documentation, marketing, and LLM-optimized onboarding without mixing it with disposable demos.

# End Condition

0.4.0 is launch ready after canonical mdkg.dev docs, generated command reference, SEO-oriented guides, trust posture, public examples, and downstream upgrade narratives are validated.

# Non-Goals

- Do not launch before generated command docs and examples have drift prevention.
- Do not expose secrets or local-only absolute paths in public docs.
- Do not promise deferred worker execution or public internal DB helper CLIs.

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
- npm run smoke:mdkg-dev
- npm run prepublishOnly
- node scripts/assert-publish-ready.js
- NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json
- NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run
- git diff --check

# Acceptance Criteria

- Canonical docs IA is grounded in spike evidence and generated command metadata.
- Command docs and examples are generated or smoke-tested to prevent drift.
- Security and trust pages explain local-first storage, no-secret posture, dry-run boundaries, and subgraph safety.
- Downstream upgrade narratives are practical and explicit.
- Final launch gate includes no-secret and public-example temp-repo evidence.

# Checkpoint Requirement

`task-409` must close with a checkpoint named `0.4.0 mdkg.dev launch readiness`.

# Current State

Paused until spike dogfooding, generated docs, and demo readiness mature. The matching legacy mdkg.dev launch roadmap remains historical context until archived support ships.

# Release Boundary

No real npm publish, git tag, git push, website deploy, or child-repo mutation is included unless separately requested.

# Iteration Log

- 2026-06-16: Created during versioned future-goal alignment pass.

# Completion Evidence

- Pending.
