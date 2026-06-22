---
tags: [mdkg-dev, docs, site, examples, launch-readiness]
owners: []
links: []
artifacts: []
relates: [task-455, test-206]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: [chk-185]
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
scope_refs: [epic-122, epic-123, epic-124, epic-125, epic-126, spike-14, task-455, task-445, task-446, task-447, task-448, task-449, task-450, task-451, task-452, task-453, task-454, test-206, test-200, test-201, test-202, test-203, test-204, test-205]
required_skills: [select-work-and-ground-context, verify-close-and-checkpoint]
required_checks: [npm run build, npm run test, npm run cli:check, npm run cli:contract, node dist/cli.js validate --json, npm run smoke:command-docs, npm run smoke:mdkg-dev, npm run smoke:mdkg-dev-docs, npm run smoke:mdkg-dev-seo, npm run smoke:demo-graph, npm run prepublishOnly, node scripts/assert-publish-ready.js, NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json, NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
---
# Objective

Build the canonical mdkg.dev implementation inside this repo using the split source layout from dec-30: `/mdkg-dev` for the Astro static site, `/docs` for repo-first GitBook documentation source, and `/examples` for demo repos and template graphs.

# End Condition

This goal is achieved when mdkg.dev is pre-release ready: the static site builds, public alpha docs exist, generated command docs are checked for drift, demo/template graphs validate, subgraphs are registered only after their graphs are valid, and launch-readiness smokes pass. The final closeout must explicitly state that no production deploy, public launch, DNS change, Vercel promotion, npm publish, tag, or push occurred unless separately requested.

# Product Launch Outcome

A first-time developer should be able to land on mdkg.dev, understand that mdkg is git-native project memory for AI-native software engineering, install it, run the first commands, trust the local-first posture, and choose GitHub/docs/npm next steps without needing to understand every advanced queue, subgraph, MCP, archive, or project DB capability.

# Non-Goals

- No real public launch, production deploy, DNS change, tag, push, npm publish, analytics activation, GitBook production configuration, or Vercel production promotion.
- No claim that mdkg provides public worker execution, hosted queues, arbitrary SQL, public event/reducer/lease/materializer CLI, comprehensive secret scanning, hosted memory, or autonomous execution.
- No child repo mutation except the in-repo examples created under `/examples`.
- No generated docs or public pages that quote private graph details, raw prompts, provider payloads, local absolute paths, secrets, or unpublished private notes.

# Execution Phases

1. Research and boundary lock: complete `spike-14` and `task-445`; verify package manager, install commands, GitHub/npm URLs, Astro/GitBook/Vercel assumptions, existing `/docs` state, npm package exclusion boundaries, and script wiring.
2. Site/design foundation: complete `task-446`; scaffold the Astro static site, `mdkg-dev/DESIGN.md`, tokens, components, required routes, and static render proof.
3. Docs/reference foundation: complete `task-447` and `task-448`; create GitBook-ready `/docs` source, repo-first sync policy, generated command-reference pipeline, and drift checks.
4. Public alpha content: complete `task-449`; author homepage, quickstart, trust, alpha, `llms.txt`, robots, sitemap, metadata, copy bank, and claims evidence matrix.
5. Demo/subgraph dogfood: complete `task-450` and `task-451`; create example/template graphs, prove goal-only agent starts, and register subgraphs only after nested graphs validate.
6. Launch gates: complete `task-452` and `task-453`; add no-secret, link, metadata, accessibility, static render, docs, SEO, demo graph, and publish-readiness checks.
7. Closeout: complete `task-454`; record evidence, remaining manual launch steps, and a handoff while preserving the no-launch boundary.

# Required Route Inventory

Minimum mdkg.dev routes:

- `/` homepage
- `/quickstart`
- `/trust`
- `/alpha`
- `/docs` link or redirect page to the future docs host
- `/llms.txt`
- `/robots.txt`
- `/sitemap.xml`

Optional routes if they can be polished and correctly indexed/noindexed:

- `/design`
- `/claims`
- `/changelog`

# Required Docs Inventory

Minimum `/docs` source:

- `README.md`
- `quickstart.md`
- `safety.md`
- `alpha.md`
- `concepts/README.md`
- `concepts/source-of-truth.md`
- `concepts/repository-layout.md`
- `concepts/goals-tasks-spikes-checkpoints.md`
- `concepts/packs.md`
- `concepts/handoffs.md`
- `concepts/skills.md`
- `concepts/index-vs-project-db.md`
- `guides/agent-golden-loop.md`
- `guides/create-a-research-spike.md`
- `guides/create-a-handoff.md`
- `reference/README.md`
- `reference/cli.md` generated or generated-entrypoint backed by command contract
- `advanced-alpha/project-db-and-queues.md`
- `advanced-alpha/subgraphs.md`
- `advanced-alpha/mcp.md`

Existing docs under `/docs` must be preserved, migrated deliberately, or linked from the new docs index. They must not be silently overwritten.

# Context Reference Inventory

These records are required planning context for goal-25, but they are listed in body text rather than goal-level `context_refs` because the current CLI treats non-actionable design nodes as traversal warnings during `goal next` and `pack`:

- prd-4
- prd-5
- edd-24
- edd-25
- edd-26
- edd-27
- mdkg.dev visual design system tokens components and diagram contract
- mdkg.dev public claims SEO metadata and launch measurement contract
- mdkg.dev quality accessibility performance and no-secret gate contract
- dec-30
- GitBook repo-first docs sync and ownership policy
- Vercel readiness preview analytics and no-production-launch boundary
- archive://archive.mdkg-dev-planning-docs-2026-06-22

# Checkpoint Requirements

Goal-25 cannot close unless checkpoints exist for:

- Boundary/tooling decision after `spike-14` and `task-445`.
- Site/design scaffold after `task-446` and the visual design system contract.
- Docs/generated-reference proof after `task-447` and `task-448`.
- Public copy/claims/trust proof after `task-449`.
- Demo/subgraph proof after `task-450` and `task-451`.
- Launch-smoke proof after `task-452`.
- Final pre-release closeout after `task-454`.

Each checkpoint must record commands run, pass/fail state, route/docs inventory, known warnings, changed surfaces, stop-condition confirmation, and follow-up refs.

# Required Checks

- npm run build
- npm run test
- npm run cli:check
- npm run cli:contract
- node dist/cli.js validate --json
- npm run smoke:command-docs
- npm run smoke:mdkg-dev
- npm run smoke:mdkg-dev-docs
- npm run smoke:mdkg-dev-seo
- npm run smoke:demo-graph
- npm run prepublishOnly
- node scripts/assert-publish-ready.js
- NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json
- NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run
- git diff --check

# Acceptance Criteria

- `/mdkg-dev` is an Astro static-site subproject with static render/build proof and restrained developer-tool visual design.
- `/docs` is the canonical GitBook source with quickstart, concepts, safety, alpha, and generated reference entrypoints.
- Command reference pages are generated from the mdkg command contract and protected by drift checks.
- `/examples` contains demo/template graphs that can be imported, validated, and used for goal-only agent starts.
- Root graph subgraph registration uses root-qualified qids after each subproject graph is valid.
- Public-alpha pages include safety boundaries, origin story, LLM-friendly docs, sitemap/metadata, social cards or explicit placeholders, and no-secret evidence.
- A claims evidence matrix maps public claims to shipped behavior or explicit caveats.
- README, site, docs, and command matrix launch claims agree on install, alpha status, core loop, and deferred capability boundaries.

# Stop Conditions

- This goal has not been explicitly activated by the user.
- Implementation would require public deploy, DNS change, tag, push, npm publish, GitBook production config, analytics activation, or Vercel production promotion.
- Public copy would over-claim deferred mdkg capabilities.
- Generated docs, no-secret checks, link checks, metadata checks, or subgraph validation fail.
- A required install command, URL, version reference, or launch claim cannot be verified.

# Current State

Paused. goal-24 is closed, and this goal is ready for a future implementation run after the current graph-hardening commit. `goal next goal-25` should continue to route to `spike-14`.

# Iteration Log

- 2026-06-22: Seeded as the future implementation goal from the mdkg.dev planning ingestion pass.
- 2026-06-22: Hardened with launch handoff requirements, design/SEO/quality decisions, detailed execution phases, checkpoint contract, and explicit no-launch boundaries.

# Skill Improvement Candidates

- Consider a future mdkg skill for public-docs launch gates using generated command contracts, no-secret checks, claim evidence, metadata checks, and launch closeout.

# Completion Evidence

Pending future implementation.
