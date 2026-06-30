---
id: goal-46
type: goal
title: Promote accepted mdkg demos to durable demo-N.mdkg.dev hosting
status: blocked
priority: 2
goal_state: paused
goal_condition: An accepted Vercel preview from goal-44 is promoted to durable demo-N.mdkg.dev hosting only after refreshed Vercel and DNS research, explicit approval, Vercel project/domain evidence, DNS verification, Browser/Chrome live validation, teardown/retirement policy, and canonical mdkg.dev linking rules are complete.
scope_refs: [epic-206, spike-23, task-623, task-624, task-625, task-626, test-326, test-327]
active_node: spike-23
required_skills: [select-work-and-ground-context, verify-close-and-checkpoint]
required_checks: [accepted preview checkpoint from test-325, refreshed Vercel custom-domain and alias documentation, DNS plan for demo-N.mdkg.dev, Vercel project and deployment verification, Browser live validation, Chrome live validation, no-secret public content audit, canonical mdkg.dev link audit, teardown and retirement policy, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [demo, vercel, dns, hosting, mdkg-dev, follow-up]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [test-325]
blocks: []
refs: [goal-44]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-29
updated: 2026-06-29
---
# Objective

Promote only accepted mdkg demo previews to durable `demo-N.mdkg.dev` hosting
with explicit Vercel, DNS, Browser, Chrome, SEO, and teardown evidence.

# End Condition

The goal is achieved when an accepted preview from `goal-44` has been promoted
or deliberately not promoted with durable evidence. Promotion requires refreshed
Vercel/DNS research, explicit approval, domain/project mapping, live
Browser/Chrome proof, no-secret/public-claims checks, and canonical mdkg.dev
linking rules.

# Non-Goals

- Do not begin until `test-325` records an accepted preview checkpoint.
- Do not create DNS records, aliases, custom domains, deploys, pushes, tags, or
  production promotions without explicit approval during execution.
- Do not link rejected, private, or needs-polish demos from canonical mdkg.dev.

# Recursive Algorithm

1. Confirm `test-325` has accepted-preview evidence from `goal-44`.
2. Run `spike-23` to refresh Vercel custom-domain, alias, DNS, and project
   constraints.
3. Plan `demo-1.mdkg.dev` promotion and DNS handoff in `task-623`.
4. Verify Vercel non-preview project/domain mapping in `task-624`.
5. Run live Browser/Chrome validation in `task-625` and `test-326`.
6. Record teardown, retirement, and canonical linking policy in `task-626` and
   `test-327`.

# Required Skills

- `select-work-and-ground-context`
- `verify-close-and-checkpoint`
- required plugin skill `browser:control-in-app-browser`
- required plugin skill `chrome:control-chrome`

# Required Checks

- accepted preview checkpoint from `test-325`
- current Vercel custom-domain and DNS research
- Vercel project, deployment, domain, and build-log verification
- DNS resolution proof for the selected `demo-N.mdkg.dev` host
- Browser and Chrome live validation
- no-secret and public-claims audit
- canonical mdkg.dev links only accepted demos
- teardown and retirement policy

# Acceptance Criteria

- `goal-46` stays blocked/paused until `test-325` passes.
- `demo-1.mdkg.dev` is the first durable demo hostname unless execution
  evidence requires a different available `N`.
- Durable demo hosting is separated from preview URL generation.
- Rejected or retired demos are removed, noindexed, or redirected by policy.
- Canonical mdkg.dev remains stable and links only accepted demos.

# Definition Of Done

- Goal condition is achieved.
- Required checks have evidence.
- Completion evidence is recorded in the goal.

# Stop Conditions

- Goal is blocked beyond the configured attempt limit.
- Required context or permissions are missing.
- Budget or safety constraints prevent continued work.

# Current State

- Created on 2026-06-29 as a paused follow-up to `goal-44`.
- Blocked by `test-325`; no accepted preview exists yet.
- Context decisions/design records are `dec-57`, `edd-33`, and `edd-59`; they
  are linked from concrete nodes to keep goal routing focused on actionable
  work.

# Iteration Log

- 2026-06-29: Created by graph-only enhancement pass; no Vercel or DNS mutation
  performed.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- Planning checkpoint: `chk-327`.
- Hosting evidence pending and blocked by `test-325`.
