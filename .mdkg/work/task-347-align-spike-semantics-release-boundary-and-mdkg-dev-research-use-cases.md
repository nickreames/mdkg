---
id: task-347
type: task
title: align spike semantics release boundary and mdkg.dev research use cases
status: todo
priority: 1
epic: epic-76
parent: goal-14
tags: [spike, semantics, release-boundary, mdkg-dev]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: [task-348]
refs: []
aliases: []
skills: []
created: 2026-06-11
updated: 2026-06-11
---
# Overview

Lock the exact semantics for the new `spike` node type before implementation.
This prevents the feature from drifting into a browser/search executor,
automatic skill generator, or separate command namespace.

# Acceptance Criteria

- Decide and document that the public node type is `spike`, with ids `spike-#`
  and storage under `.mdkg/work/`.
- Define `spike` as an actionable work-node type compatible with existing task
  lifecycle, next selection, goal routing, search/show, pack, validate, and
  command docs.
- Define the first-pass template sections for research question, search plan,
  findings, options, recommendation, follow-up nodes, skill candidates,
  security/UX/data-structure/algorithm notes, evidence, and mdkg.dev launch
  implications.
- Confirm non-goals: no automatic web search, no automatic node/SKILL.md
  creation, no `mdkg spike` namespace, no worker execution.

# Files Affected

- `.mdkg/work/task-347-*`
- Implementation follow-ups under `task-348` through `task-351`

# Implementation Notes

- Treat this as a product/contract alignment task. It should end with a concise
  implementation contract that `task-348` can execute without further product
  decisions.
- Use current work-node behavior as the compatibility baseline.

# Test Plan

- `node dist/cli.js validate --json`
- `node dist/cli.js goal next goal-14 --json`

# Links / Artifacts

- `goal-14`
- `epic-76`
