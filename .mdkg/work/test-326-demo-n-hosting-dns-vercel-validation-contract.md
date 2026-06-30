---
id: test-326
type: test
title: demo-N hosting DNS Vercel validation contract
status: blocked
priority: 2
epic: epic-206
parent: goal-46
tags: [demo, dns, vercel, hosting, test]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-624, task-625]
blocks: [test-327]
refs: [dec-57, edd-33, edd-59]
context_refs: [dec-57, edd-33, edd-59]
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
cases: [vercel project domain mapping is verified., dns records resolve to the intended demo host., live browser and chrome checks pass., no production promotion occurs without explicit approval evidence.]
created: 2026-06-29
updated: 2026-06-29
---
# Overview

Validate durable demo hosting through DNS, Vercel, Browser, and Chrome
evidence.

# Target / Scope

- `task-624`
- `task-625`
- selected `demo-N.mdkg.dev` host

# Preconditions / Environment

- Accepted preview exists.
- Explicit approval exists for Vercel/DNS mutation.
- Vercel and DNS state has been refreshed.

# Test Cases

- Vercel project domain mapping is verified.
- DNS records resolve to the intended demo host.
- Live Browser and Chrome checks pass.
- No production promotion occurs without explicit approval evidence.

# Results / Evidence

Pending.

# Notes / Follow-ups

- This test proves hosting currentness; it does not authorize canonical links.
