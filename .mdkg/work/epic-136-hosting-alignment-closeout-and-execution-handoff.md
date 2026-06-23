---
id: epic-136
type: epic
title: hosting alignment closeout and execution handoff
status: backlog
priority: 1
tags: [mdkg-dev, handoff, closeout]
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
# Goal

Close the graph-only hosting plan with enough evidence for a later agent to execute Vercel preview setup without redesigning the architecture.

# Scope

- `goal-26` transition evidence.
- `goal-27` routing proof.
- Execution handoff for Chrome/Vercel UI.
- Explicit non-public side-effect receipt.

# Milestones

- Pause `goal-26` and activate `goal-27`.
- Validate goal routing and graph health.
- Write a handoff for Vercel preview setup and close alignment evidence.

# Out of Scope

- Vercel resource mutation.
- DNS changes.
- Site/docs implementation.
- Push, tag, publish, or deploy.

# Risks

- If `goal-26` remains selected, agents may continue chasing an already-published dry-run blocker.
- If the handoff omits stop conditions, preview setup may drift into production launch.

# Links / Artifacts

- `task-463`
- `task-470`
- `task-471`
- `test-212`
- `test-217`
