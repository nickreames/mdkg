---
id: spike-23
type: spike
title: research current Vercel custom domain and DNS path for demo-N hosting
status: blocked
priority: 2
epic: epic-206
parent: goal-46
tags: [demo, vercel, dns, research, custom-domain]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [test-325]
blocks: [task-623]
refs: [dec-57, edd-33, edd-59]
context_refs: [dec-57, edd-33, edd-59]
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-06-29
updated: 2026-06-29
---
# Research Question

What is the current safest Vercel and DNS path for promoting an accepted mdkg
demo preview to durable `demo-N.mdkg.dev` hosting?

# Context And Constraints

- Blocked until `test-325` records an accepted preview checkpoint.
- Vercel and DNS docs/state must be refreshed at execution time.
- DNS and custom-domain mutation require explicit approval.

# Search Plan

- Inspect the accepted preview checkpoint from `goal-44`.
- Refresh Vercel project/deployment/domain state.
- Review current Vercel custom domain, branch domain, and alias behavior.
- Confirm DNS provider requirements for `demo-N.mdkg.dev`.

# Findings

Pending.

# Options And Tradeoffs

Pending.

# Recommendation

Pending.

# Follow-Up Nodes To Create

- Existing follow-up nodes are `task-623`, `task-624`, `task-625`,
  `task-626`, `test-326`, and `test-327`.

# Skill Candidates

- `verify-close-and-checkpoint`
- `browser-control-in-app-browser`
- `chrome-control-chrome`

# Data Structures And Algorithms Notes

- note 1

# UX Notes

- note 1

# Security Notes

- Do not store DNS credentials, Vercel tokens, cookies, bypass secrets, raw
  provider payloads, or private prompts in mdkg.

# mdkg.dev Launch Implications

- Canonical mdkg.dev should link only accepted durable demos.

# Evidence And Sources

Pending.
