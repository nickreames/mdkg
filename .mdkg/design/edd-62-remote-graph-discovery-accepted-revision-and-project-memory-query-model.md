---
id: edd-62
type: edd
title: remote graph discovery accepted revision and project-memory query model
tags: [remote-git, project-memory, query-model, accepted-revision]
owners: []
links: []
artifacts: []
relates: []
refs: [goal-51, task-650, test-338, dec-61, dec-62]
aliases: []
created: 2026-07-03
updated: 2026-07-03
---
# Overview

Plan the generic architecture for discovering remote `.mdkg` project memory,
recording accepted source revisions, and querying history/why/next-work without
implementing it in the planning lane.

# Architecture

The future implementation should treat remote project memory as three separable
surfaces.

1. Source discovery resolves a local or remote source descriptor, `.mdkg` root
   location, registered workspace paths, bundles, and subgraph descriptors.
2. Accepted revision evidence records the source state an operator or runtime
   accepted for planning or execution.
3. Project-memory queries explain graph history, why a state exists, and which
   work should be selected next.

The same model must work for local graphs, materialized subgraphs, remote
descriptors, and bundle snapshots.

# Data model

- Source descriptor: source id, source kind, repository ref, default ref, path
  filters, access ref, visibility, and freshness policy ref.
- Discovery receipt: source id, fetched-at timestamp, remote HEAD, commit SHA,
  bundle hash, stale/fresh status, and validation receipt ref.
- Accepted revision: source id, branch/tag/commit/tree or bundle hash,
  accepted-by ref, accepted-at timestamp, validation receipt ref, supersedes
  ref, and rollback ref.
- Query result: qids, source refs, accepted revision refs, checkpoint refs,
  validation receipt refs, and bounded summaries.

# APIs / interfaces

- Read-only graph discovery over local roots, source descriptors, bundles, and
  subgraph refs.
- `history` query over nodes, events, checkpoints, accepted revisions, and
  validation receipts.
- `why` query over decisions, EDDs, PRDs, checkpoints, and evidence refs.
- `next-work` query over goal scope, blockers, status, priority, stale
  evidence, and accepted revision context.

# Failure modes

- Missing source: report a missing descriptor or inaccessible ref without
  guessing.
- Stale source: report freshness failure and last-known accepted revision.
- Credential-shaped value: fail validation or emit a high-severity diagnostic.
- Ambiguous graph root: require an explicit source/path ref.
- Private source in public output: fail closed unless visibility is explicitly
  safe.

# Observability

Receipts should summarize source id, revision hashes, stale/fresh state,
validation status, and query truncation. They must not copy raw provider
payloads.

# Security / privacy

Store refs, hashes, and policy ids only. Do not store raw credentials, PATs, SSH
keys, agent sockets, raw prompts, raw model output, queue bodies, provider
dumps, or runtime state roots.

# Testing strategy

- Descriptor parsing and validation fixtures.
- Accepted revision evidence fixtures.
- Stale/fresh classification tests.
- Query output tests that prove refs-only bounded output.
- Public naming and credential-safety audits.

# Rollout plan

Route implementation to `goal-52`. Do not claim this behavior in a release until
source, tests, docs, generated references, templates, package dry-run, public
naming audit, and credential-safety fixtures pass.
