---
id: goal-27
type: goal
title: Prepare mdkg.dev Vercel preview hosting and Starlight docs readiness
status: done
priority: 1
goal_state: achieved
goal_condition: The goal is complete when mdkg has a decision-complete, graph-only plan for Vercel preview hosting of the mdkg.dev marketing site and a separate Starlight docs project, with DNS/manual launch boundaries, validation checklists, and a Chrome/Vercel execution handoff ready for a later implementation pass.
scope_refs: [epic-131, epic-132, epic-133, epic-134, epic-135, epic-136, spike-15, task-463, task-464, task-465, task-466, task-467, task-468, task-469, task-470, task-471, test-212, test-213, test-214, test-215, test-216, test-217]
last_active_node: task-471
required_skills: [select-work-and-ground-context, verify-close-and-checkpoint]
required_checks: [git status --short --branch, node dist/cli.js index, node dist/cli.js validate --summary --json --limit 20, node dist/cli.js doctor --strict --json, node dist/cli.js goal current --json, node dist/cli.js goal next goal-27 --json, node dist/cli.js pack goal-27 --pack-profile concise, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [mdkg-dev, vercel, starlight, hosting, preview]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-22
updated: 2026-06-22
---
# Objective

Prepare mdkg.dev for a preview-hosting implementation pass without creating any external hosting resources in this alignment pass. The plan must cover the Vercel marketing site, a separate Starlight docs project, future DNS cutover boundaries, preview validation evidence, and demo subdomain strategy.

# End Condition

This goal is achieved when:

- `goal-26` is paused with explicit evidence that local Browser E2E completed and the remaining blocker is only the already-published package dry-run condition.
- The marketing site preview contract is unambiguous: Vercel project `mdkg-dev`, root `mdkg-dev/`, build `npm run build`, output `dist`.
- The docs preview contract is unambiguous: Starlight project rooted at `docs/`, Vercel project `mdkg-docs`, build `npm run build`, output `dist`, future canonical host `docs.mdkg.dev`.
- DNS remains manual and blocked until preview proof is accepted.
- A follow-up execution handoff exists for Chrome/Vercel project setup and preview validation.

# Non-Goals

- No Vercel deploy, project creation, production promotion, analytics activation, DNS change, tag, push, publish, or global install.
- No Starlight implementation or source edits outside `.mdkg`.
- No migration of `docs/` into a Starlight app during this alignment pass.
- No public launch or demo subdomain promotion.

# Recursive Algorithm

1. Inspect the current goal state, relevant graph nodes, and required skills.
2. Create missing mdkg nodes only when evidence shows they are needed.
3. Select one concrete child node and work it to completion.
4. Run required checks and record evidence.
5. Re-evaluate the end condition and continue, pause, or close.

# Required Skills

- `select-work-and-ground-context`
- `verify-close-and-checkpoint`

# Required Checks

- `git status --short --branch`
- `node dist/cli.js index`
- `node dist/cli.js validate --summary --json --limit 20`
- `node dist/cli.js doctor --strict --json`
- `node dist/cli.js goal current --json`
- `node dist/cli.js goal next goal-27 --json`
- `node dist/cli.js pack goal-27 --pack-profile concise`
- `git diff --check`

# Acceptance Criteria

- `goal-27` is the only active root goal and routes to `spike-15`.
- `goal-26` is paused and remains searchable as prior Browser E2E evidence.
- The plan clearly separates preview hosting from public launch.
- Marketing deploy settings, docs deploy settings, and DNS cutover policy are decision-complete.
- Starlight replaces GitBook for canonical docs hosting.
- `/docs` on the marketing site is a bridge/landing page; `docs.mdkg.dev` is the future canonical docs surface.
- Demo subdomains are planned, not implemented.

# Definition Of Done

- Goal condition is achieved.
- Required checks have evidence.
- Completion evidence is recorded in the goal.

# Stop Conditions

- Any step would create or mutate a Vercel project, deploy a preview, promote production, update DNS, sync a public docs host, publish, tag, push, or edit non-mdkg source files.
- Required hosting details cannot be verified through read-only docs or local repo inspection.
- Validation or doctor reports a hard graph error.

# Current State

Created after `goal-25` produced the mdkg-dev site/docs/demo workspace and `goal-26` validated it locally with Browser evidence. The next implementation pass should create Vercel preview projects only after this graph plan is closed and accepted.

# Context Inventory

Goal-level `context_refs` intentionally stays empty because the current goal traversal and pack commands warn when non-actionable design, decision, checkpoint, or historical goal refs appear there. This alignment still depends on the following context:

- goal-25
- goal-26
- prd-4
- prd-5
- edd-24
- edd-25
- edd-26
- edd-27
- edd-28
- edd-29
- edd-30
- dec-30
- dec-31
- dec-32
- chk-194
- chk-196
- chk-199
- chk-200
- edd-31
- edd-32
- edd-33
- dec-33
- dec-34
- dec-35

# Iteration Log

- 2026-06-22: Created as the active graph-only alignment lane for Vercel preview hosting and Starlight docs readiness.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- `goal-26` was paused with explicit body evidence that local Browser E2E had completed and the remaining blocker was the already-published package dry-run condition.
- `goal-27` was created as the single active root goal for preview-hosting alignment, then scoped to epics `epic-131` through `epic-136`, `spike-15`, tasks `task-463` through `task-471`, and tests `test-212` through `test-217`.
- Official Starlight and Vercel docs were reviewed and captured in `spike-15`.
- Hosting architecture is captured in `edd-31`, `edd-32`, and `edd-33`.
- Decisions are captured in `dec-33`, `dec-34`, and `dec-35`.
- Marketing preview contract: Vercel project `mdkg-dev`, root `mdkg-dev/`, build `npm run build`, output `dist`.
- Docs preview contract: Vercel project `mdkg-docs`, root `docs/`, Starlight, build `npm run build`, output `dist`, future host `docs.mdkg.dev`.
- DNS remains manual and blocked until preview proof is accepted.
- `/docs` on the marketing site is a bridge/landing page; `docs.mdkg.dev` is the future canonical Starlight docs surface.
- Demo subdomains are planned through `edd-33` and `task-469`, not implemented.
- Required checks passed before closeout: `git status --short --branch`, `node dist/cli.js index`, `node dist/cli.js validate --summary --json --limit 20`, `node dist/cli.js doctor --strict --json`, `node dist/cli.js goal current --json`, `node dist/cli.js goal next goal-27 --json`, `node dist/cli.js pack goal-27 --pack-profile concise`, and `git diff --check`.
- No source/site/docs implementation, Vercel project creation, deploy, DNS change, publish, tag, push, global install, or public launch occurred.
