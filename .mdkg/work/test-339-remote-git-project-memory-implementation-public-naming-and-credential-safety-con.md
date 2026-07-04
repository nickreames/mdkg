---
id: test-339
type: test
title: remote Git project-memory implementation public naming and credential safety contract
status: blocked
priority: 1
parent: goal-52
tags: [remote-git, project-memory, naming-audit, credential-safety, release-gate]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-653, task-654, task-655]
blocks: []
refs: [goal-51, task-650, test-338, dec-61, dec-62, edd-62, edd-63]
context_refs: []
evidence_refs: []
aliases: []
skills: [service-boundary-ownership-check, verify-close-and-checkpoint]
cases: []
created: 2026-07-03
updated: 2026-07-03
---
# Overview

Validate the implementation/release contract for generic remote Git and
project-memory primitives.

# Target / Scope

- `goal-52`
- `task-653`
- `task-654`
- `task-655`
- source, docs, templates, generated references, fixtures, and release notes
  changed by the implementation lane

# Preconditions / Environment

- `goal-51` planning has closed.
- `task-651` grounded implementation scope.
- `task-653`, `task-654`, and `task-655` are done with evidence.

# Test Cases

- Public names are generic: source descriptor, remote source ref, access ref,
  policy ref, accepted revision, graph discovery, history query, why query,
  next-work query, and agent working loop.
- No public CLI/docs/template/fixture/release-note surface brands these
  primitives around a downstream product/runtime.
- Credential-shaped values are rejected or diagnosed: PATs, SSH keys, agent
  sockets, bearer tokens, provider auth payloads, and live secret values.
- Accepted revision evidence contains refs/hashes/timestamps/validation
  receipts without implying deployment or runtime policy.
- Remote graph inspection remains read-only unless an explicit writable local
  repo operation is authorized.
- Full package and docs gates pass before any publish recommendation.

# Results / Evidence

Pending.

# Notes / Follow-ups

- Real npm publish, tag, push, provider mutation, downstream mutation, and root
  bundle refresh require separate explicit approval.
