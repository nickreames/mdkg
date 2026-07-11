---
id: edd-70
type: edd
title: Loop hardening and v0.5.0 release candidate contract
tags: [loop, hardening, release, 0.5.0]
owners: []
links: []
artifacts: []
relates: [goal-61]
refs: [goal-61, goal-58, goal-59, edd-66, edd-69, dec-65, dec-66, dec-67]
aliases: [loop-hardening-release-candidate-contract]
created: 2026-07-10
updated: 2026-07-10
---
# Overview

Harden the first-class loop implementation so `v0.5.0` can ship with truthful
readiness, provenance, side-effect, and packaged-consumer behavior. The contract
addresses gaps found after `goal-58` and `goal-59`, especially SQLite dry-run ID
consumption and readiness evidence satisfying unrelated requirements.

# Architecture

- Command planning and execution are separate phases. Dry-run may calculate a
  tentative ID but cannot reserve it or persist any graph, index, event, or DB
  state.
- Descriptor-declared read commands use a non-persisting index projection.
- Readiness is evaluated per stable question, action, evidence-lane, and waiver
  identity instead of by non-empty aggregate ref arrays.
- Routing ranks authorized nonterminal children and recovery work before
  returning blocked.
- Fork provenance retains template identity and content hash. Drift produces an
  inspectable warning; forks are never silently rewritten.

# Data model

- Loop remains one node type in template, forked, and run-bearing roles.
- Pre-run questions, approval requirements, evidence lanes, and waivers have
  stable keys referenced by typed decision, approval, evidence, and waiver refs.
- A fork records its template ref and source hash.
- Runs, outputs, goals, tasks, tests, spikes, proposals, checkpoints, and
  receipts remain linked nodes or events rather than new loop subtypes.

# APIs / interfaces

- Preserve `mdkg loop list/show/fork/plan/runs/next` and `mdkg new loop`.
- `loop fork --dry-run` returns a preview without consuming durable state.
- `loop list`, `show`, and `plan` expose stale provenance additively.
- `loop plan` and `next` expose item-level readiness and actionable routing in
  stable structured output.
- Existing goal and Omni interfaces remain unchanged.

# Failure modes

- Preview ID races are acceptable only when documented as tentative; durable
  reservation occurs during committed execution.
- Missing or invalid typed refs fail with the exact requirement identity.
- Optional approval-gated lanes do not block unrelated pre-approved work.
- A stale template warns and offers explicit re-fork/reconcile follow-up.
- Installed-package or SQLite-only failures block release-candidate closeout.

# Observability

- Dry-run state snapshots compare SQLite rows/sequences, JSON indexes, events,
  IDs, and repository files before and after execution.
- Readiness JSON reports each requirement and the evidence that satisfied it.
- Dogfood checkpoints record completed, waived, gated, and remaining lanes.

# Security / privacy

Read-only audit loops remain non-mutating outside explicitly authorized mdkg
evidence nodes and local caches permitted by their pre-run answers. No secrets,
raw provider payloads, credentials, or private runtime state belong in loop
metadata or release evidence.

# Testing strategy

- Unit and CLI tests use both JSON and SQLite backends.
- Tarball smoke initializes a clean consumer workspace and exercises all seven
  seeded templates.
- CI runs supported Node versions.
- Corrected security and backend/API/CLI audit forks dogfood continuation,
  readiness, approvals, evidence, and closeout.
- Goal and Omni semantic-file regression suites remain required.

# Rollout plan

Complete `goal-61` without changing package versions. Its checkpoint becomes
the source-of-truth capability input to public planning in `goal-62` and the
release prerequisite for `goal-64`.
