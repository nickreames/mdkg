---
tags: [mdkg-dev, contract, demo-graph]
owners: []
links: []
artifacts: []
relates: [task-450, edd-26]
blocked_by: [task-450]
blocks: []
refs: [archive://archive.mdkg-dev-planning-docs-2026-06-22]
context_refs: [edd-25, edd-26]
evidence_refs: []
aliases: []
skills: []
created: 2026-06-22
updated: 2026-06-22
id: test-203
type: test
title: demo template graph import and goal-only agent-start contract
status: todo
priority: 1
parent: goal-25
epic: epic-125
---
# Overview

Validate demo/template graph behavior and the goal-only agent-start story.

# Acceptance Criteria

- `/examples/demo-agentic-coding` and `/examples/template-mdkg-dev` contain valid mdkg graphs.
- Each demo/template graph has a clear umbrella goal, spike, task, test, checkpoint, decision/design node, and optional skill candidate.
- `mdkg goal current`, `mdkg goal next`, `mdkg pack <id>`, `mdkg handoff create <id>`, and `mdkg validate` are demonstrable in the example context.
- Template import/fork behavior is exercised with preserved IDs for separate repos or rewrite behavior for same-repo import where appropriate.
- Demo policy keeps preview URLs noindexed and prevents unpromoted demos from becoming canonical SEO targets.

# Test Plan

- `npm run smoke:demo-graph`
- Example graph `mdkg validate --json`
- Pack/search/show proof for the demo start goal.

# Links / Artifacts

- archive://archive.mdkg-dev-planning-docs-2026-06-22
- parent: goal-25
- epic: epic-125
