---
id: goal-1
type: goal
title: Build a complete differentiated website demo from the canonical mdkg template
status: todo
priority: 1
goal_state: active
goal_condition: A complete, local, differentiated static Astro website demo is built from this template with zero client-side JavaScript, follows the Ocean Flow design system, records the creative direction and validation evidence, and closes with a recommendation to discard, rework, or return the accepted candidate for a separately authorized integration decision.
scope_refs: [epic-1, spike-1, task-1, test-1]
active_node: spike-1
required_skills: [select-work-and-ground-context, verify-close-and-checkpoint]
required_checks: [mdkg validate --json, mdkg index, mdkg goal next goal-1 --json, mdkg pack spike-1 --profile concise --dry-run --stats]
max_iterations: 25
blocked_after_attempts: 3
tags: [demo, website, template, astro, static, zero-javascript, creative-production]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [prd-2]
context_refs: [prd-2, edd-1, dec-1, dec-2]
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-06-29
updated: 2026-07-26
---
# Objective

Build a complete website candidate from this forked mdkg graph. The result
should feel like a differentiated demo run, not a clone of a prior mdkg.dev
page, while preserving the Ocean Flow system, source-backed mdkg claims, and
safe local-first boundaries.

# End Condition

The goal is achieved when:

- the creative direction is recorded in `spike-1`;
- the website implementation task has produced a locally inspectable static
  Astro site with zero client-side JavaScript or a clear blocked receipt;
- `test-1` records validation evidence for build, responsive rendering,
  accessibility, route completeness, zero client JavaScript, budgets,
  no-secret posture, and public-claims safety;
- a checkpoint states whether this run should be discarded, reworked, or handed
  back to the caller for a separate integration decision.

# Non-Goals

- Do not integrate, commit, deploy, push, publish, change DNS, activate
  analytics, or create provider resources from this template by default.
- Do not store raw prompts, secrets, provider payloads, credentials, or private
  repo context.
- Do not treat the generated site as published or durable hosting.

# Recursive Algorithm

1. Read `README.md`, `WEBSITE_DEMO_TEMPLATE_BRIEF.md`, `DESIGN.md`, `prd-2`,
   `dec-1`, `dec-2`, and `edd-1`.
2. Use `mdkg goal next goal-1 --json` to select the current node.
3. Use `mdkg pack <node> --profile concise --dry-run --stats` before acting.
4. Complete `spike-1` with the audience, offer, structure, and creative
   direction.
5. Complete `task-1` with the local website implementation or a clear blocker.
6. Complete `test-1` with validation evidence.
7. Close with a checkpoint recommending discard, rework, or caller-owned
   integration.

# Required Skills

- `select-work-and-ground-context`
- `verify-close-and-checkpoint`
- optional plugin path: `creative-production:explore`

# Required Checks

- `mdkg validate --json`
- `mdkg index`
- `mdkg goal next goal-1 --json`
- `mdkg pack spike-1 --profile concise --dry-run --stats`

# Acceptance Criteria

- An agent can start with only `goal-1`.
- The first routed node is `spike-1`.
- The pack contains `goal-1`, `epic-1`, `spike-1`, `task-1`, `test-1`, `prd-2`,
  `edd-1`, `dec-1`, `dec-2`, and `chk-2`.
- The template gives creative latitude while fixing Ocean Flow, static Astro,
  zero client JavaScript, public safety, and caller-gated side effects.

# Definition Of Done

- Goal condition is achieved.
- Required checks have evidence.
- Completion evidence is recorded in the goal.

# Stop Conditions

- Goal is blocked beyond the configured attempt limit.
- Required context or permissions are missing.
- Budget or safety constraints prevent continued work.

# Current State

Seed graph only. The active node is `spike-1`.

# Iteration Log

- 2026-06-29: Seeded as the canonical website demo template.
- 2026-07-26: Reconciled the canonical contract to static Astro, zero client
  JavaScript, and caller-owned integration/publication authority.
- 2026-07-26: Added `prd-2` so fresh-agent packs carry explicit product
  requirements alongside design and execution context.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- `chk-2` accepts the reusable static-Astro starting contract. Execution
  evidence remains pending for each specialized fork.
