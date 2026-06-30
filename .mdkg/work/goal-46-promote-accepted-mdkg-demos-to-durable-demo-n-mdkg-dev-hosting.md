---
id: goal-46
type: goal
title: Archive optional demo-N mdkg dev hosting after short path decision
status: archived
priority: 2
goal_state: archived
goal_condition: Historical optional demo-N.mdkg.dev hosting context is preserved, but the active demo roadmap now uses /demos and /demo/:id inside mdkg-dev; any future subdomain hosting requires a fresh explicit goal, refreshed Vercel/DNS research, and separate approval.
scope_refs: [epic-206, spike-23, task-623, task-624, task-625, task-626, test-326, test-327]
last_active_node: spike-23
required_skills: []
required_checks: []
max_iterations: 25
blocked_after_attempts: 3
tags: [demo, vercel, dns, hosting, mdkg-dev, follow-up]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-44, goal-47, dec-57, dec-58, dec-59]
context_refs: [dec-57, dec-58, dec-59]
evidence_refs: []
aliases: []
skills: []
created: 2026-06-29
updated: 2026-06-29
---
# Objective

Preserve the old durable `demo-N.mdkg.dev` hosting plan as historical optional
context while the active roadmap moves to short mdkg.dev paths.

# End Condition

This archived goal is complete when future agents can see that `demo-N.mdkg.dev`
was intentionally superseded by `/demos` and `/demo/:id`, and that subdomain
hosting requires a new explicit approval path before any Vercel/DNS work starts.

# Non-Goals

- Do not start DNS or Vercel custom-domain work from this archived goal.
- Do not treat `demo-N.mdkg.dev` as the canonical next lane.
- Do not link rejected, private, or needs-polish demos from mdkg.dev.

# Recursive Algorithm

1. Treat this goal as archived historical context.
2. If subdomain hosting becomes desirable again, create a new goal that
   references `dec-58`, `dec-59`, this archived goal, and current Vercel/DNS
   documentation.
3. Keep any future Vercel/DNS/promotion work approval-gated.

# Required Skills

- none for archived execution

# Required Checks

- no active required checks; this goal is superseded

# Acceptance Criteria

- Goal body states the supersession clearly.
- Future subdomain hosting requires a new explicit goal and approval.
- `goal-44` and `goal-47` are the active successors.

# Definition Of Done

- Goal is archived with successor refs.
- No provider or source mutation occurred during archival.

# Stop Conditions

- None; archived.

# Current State

- Created on 2026-06-29 as a paused follow-up to `goal-44`.
- Archived on 2026-06-29 after the operator chose `/demos` and `/demo/:id` as
  the default accepted-demo URL model.
- Optional subdomain hosting remains historical context only; the active
  successor for viewer work is `goal-47`.
- No Vercel hosting, DNS, aliases, custom domains, push, tag, npm publish,
  production promotion, or analytics activation was authorized or performed.

# Iteration Log

- 2026-06-29: Created by graph-only enhancement pass; no Vercel or DNS mutation
  performed.
- 2026-06-29: Archived by graph-only URL alignment pass in favor of `dec-58`,
  `dec-59`, `goal-44`, and `goal-47`.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- Planning checkpoint: `chk-327`.
- Superseded by short-path accepted demo model: `dec-58`, `dec-59`, and
  `goal-44`.
