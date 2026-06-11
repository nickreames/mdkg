---
id: test-144
type: test
title: temp-repo research spike workflow and docs-readiness contract
status: todo
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
updated: 2026-06-11
---
# Overview

Validate the end-to-end user workflow from a packed install: create a research
spike, record recommendations, create follow-up work, and confirm docs/readiness
surfaces describe the feature.

# Target / Scope

- `task-350`
- `task-351`
- Packed smoke: `npm run smoke:spike`

# Preconditions / Environment

- Packed mdkg tarball installed into a temp npm prefix.
- Fresh temp repo under `/private/tmp/mdkg-spike.XXXXXX/repo`.

# Test Cases

- Packed CLI creates and validates a spike.
- Spike body records research question, search plan, findings, recommendation,
  follow-up nodes, and skill candidates.
- Smoke creates at least one follow-up task from the spike recommendation.
- Smoke records a skill-authoring candidate without automatically creating or
  modifying `SKILL.md`.
- README, command matrix, help snapshots, command contract, and publish-readiness
  checks all mention or account for spike support.

# Results / Evidence

- Pending implementation.

# Notes / Follow-ups

- This test is the bridge between the node-type foundation and future mdkg.dev
  launch planning.
