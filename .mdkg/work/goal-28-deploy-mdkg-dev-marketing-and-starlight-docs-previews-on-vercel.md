---
id: goal-28
type: goal
title: Deploy mdkg.dev marketing and Starlight docs previews on Vercel
status: done
priority: 1
goal_state: achieved
goal_condition: This goal is achieved only after a future implementation pass scaffolds Starlight under docs, updates the marketing docs bridge, validates local marketing/docs builds, commits and pushes main to origin/main, creates Vercel preview projects in Chrome, and validates hosted preview URLs for both mdkg-dev and mdkg-docs.
scope_refs: [epic-137, epic-138, epic-139, epic-140, epic-141, epic-142, task-472, task-473, task-474, task-475, task-476, task-477, task-478, task-479, task-480, task-481, test-218, test-219, test-220, test-221, test-222, test-223]
last_active_node: task-481
required_skills: [select-work-and-ground-context, verify-close-and-checkpoint]
required_checks: [git status --short --branch, node dist/cli.js validate --summary --json --limit 20, node dist/cli.js doctor --strict --json, npm --prefix mdkg-dev run build, npm --prefix docs run build, npm run docs:check, npm run smoke:mdkg-dev, npm run smoke:mdkg-dev-docs, npm run smoke:mdkg-dev-seo, npm run smoke:demo-graph, npm run build, npm run test, npm run cli:contract, git push origin main, Vercel project mdkg-dev exists, Vercel project mdkg-docs exists, Browser and Chrome preview validation passes, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [mdkg-dev, vercel, starlight, preview, implementation]
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

Execute the live preview-hosting implementation that `goal-27` planned. This is a future implementation goal, not a graph-only alignment lane: when explicitly activated later, it must make code/docs changes, push `main` to `origin/main`, create Vercel preview projects in Chrome, and validate hosted preview URLs.

The future executor has explicit permission to use the Chrome plugin for first-time Vercel project setup and the Vercel plugin for project, deployment, and build-log verification. That permission is scoped to the existing mdkg GitHub repository only: if Vercel or GitHub asks to import, authorize, expose, or grant access to any repository other than `nickreames/mdkg`, stop and ask for explicit approval before continuing.

# End Condition

This goal is achieved only when all of the following are true:

- `docs/` is a working Starlight docs project with existing mdkg docs preserved or migrated into Starlight content and navigation.
- `mdkg-dev/src/pages/docs.astro` describes `docs.mdkg.dev` / Starlight as the canonical docs surface and no longer describes GitBook as the intended renderer.
- Local marketing and docs builds pass.
- mdkg repo checks and relevant smokes pass.
- Implementation changes are committed locally.
- `main` is pushed to `origin/main` without force.
- Vercel team `Nicholas Reames' projects` (`team_RkZhrKQs9wWs6PAdTcrwZ87z`) has two preview projects:
  - `mdkg-dev`, root `mdkg-dev/`, build `npm run build`, output `dist`.
  - `mdkg-docs`, root `docs/`, build `npm run build`, output `dist`.
- Both Vercel projects are connected only to GitHub repository `nickreames/mdkg`.
- Vercel preview deployments for both projects are live and validated in Browser and Chrome.
- Preview URLs, build/log evidence, and validation notes are recorded in mdkg.
- DNS cutover, production promotion, npm publish, git tag, analytics activation, and public launch have not occurred.

# Non-Goals

- No DNS record changes for `mdkg.dev`, `www.mdkg.dev`, or `docs.mdkg.dev`.
- No Vercel production promotion or custom-domain binding.
- No npm package publish.
- No git tag.
- No public launch announcement.
- No analytics activation.
- No Vercel secret, deployment bypass token, DNS credential, cookie, or provider credential stored in mdkg.

# Recursive Algorithm

1. Activate this goal only when the user explicitly asks to execute preview hosting.
2. Claim `task-472`, verify this creation-only pass is committed, and lock the implementation boundary.
3. Work one scoped node at a time through Starlight implementation, marketing bridge polish, local validation, push, Vercel setup, preview validation, and closeout.
4. Use Chrome for first Vercel project setup and Vercel tools for read-only inventory, deployments, and build logs afterward.
5. During Vercel/GitHub setup, select/import/authorize only `nickreames/mdkg`; broader repository access requires a stop-and-ask approval.
6. Stop before DNS, production promotion, npm publish, tag, analytics activation, or public launch.

# Required Skills

- `select-work-and-ground-context`
- `verify-close-and-checkpoint`

# Required Checks

- `git status --short --branch`
- `node dist/cli.js validate --summary --json --limit 20`
- `node dist/cli.js doctor --strict --json`
- `npm --prefix mdkg-dev run build`
- `npm --prefix docs run build`
- `npm run docs:check`
- `npm run smoke:mdkg-dev`
- `npm run smoke:mdkg-dev-docs`
- `npm run smoke:mdkg-dev-seo`
- `npm run smoke:demo-graph`
- `npm run build`
- `npm run test`
- `npm run cli:contract`
- `git push origin main`
- Vercel project `mdkg-dev` exists and has a successful preview deployment.
- Vercel project `mdkg-docs` exists and has a successful preview deployment.
- Browser and Chrome preview validation pass for marketing and docs URLs.
- `git diff --check`

# Acceptance Criteria

- Future activation of `goal-28` routes first to `task-472`.
- The implementation pass cannot be closed without real Vercel preview project creation and hosted preview validation.
- The implementation pass cannot accidentally satisfy the goal through planning-only graph edits.
- DNS, production promotion, npm publish, git tag, analytics activation, and public launch remain explicitly deferred.

# Definition Of Done

- Goal condition is achieved by real implementation, push, project creation, and live preview validation.
- Required checks have evidence.
- Completion evidence is recorded in the goal and final checkpoint.

# Stop Conditions

- Chrome/Vercel requires an irreversible production choice, payment/plan change, custom-domain binding, or credential disclosure.
- `git push origin main` is rejected or would require force-push.
- Vercel project creation cannot be completed without user authentication or account selection.
- Vercel or GitHub asks to import, authorize, expose, or grant access to any repository other than `nickreames/mdkg`.
- Any step would publish npm, create a git tag, change DNS, promote production, activate analytics, or publicly launch the site without explicit later approval.

# Current State

Created after `goal-27` completed the graph-only Vercel/Starlight alignment. `goal-28` is paused intentionally: this creation pass must not execute implementation, Vercel project setup, push, deploy, DNS, publish, or tag work.

Vercel inventory at creation time:

- Team: `Nicholas Reames' projects`
- Team id: `team_RkZhrKQs9wWs6PAdTcrwZ87z`
- Existing projects: none reported by Vercel project list.

# Context Inventory

Goal-level `relates` and `context_refs` intentionally stay empty because the current goal traversal command warns when non-actionable design, decision, checkpoint, or achieved-goal refs appear in traversal-adjacent frontmatter. This goal depends on the following context:

- `goal-27`
- `chk-201`
- `edd-31`
- `edd-32`
- `edd-33`
- `dec-33`
- `dec-34`
- `dec-35`

# Iteration Log

- 2026-06-22: Created as a paused implementation goal only. Execution is deferred to a later explicit activation.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- Implementation commit pushed to `origin/main`: `4842b51 feat: add Starlight docs preview site`.
- mdkg evidence commit pushed to `origin/main`: `1240f86 graph: record mdkg dev preview implementation evidence`.
- Marketing preview project created through Chrome:
  - Project: `mdkg-dev`
  - Project id: `prj_R9FJkRf2FsmcM9cuIyQbPTV9A056`
  - Root: `mdkg-dev`
  - Preview URL: `https://mdkg-dev.vercel.app`
  - Deployment: `dpl_7oq5idj6rjsamgPt1DgXXyiMb2VT`, `READY`
- Docs preview project created through Chrome:
  - Project: `mdkg-docs`
  - Project id: `prj_3Aoh90VnkqNmqM6AnX9t72fSULEd`
  - Root: `docs`
  - Preview URL: `https://mdkg-docs.vercel.app`
  - Deployment: `dpl_BSRCqokvScb8Uvot4cHBu27bmKg2`, `READY`
- Vercel build logs verified both projects build from GitHub repo `nickreames/mdkg`, branch `main`, commit `1240f86`, with Astro static output to `dist`.
- Browser/Chrome validation passed for marketing and docs preview routes.
- Final closeout checkpoint: `chk-203`.
- Deferred: DNS, custom domains, production launch/promotion, analytics activation, npm publish, and git tag.
