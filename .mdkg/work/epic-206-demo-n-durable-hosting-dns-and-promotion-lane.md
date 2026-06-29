---
id: epic-206
type: epic
title: demo-N durable hosting DNS and promotion lane
status: blocked
priority: 2
tags: [demo, vercel, dns, hosting, promotion]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [test-325]
blocks: [spike-23, task-623, task-624, task-625, task-626, test-326, test-327]
refs: [goal-46, goal-44]
context_refs: [dec-57, edd-33, edd-59]
evidence_refs: []
aliases: []
skills: []
created: 2026-06-29
updated: 2026-06-29
---
# Goal

Promote only accepted mdkg demo previews to durable `demo-N.mdkg.dev` hosting
after refreshed Vercel/DNS research, explicit approval, and live validation.

# Scope

- Vercel custom-domain, alias, and DNS research.
- `demo-1.mdkg.dev` or next available `demo-N` promotion planning.
- Vercel project/domain/deployment verification.
- DNS resolution and live Browser/Chrome validation.
- Teardown, retirement, and canonical mdkg.dev linking policy.

# Milestones

- `spike-23` refreshes current hosting constraints.
- `task-623` writes the promotion and DNS handoff.
- `task-624` verifies Vercel/domain mapping.
- `task-625` runs live validation.
- `task-626` records lifecycle/linking policy.

# Out of Scope

- Starting before `test-325` records an accepted preview.
- Provider mutation without explicit approval.
- Linking rejected or retired demos from canonical mdkg.dev.

# Risks

- DNS or Vercel docs drift before execution.
- Demo host competes with canonical SEO.
- Rejected demo remains publicly reachable.
- Credentials or bypass tokens leak into mdkg evidence.

# Links / Artifacts

- `goal-46`
- `test-325`
- `dec-57`
- `edd-33`
- `edd-59`
