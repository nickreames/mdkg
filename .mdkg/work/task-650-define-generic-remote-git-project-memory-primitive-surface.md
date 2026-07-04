---
id: task-650
type: task
title: define generic remote Git project-memory primitive surface
status: done
priority: 1
parent: goal-51
tags: [remote-git, project-memory, generic-capability, agent-loop]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: [test-338]
refs: [goal-51, goal-50, test-337, dec-61, dec-62, edd-62, edd-63, goal-52]
context_refs: [dec-61, dec-62, edd-62, edd-63, goal-52]
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
  revision refs suitable for many mdkg consumers. See `dec-61`.
- Authenticated Git access is modeled only through opaque access refs,
  capability refs, policy refs, or proof hashes; no credentials or live auth
  material may be stored in mdkg. See `dec-62`.
- `.mdkg` graph discovery covers repo-local graphs, remote graph descriptors,
  bundle/subgraph relationships, and stale/fresh evidence without assuming a
  product runtime. See `edd-62`.
- Accepted revisions are represented as explicit evidence such as branch,
  commit SHA, bundle hash, acceptance actor/ref, validation receipt, and
  timestamp, not as a product-specific deployment policy.
- History, why, and next-work queries are specified as generic graph/query
  capabilities over mdkg nodes, events, checkpoints, accepted revisions, and
  validation receipts.
- Agent working-loop primitives are generic: select, inspect, pack, claim,
  update, validate, checkpoint, handoff, and close with evidence. See `edd-63`.
- Any future implementation or publication is routed to a later explicit
  mdkg-owned execution goal, not the 0.4.1 publish lane. See `goal-52`.

# Primitive Surface

## Remote Source Descriptor

Generic record for a repository or bundle source. Candidate fields:

- `source_id`: stable mdkg-local source id.
- `source_kind`: `git_remote`, `git_local`, `bundle`, or future generic source
  kinds.
- `repository_ref`: provider-neutral repo locator or URI.
- `default_ref`: branch, tag, or symbolic ref.
- `path_filters`: optional project-memory paths such as `.mdkg/`.
- `access_ref`: opaque access handle, never a credential value.
- `visibility`: public/internal/private classification.
- `freshness_policy_ref`: optional policy for stale/fresh checks.

## Accepted Revision Evidence

Evidence that a source state was accepted for planning or execution. Candidate
fields:

- `source_id`
- `branch` / `tag` / `commit_sha`
- `tree_hash` or `bundle_hash`
- `accepted_by_ref`
- `accepted_at`
- `validation_receipt_ref`
- `supersedes_revision_ref`
- `rollback_revision_ref`

## Project-Memory Queries

Generic query capabilities:

- `history`: changes across graph nodes, events, checkpoints, accepted
  revisions, and validation receipts.
- `why`: linked rationale across decisions, EDDs, PRDs, checkpoints, and
  evidence refs.
- `next-work`: scoped actionable work ranked by goal, blockers, status,
  priority, stale evidence, and accepted revision context.

## Agent Working Loop

Generic loop primitives:

- select
- inspect
- pack
- claim
- update
- validate
- checkpoint
- handoff
- close

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
- Do not claim these primitives are part of `mdkg@0.4.1`.

# Test Plan

- `test-338`
- targeted public naming audit over this successor lane
- `mdkg validate --changed-only --json`
- `mdkg validate --summary --limit 20 --json`

# Links / Artifacts

- `goal-51`
- `goal-50`
- `test-337`
- `dec-61`
- `dec-62`
- `edd-62`
- `edd-63`
- `goal-52`
