---
id: spike-1
type: spike
title: Research website template audience and visual direction
status: todo
priority: 1
epic: epic-1
parent: goal-1
tags: [template, research, mdkg-dev]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: [goal-1, edd-3, dec-1]
evidence_refs: []
aliases: []
skills: []
created: 2026-06-22
updated: 2026-06-22
---
# Research Question

What audience, visual direction, and route scope should a cloned mdkg.dev website template target for a disposable live-demo build?

# Context And Constraints

- The template must be clone/fork friendly.
- The first implementation run is local-only.
- Preview deploy, durable demo subdomain, and production launch require explicit later goals.

# Search Plan

- Inspect `WEBSITE_TEMPLATE_BRIEF.md`, `edd-3`, and `dec-1`.
- Compare candidate page sets by clarity, build time, and ability to demonstrate mdkg-driven planning.
- If external design references are used, store links or summaries only.

# Findings

- Pending execution. This spike should pick the minimum route set and visual direction.

# Options And Tradeoffs

- one-page site: fastest and safest, but less complete.
- three-route mini-site: stronger demo, but more implementation overhead.
- full marketing clone: compelling, but too risky for the first template pass.

# Recommendation

Start with a three-route mini-site only if the spike confirms it can be built and validated within the live-demo time budget.

# Follow-Up Nodes To Create

- task-1
- test-1

# Skill Candidates

- future website-template SKILL.md after one successful rehearsal

# Data Structures And Algorithms Notes

- Keep template state in mdkg nodes and simple files; avoid hidden external dependencies.

# UX Notes

- The template should make the agent's decisions inspectable through mdkg context and checkpoints.

# Security Notes

- Do not include credentials, private analytics IDs, raw prompts, or production deployment config.

# mdkg.dev Launch Implications

- Successful candidates can become public demos or `demo-N.mdkg.dev` later, without replacing canonical mdkg.dev.

# Evidence And Sources

- `WEBSITE_TEMPLATE_BRIEF.md`
- goal-1
- edd-3
- dec-1
