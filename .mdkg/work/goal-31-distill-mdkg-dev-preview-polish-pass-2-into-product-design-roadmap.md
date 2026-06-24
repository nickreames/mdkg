---
id: goal-31
type: goal
title: Distill mdkg.dev preview polish pass 2 into product design roadmap
status: done
priority: 1
goal_state: achieved
goal_condition: Goal 31 is achieved when the pass-2 feedback bundle is archived, all 40 stories are distilled into canonical product/design requirements, paused Goal 32 exists with decision-complete implementation scope, validation passes, and no functional site/docs/source changes are made.
scope_refs: [epic-153, epic-154, epic-155, epic-156, spike-17, task-499, task-500, task-501, task-502, task-503, task-504, task-505, task-506, test-235, test-236, test-237, test-238]
last_active_node: task-506
required_skills: [select-work-and-ground-context, verify-close-and-checkpoint]
required_checks: [git status --short --branch, node dist/cli.js archive verify archive://archive.mdkg-dev-preview-polish-pass-2-2026-06-24 --json, node dist/cli.js index, node dist/cli.js validate --summary --json --limit 20, node dist/cli.js goal show goal-32 --json, node dist/cli.js goal next goal-32 --json, node dist/cli.js pack goal-32 --pack-profile concise, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [mdkg-dev, preview-polish, product-design, graph-only]
owners: []
links: []
artifacts: [mdkg_preview_polish_pass2, mdkg_preview_polish_pass2_docs.zip]
relates: []
blocked_by: []
blocks: []
refs: [archive://archive.mdkg-dev-preview-polish-pass-2-2026-06-24]
context_refs: []
evidence_refs: []
aliases: [mdkg-dev-pass-2-ingestion]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-06-23
updated: 2026-06-23
---
# Objective

Turn `mdkg_preview_polish_pass2/` into durable mdkg planning state. This is the first goal in a two-goal system: Goal 31 is graph/design-only ingestion, and Goal 32 is the future implementation run.

# End Condition

This goal is complete only when:

- `mdkg_preview_polish_pass2_docs.zip` is archived as `archive://archive.mdkg-dev-preview-polish-pass-2-2026-06-24`.
- The readable `mdkg_preview_polish_pass2/` folder remains committed as source evidence.
- `prd-7`, `edd-36`, `edd-37`, `edd-38`, `dec-37`, and `dec-38` capture the pass-2 product/design doctrine.
- Paused `goal-32` exists and routes to `task-507`.
- Goal 32 encodes all P0, P1, P2, and P3 story implementation; Browser/Chrome/Product Design/Vercel checks; logical commits; push to `origin/main`; and no-launch stop conditions.
- Graph validation, archive verification, Goal 32 pack proof, and diff checks pass.

# Non-Goals

- No edits to `mdkg-dev/`, `docs/`, `examples/`, `src/`, `scripts/`, package metadata, generated command docs, deploy config, Vercel settings, DNS, npm, tags, or public launch surfaces.
- No execution of Goal 32 in this pass.
- No mutation of GitHub, Vercel, DNS, or analytics settings.

# Recursive Algorithm

1. Confirm the graph has no selected current goal and restore the one-active-goal invariant.
2. Archive the pass-2 zip and keep the readable folder as reviewable source evidence.
3. Distill the 40 story files and top-level planning docs into Product Design, docs IA, SEO, and launch-boundary records.
4. Seed paused Goal 32 with implementation epics, tasks, tests, required checks, checkpoints, and push/preview constraints.
5. Validate Goal 32 routing, pack it, checkpoint ingestion evidence, and commit the graph-only changes locally.

# Required Checks

- `git status --short --branch`
- `node dist/cli.js archive verify archive://archive.mdkg-dev-preview-polish-pass-2-2026-06-24 --json`
- `node dist/cli.js index`
- `node dist/cli.js validate --summary --json --limit 20`
- `node dist/cli.js goal show goal-32 --json`
- `node dist/cli.js goal next goal-32 --json`
- `node dist/cli.js pack goal-32 --pack-profile concise`
- `git diff --check`

# Acceptance Criteria

- All P0, P1, P2, and P3 pass-2 stories are accounted for.
- The Claims Evidence Matrix is internal evidence, not public navigation.
- `/docs` on the marketing site is deleted now; a future redirect to `docs.mdkg.dev` is a separate launch/cutover action.
- Plan -> Work -> Evidence becomes the public operating model.
- Goal 32 is implementation-ready and unambiguous.

# Current State

Goal 30 is achieved and existing Vercel previews are live. The pass-2 bundle is a second critique of those previews and becomes the authoritative next polish backlog.

# Context Inventory

These records inform Goal 31 but stay out of traversal-sensitive frontmatter so `goal next` remains focused on actionable local work:

- `goal-25`
- `goal-28`
- `goal-29`
- `goal-30`
- `prd-6`
- `edd-34`
- `edd-35`
- `dec-36`

# Completion Evidence

- Archived source evidence: `archive://archive.mdkg-dev-preview-polish-pass-2-2026-06-24`.
- Distilled pass-2 Product Design requirements into `prd-7`, `edd-36`, `edd-37`, `edd-38`, `dec-37`, and `dec-38`.
- Created paused implementation goal `goal-32` with epics `epic-157` through `epic-164`, tasks `task-507` through `task-518`, and tests `test-239` through `test-247`.
- Closed ingestion work: `spike-17`, `task-499` through `task-506`, and `test-235` through `test-238`.
- Closeout checkpoint: `chk-215`.
- Required checks passed: archive verify, index, warning-clean validation, Goal 32 show/next, Goal 32 concise pack, and `git diff --check`.
- Boundary preserved: no functional edits to `mdkg-dev/`, `docs/`, `examples/`, `src/`, `scripts/`, package metadata, generated command docs, deploy config, Vercel settings, DNS, npm, tags, analytics, or public launch surfaces.
