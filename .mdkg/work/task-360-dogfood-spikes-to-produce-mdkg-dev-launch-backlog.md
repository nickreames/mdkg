---
id: task-360
type: task
title: dogfood spikes to produce mdkg.dev launch backlog
status: todo
priority: 2
epic: epic-79
parent: goal-15
tags: [spike, dogfood, mdkg-dev, backlog]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-351]
blocks: []
refs: []
aliases: []
skills: []
created: 2026-06-11
updated: 2026-06-11
---
# Overview

Dogfood first-class spike nodes to produce the mdkg.dev launch backlog. This
task should use spikes as actionable research work, then convert concrete
recommendations into tasks, tests, or skill-authoring candidates.

# Acceptance Criteria

- Create spikes for mdkg.dev IA, generated docs, examples, SEO positioning,
  security posture, and downstream adoption narratives.
- Each spike records research question, findings, options, recommendation,
  follow-up nodes, skill candidates, and sources in Markdown sections.
- Convert accepted recommendations into mdkg tasks/tests under `goal-15`.
- Preserve the boundary that spikes do not auto-search, auto-execute, or
  auto-generate `SKILL.md` files.

# Files Affected

- `.mdkg/work/spike-*`
- follow-up task/test nodes under `goal-15`
- possible skill-authoring task nodes

# Implementation Notes

- Use `mdkg new spike` after `goal-14` ships the command.
- Keep citations and source notes in the spike body for the first release.
- Prefer narrow spikes with clear recommendations over broad research dumps.

# Test Plan

- Run `npm run smoke:spike`.
- Run `node dist/cli.js validate --json`.
- Prove `goal next` can route from accepted spike output to concrete follow-up
  work.

# Links / Artifacts

- Feeds `task-361` and downstream mdkg.dev launch tasks.
