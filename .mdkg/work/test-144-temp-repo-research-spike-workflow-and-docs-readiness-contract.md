---
id: test-144
type: test
title: temp-repo research spike workflow and docs-readiness contract
status: done
priority: 1
epic: epic-77
parent: goal-14
tags: [spike, temp-repo, docs, mdkg-dev]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-350]
blocks: []
refs: []
aliases: []
skills: []
cases: [packed smoke creates spike, spike creates follow-up node plan, spike records skill candidate, docs mention mdkg.dev research use]
created: 2026-06-11
updated: 2026-06-15
---
# Overview

Validate the end-to-end user workflow from a packed install: create a research
spike, record recommendations, create follow-up work, and confirm docs/readiness
surfaces describe the feature.

# Target / Scope

- `task-350`
- `task-351`
- `task-368`
- Packed smoke: `npm run smoke:spike`

# Preconditions / Environment

- Packed mdkg tarball installed into a temp npm prefix.
- Fresh temp repo under `/private/tmp/mdkg-spike.XXXXXX/repo`.

# Test Cases

- Packed CLI creates and validates a spike.
- Packed CLI routes a goal to the spike and can claim it.
- Spike body records research question, search plan, findings, recommendation,
  follow-up nodes, and skill candidates.
- Smoke creates at least one follow-up task from the spike recommendation.
- Smoke records a skill-authoring candidate without automatically creating or
  modifying `SKILL.md`.
- README, command matrix, help snapshots, command contract, and publish-readiness
  checks all mention or account for spike support.
- Prepublish dry-run gates are covered by `test-156`; this test proves the
  user-facing packed workflow.

# Results / Evidence

- Passed. Evidence from `task-350`, `task-351`, `task-360`, `chk-130`, and the
  completed dogfood spikes.
- `npm run smoke:spike` passed from a packed installed tarball and proved fresh
  temp-repo spike creation, lifecycle mutation, goal routing, search/show/pack,
  explicit follow-up task/test creation, skill-candidate recording, and no
  automatic `SKILL.md` generation.
- Real repository dogfood created and completed `spike-1` through `spike-5` for
  mdkg.dev IA/generated docs, outcome examples/downstream adoption,
  security/trust, SEO/AI search readiness, and architecture/data-structure
  narrative.
- Follow-up launch scope was added to paused `goal-15` as `task-370`,
  `task-371`, and `test-157`, with existing launch tasks wired to spike
  evidence.
- `node dist/cli.js validate --json` passed with zero warnings/errors.
- `node dist/cli.js search "mdkg.dev" --json` finds the goal, spikes, and
  launch follow-up nodes.
- `git diff --check` passed.

# Notes / Follow-ups

- This test is the bridge between the node-type foundation and future mdkg.dev
  launch planning.
