---
id: task-389
type: task
title: create website-template-mdkg dogfood plan
status: done
priority: 2
epic: epic-94
parent: goal-18
tags: [0.3.5, website-template, dogfood]
owners: []
links: []
artifacts: []
relates: [goal-20, goal-21]
blocked_by: [task-387, task-388]
blocks: [test-167, task-390]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-17
---
# Overview

Plan the website-template-mdkg graph used for live demos without creating the child repo here.

This dogfood plan bridges 0.3.5 graph clone/import capability to the paused
0.3.7 live-demo goal and 0.4.0 canonical mdkg.dev launch goal. It intentionally
does not create or mutate a `website-template-mdkg` repo.

# Acceptance Criteria

- Template goal shape is specified.
- DESIGN.md, EDDs, epics, tasks, tests, and skill candidates are planned.
- Start-from-goal demo contract is explicit.

# Files Affected

- .mdkg/work/**

# Implementation Notes

- Template repository name: `website-template-mdkg`.
- Template graph entrypoint:
  - one active umbrella goal, for example `goal-1: Build mdkg.dev demo website from cloned template graph`.
  - selected-goal state should point at that goal after `mdkg graph fork ... --start-goal goal-1`.
  - agent handoff should be able to start from `mdkg goal current --json` and `mdkg goal next --json` without hidden chat context.
- Template graph planned top-level files:
  - `DESIGN.md` for visual language, color, typography, content hierarchy, and accessibility constraints.
  - `README.md` for demo operator instructions.
  - `AGENT_START.md` and `.agents/skills/**` for harness-specific guidance.
  - `.mdkg/work/**` for the actual goal, epics, tasks, tests, spikes, and checkpoints.
- Template graph planned epics:
  - product positioning and SEO copy for mdkg.dev.
  - frontend architecture and visual system.
  - generated docs and command-reference integration.
  - live preview deployment to Vercel.
  - demo promotion/teardown rules for preview URLs and `demo-N.mdkg.dev`.
  - security/trust posture and no-secret checks.
- Template graph planned task/test shape:
  - create `DESIGN.md` and docs information architecture.
  - implement the website with generated command docs as source-backed content.
  - run local browser/Playwright smoke for visual and link integrity.
  - create Vercel preview deployment evidence.
  - create a promotion plan for durable demo subdomains without changing canonical mdkg.dev SEO.
  - create teardown/noindex checks for rejected demos.
- Skill candidates:
  - `clone-mdkg-template-graph`: fork a graph, select the start goal, and hand a coding agent only the goal ID.
  - `author-demo-website-mdkg-graph`: generate a website demo graph with DESIGN.md, deployment checks, preview receipts, and teardown guidance.
  - `verify-demo-deployment-receipts`: verify preview URLs, no-secret posture, noindex policy, and promotion readiness.
- Command contract:
  - separate-repo demo bootstrap should use `mdkg graph fork <source> --target <path> --start-goal goal-1 --json`.
  - same-repo dogfood import should use `mdkg graph import-template <source> --start-goal goal-1 --select-goal --dry-run --json`, then rerun with `--apply` only after reviewing rewrites.
  - subgraphs remain read-only context; use them for reference, not authored template import.

# Test Plan

- `node --test dist/tests/commands/graph.test.js`
- `node dist/cli.js validate --json`
- `node dist/cli.js goal next goal-18 --json`
- `mdkg graph fork` test evidence proves selected-goal start behavior.
- `mdkg graph import-template` test evidence proves same-repo start-goal rewrite and selection behavior.

# Links / Artifacts

- goal-20
- goal-21
- tests/commands/graph.test.ts
- chk-155
- chk-157
