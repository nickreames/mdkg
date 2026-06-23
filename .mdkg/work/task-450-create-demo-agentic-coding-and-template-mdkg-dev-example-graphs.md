---
tags: [mdkg-dev, examples, demo-graphs]
owners: []
links: []
artifacts: []
relates: [task-449, task-451, edd-26]
blocked_by: [task-449]
blocks: [task-451, test-203]
refs: [archive://archive.mdkg-dev-planning-docs-2026-06-22]
context_refs: [prd-4, prd-5, edd-25, edd-26, edd-27, dec-30]
evidence_refs: []
aliases: []
skills: []
created: 2026-06-22
updated: 2026-06-22
id: task-450
type: task
title: create demo agentic coding and template mdkg-dev example graphs
status: todo
priority: 1
parent: goal-25
epic: epic-125
---
# Overview

Create demo/template graphs for dogfood and presentations without mixing them into canonical mdkg.dev launch SEO.

# Acceptance Criteria

- Executed only after goal-25 is explicitly activated and task-449 has settled public copy boundaries.
- `/examples/demo-agentic-coding` exists with a small inspectable project and valid `.mdkg` graph.
- `/examples/template-mdkg-dev` exists with a clone/forkable graph for website demo generation.
- Each example has one ambitious umbrella goal, at least one spike, task, test, checkpoint, decision/design record, and optional skill-authoring candidate.
- Demo graph supports a goal-only agent start: a user can give an agent a goal ID and the graph contains enough context to begin.
- Demo deployment policy is documented: canonical site remains `mdkg.dev`, docs are `docs.mdkg.dev`, preview URLs are disposable/noindex, durable demos use future `demo-N.mdkg.dev` only after promotion.
- No Vercel preview or durable demo deployment is required or performed in this goal unless later explicitly requested.

# Files Affected

- `/examples/demo-agentic-coding`
- `/examples/template-mdkg-dev`
- demo policy docs selected by task-445

# Implementation Notes

- Keep demo graphs safe, small, and public-inspectable.
- Do not include private repo data, raw prompts, provider payloads, tokens, or local absolute paths.
- Record demo/template graph proof checkpoint before closing.

# Test Plan

- Validate each example graph with the local mdkg CLI.
- Prove goal-only agent-start pack/search/show behavior.
- Run `npm run smoke:demo-graph` after task-452 wires it.

# Links / Artifacts

- archive://archive.mdkg-dev-planning-docs-2026-06-22
- parent: goal-25
- epic: epic-125
- context: edd-26
- context: Vercel readiness and no-production-launch boundary
