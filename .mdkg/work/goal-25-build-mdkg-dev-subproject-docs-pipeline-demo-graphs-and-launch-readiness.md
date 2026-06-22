---
tags: [mdkg-dev, docs, site, examples, launch-readiness]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: [mdkg-dev-implementation-roadmap]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-06-22
updated: 2026-06-22
id: goal-25
type: goal
title: Build mdkg.dev subproject docs pipeline demo graphs and launch readiness
status: todo
priority: 1
goal_state: paused
active_node: spike-14
goal_condition: The in-repo mdkg.dev split-source implementation is pre-release ready after the Astro site, GitBook docs source, generated docs pipeline, examples/template graphs, subgraph registration, launch smokes, and no-secret checks pass without public launch or deploy.
scope_refs: [epic-122, epic-123, epic-124, epic-125, epic-126, spike-14, task-445, task-446, task-447, task-448, task-449, task-450, task-451, task-452, task-453, task-454, test-200, test-201, test-202, test-203, test-204, test-205]
required_skills: [select-work-and-ground-context, verify-close-and-checkpoint]
required_checks: [npm run build, npm run test, npm run cli:check, npm run cli:contract, node dist/cli.js validate --json, npm run smoke:command-docs, npm run smoke:mdkg-dev, npm run smoke:demo-graph, npm run prepublishOnly, node scripts/assert-publish-ready.js, NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json, NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
---
# Objective

Build the canonical mdkg.dev implementation inside this repo using a split source layout: /mdkg-dev for the Astro static site, /docs for GitBook documentation source, and /examples for demo repos and template graphs.

# End Condition

This goal is achieved when the mdkg.dev subproject, docs source, generated command-reference pipeline, demo/template graphs, subgraph registration, public-alpha content, and launch-readiness smokes are implemented and validated through pre-release checks. It must stop before real publish, deploy, tag, push, DNS change, Vercel production promotion, or public launch unless explicitly requested later.

# Non-Goals

- No real public launch, production deploy, DNS change, tag, push, or npm publish.
- No claims that mdkg provides public worker execution, hosted queues, arbitrary SQL, public event/reducer/lease/materializer CLI, or comprehensive secret scanning.
- No child repo mutation except explicitly created in-repo examples under /examples.

# Recursive Algorithm

1. Research implementation risks and choose concrete tooling boundaries.
2. Scaffold /mdkg-dev, /docs, and /examples only after goal-24 is closed.
3. Generate command documentation from canonical command contracts, not hand-maintained command tables.
4. Author public-alpha content from canonical mdkg graph nodes and shipped capabilities.
5. Add demo/template graph proof and subgraph registration only after the examples have valid graphs.
6. Run launch-readiness smokes, no-secret checks, prepublish dry-runs, and close with a handoff.

# Required Skills

- select-work-and-ground-context
- verify-close-and-checkpoint

# Required Checks

- npm run build
- npm run test
- npm run cli:check
- npm run cli:contract
- node dist/cli.js validate --json
- npm run smoke:command-docs
- npm run smoke:mdkg-dev
- npm run smoke:demo-graph
- npm run prepublishOnly
- node scripts/assert-publish-ready.js
- NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json
- NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run
- git diff --check

# Acceptance Criteria

- /mdkg-dev is an Astro static-site subproject with build/test proof.
- /docs is the canonical GitBook source with quickstart, concepts, safety, and generated reference entrypoints.
- Command reference pages are generated from the mdkg command contract and protected by drift checks.
- /examples contains demo/template graphs that can be imported, validated, and used for goal-only agent starts.
- Root graph subgraph registration uses root-qualified qids after each subproject graph is valid.
- Public-alpha pages include safety boundaries, origin story, LLM-friendly docs, sitemap/metadata, and no-secret evidence.

# Definition Of Done

- All scoped implementation nodes are done or intentionally deferred with replacement refs.
- Required checks have current evidence.
- Public launch remains gated and explicit.

# Stop Conditions

- goal-24 has not closed.
- Implementation would require public deploy, DNS change, tag, push, publish, or production promotion.
- Public copy would over-claim deferred mdkg capabilities.
- No-secret, generated-docs, or subgraph validation checks fail.

# Current State

Paused. This goal was seeded by goal-24 from the committed planning bundle and should not be executed until explicitly activated.

# Iteration Log

- 2026-06-22: Seeded as the future implementation goal from the mdkg.dev planning ingestion pass.

# Skill Improvement Candidates

- Consider a future mdkg skill for public-docs launch gates using generated command contracts and no-secret content checks.

# Completion Evidence

Pending future implementation.
