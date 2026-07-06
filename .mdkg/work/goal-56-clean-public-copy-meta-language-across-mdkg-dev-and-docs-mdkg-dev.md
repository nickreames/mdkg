---
id: goal-56
type: goal
title: Clean public copy meta language across mdkg.dev and docs.mdkg.dev
status: progress
priority: 1
goal_state: active
goal_condition: Homepage, public changelog, demo proof language, and install wording are cleaned locally; generated release notes are aligned from CHANGELOG.md; local builds and smokes pass; Product Design and Browser evidence confirms no remaining weird public meta/process language across the audited mdkg.dev and docs.mdkg.dev surfaces.
scope_refs: [task-663, task-664, task-665, test-342, test-343]
active_node: task-663
required_skills: [select-work-and-ground-context, service-boundary-ownership-check, product-design-audit, browser-control-in-app-browser, build-pack-and-execute-task, verify-close-and-checkpoint]
required_checks: [node dist/cli.js index, node dist/cli.js validate --json, node dist/cli.js validate --changed-only --json, npm run docs:release-notes, npm --prefix mdkg-dev run build, npm --prefix docs run build, npm run smoke:mdkg-dev, npm run smoke:mdkg-dev-docs, npm run smoke:mdkg-dev-seo, npm run docs:check, Product Design public-copy audit with fresh local screenshots, Browser local rendered-page audit for mdkg.dev and docs pages, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [mdkg-dev, docs-mdkg-dev, public-copy, copy-boundary, product-design, browser]
owners: []
links: []
artifacts: [/private/tmp/mdkg-public-copy-audit-20260705/report.md]
relates: []
blocked_by: []
blocks: []
refs: [goal-42, goal-44, task-662, chk-375, chk-376, edd-36]
context_refs: []
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context, service-boundary-ownership-check, build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-05
updated: 2026-07-05
---
# Objective

Remove the remaining public-facing meta/process language identified in the
2026-07-05 Product Design audit while preserving mdkg capability truth and the
existing public-alpha safety posture.

# End Condition

The audited mdkg.dev and docs.mdkg.dev public surfaces no longer expose
internal release sequencing, approval workflow, Vercel/Chrome proof mechanics,
postpublish/postdeploy state, provider mutation language, or weird agent-process
meta commentary. Local source builds, mdkg-dev/docs smokes, generated
release-note checks, Product Design review, and Browser review all pass with
evidence.

# Non-Goals

- Do not change CLI behavior, npm package semantics, command contracts, graph
  schemas, validation behavior, package metadata, Vercel provider state, DNS,
  tags, publish state, or remote state.
- Do not reopen `task-662`, `chk-375`, or `chk-376`; they are completed
  corrective context.
- Do not modify seeded mdkg goals, templates, init assets, or example/template
  graph seeds unless a later explicit implementation task authorizes it.

# Recursive Algorithm

1. Inspect the current goal state, relevant graph nodes, and required skills.
2. Create missing mdkg nodes only when evidence shows they are needed.
3. Select one concrete child node and work it to completion.
4. Run required checks and record evidence.
5. Re-evaluate the end condition and continue, pause, or close.

# Required Skills

- `select-work-and-ground-context`
- `service-boundary-ownership-check`
- `product-design:audit` via local skill slug `product-design-audit`
- `browser:control-in-app-browser` via local skill slug
  `browser-control-in-app-browser`
- `build-pack-and-execute-task`
- `verify-close-and-checkpoint`

# Required Checks

- `node dist/cli.js index`
- `node dist/cli.js validate --json`
- `node dist/cli.js validate --changed-only --json`
- `npm run docs:release-notes`
- `npm --prefix mdkg-dev run build`
- `npm --prefix docs run build`
- `npm run smoke:mdkg-dev`
- `npm run smoke:mdkg-dev-docs`
- `npm run smoke:mdkg-dev-seo`
- `npm run docs:check`
- Product Design audit with fresh local screenshots for homepage, demos, docs
  install, safety boundaries, CLI reference, and changelog.
- Browser audit of the same local rendered pages.
- `git diff --check`

# Acceptance Criteria

- Homepage copy no longer contains `launch track`, `postpublish`,
  `postdeploy`, `production launch`, `release-readiness surface`,
  Vercel/Chrome proof language, or internal operational evidence wording.
- Public changelog and generated release-note data describe `0.4.0` as shipped
  user outcomes: website/docs refresh, customization guidance, release cards,
  generated references, and CTA polish.
- Demo proof language explains local proof and optional preview deployment
  without exposing approval workflow, provider mutation, raw prompt payload, or
  deployment-process jargon.
- Install docs use reader-facing support wording such as supported
  public-alpha install path and package smoke tests.
- Product Design and Browser evidence confirms no remaining weird public
  meta/process language across the audited surfaces.

# Definition Of Done

- Goal condition is achieved.
- Required checks have evidence.
- Completion evidence is recorded in the goal.

# Stop Conditions

- Goal is blocked beyond the configured attempt limit.
- Required context or permissions are missing.
- Budget or safety constraints prevent continued work.

# Current State

This goal is the active follow-up after the read-only public-copy audit stored
at `/private/tmp/mdkg-public-copy-audit-20260705/report.md`.

Relevant completed context:

- `task-662`: corrected the earlier boundary mistake and hardened skills.
- `chk-375`: recorded the public-surface copy boundary correction.
- `chk-376`: removed the public docs meta section from Safety Boundaries.
- `goal-42`: completed the `0.4.0` public docs launch lane.
- `goal-44`: completed the demo route and read-only explorer lane.

Remaining findings from the audit:

- P1: mdkg.dev homepage exposes internal launch/postpublish process copy.
- P1: public docs changelog `0.4.0` card/details read like launch management.
- P2: demo pages use process-heavy preview/provider wording.
- P3: install page uses slightly internal release-validation wording.

# Iteration Log

- 2026-07-05: Goal created from the public-copy audit plan. First active node
  is `task-663`.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- Pending.
