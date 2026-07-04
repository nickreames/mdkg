---
id: task-650
type: task
title: define generic remote Git project-memory primitive surface
status: todo
priority: 1
parent: goal-51
tags: [remote-git, project-memory, generic-capability, agent-loop]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-51, goal-50, test-337]
context_refs: []
evidence_refs: []
aliases: []
skills: [service-boundary-ownership-check, verify-close-and-checkpoint]
created: 2026-07-03
updated: 2026-07-03
---
# Overview

Define the generic mdkg-owned primitive surface for remote Git and
project-memory work before any implementation or public release claims are made.

This task keeps remote repository descriptors, authenticated Git access refs,
`.mdkg` graph discovery, accepted revision evidence, history/why/next-work
queries, and agent working-loop primitives generic. Product-specific runtime
policy remains downstream-owned.

# Acceptance Criteria

- Remote Git repositories are modeled as generic source descriptors and
  revision refs suitable for many mdkg consumers.
- Authenticated Git access is modeled only through opaque access refs,
  capability refs, policy refs, or proof hashes; no credentials or live auth
  material may be stored in mdkg.
- `.mdkg` graph discovery covers repo-local graphs, remote graph descriptors,
  bundle/subgraph relationships, and stale/fresh evidence without assuming a
  product runtime.
- Accepted revisions are represented as explicit evidence such as branch,
  commit SHA, bundle hash, acceptance actor/ref, validation receipt, and
  timestamp, not as a product-specific deployment policy.
- History, why, and next-work queries are specified as generic graph/query
  capabilities over mdkg nodes, events, checkpoints, accepted revisions, and
  validation receipts.
- Agent working-loop primitives are generic: select, inspect, pack, claim,
  update, validate, checkpoint, handoff, and close with evidence.
- Any future implementation or publication is routed to a later explicit
  mdkg-owned execution goal, not the 0.4.1 publish lane.

# Files Affected

List files/directories expected to change.

- `.mdkg/work/**` planning nodes
- `.mdkg/design/**` decisions or EDDs if implementation planning needs durable
  architecture
- `.mdkg/skills/**` and configured mirrors only when a repeatable workflow needs
  skill updates

# Implementation Notes

- Treat product-specific runtime policy, room lifecycle, execution queues,
  sandbox lifecycle, backend economics, and deployment behavior as downstream
  consumer concerns.
- Use refs and hashes for external state. Do not store raw provider payloads,
  credentials, prompts, model output, queue bodies, or runtime state roots.
- Do not add public primitive names that include a downstream product name.
- Decide CLI/API surfaces, validation rules, docs, and package gates before any
  functional source edits.

# Test Plan

- `test-338`
- targeted public naming audit over this successor lane
- `mdkg validate --changed-only --json`
- `mdkg validate --summary --limit 20 --json`

# Links / Artifacts

- `goal-51`
- `goal-50`
- `test-337`
