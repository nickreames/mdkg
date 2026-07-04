---
id: edd-63
type: edd
title: generic agent working-loop primitives and remote-memory release gates
tags: [remote-git, agent-loop, release-gates, generic-capability]
owners: []
links: []
artifacts: []
relates: []
refs: [goal-51, task-650, test-338, dec-61, dec-62, edd-62]
aliases: []
created: 2026-07-03
updated: 2026-07-03
---
# Overview

Plan how generic remote project memory participates in the mdkg agent working
loop without becoming coupled to a downstream runtime.

# Architecture

The generic agent working-loop primitives are:

- select: choose goal/task/test/spike from local or remote graph context;
- inspect: show cards, body, refs, evidence, accepted revisions, and blockers;
- pack: build bounded context from selected roots and source descriptors;
- claim: mark a local graph item active only in an authorized writable repo;
- update: record status, refs, artifacts, blockers, and evidence;
- validate: run graph, descriptor, credential-safety, and public naming checks;
- checkpoint: compress milestone evidence into durable mdkg records;
- handoff: produce refs-only sanitized downstream context;
- close: mark work done only after evidence and validation pass.

Remote descriptors can inform select/inspect/pack/query behavior. Mutating
operations remain repo-owned and require explicit writable authority.

# Data model

- Working-loop context: selected qid, source descriptor refs, accepted revision
  refs, pack profile, visibility policy, and validation receipt refs.
- Handoff context: bounded summaries plus source/accepted-revision/evidence
  refs.
- Mutation authority: explicit local writable repo state, never inferred from
  remote descriptor presence.

# APIs / interfaces

- Read-only remote inspect, pack, and query interfaces.
- Local claim/update/checkpoint interfaces that refuse remote mutation unless a
  later decision explicitly adds a safe write protocol.
- Public release gates that scan CLI help, docs, templates, generated refs,
  fixtures, and changelog/release notes for naming and credential safety.

# Failure modes

- Agent attempts to mutate a read-only remote source: fail with writable
  authority guidance.
- Product policy appears as public mdkg primitive naming: fail the public naming
  gate.
- Raw payload or credential appears in handoff/checkpoint output: fail the
  credential-safety gate.

# Observability

Working-loop receipts should include selected qid, source descriptor refs,
accepted revision refs, validation receipt refs, truncation state, and mutation
authority. They should not include raw payloads.

# Security / privacy

Remote memory support is refs-first. It must not store credentials, live auth
state, raw prompts, model output, provider dumps, queue bodies, or runtime state
roots.

# Testing strategy

- Read-only command tests for remote/source descriptors.
- Mutation-boundary tests for claim/update/checkpoint behavior.
- Handoff redaction tests.
- Public naming and credential-safety release contract before npm publish.

# Rollout plan

Ship through `goal-52` only after `goal-51` closes. Real npm publish, tag, push,
provider mutation, downstream mutation, or root bundle refresh remains
separately approval-gated.
