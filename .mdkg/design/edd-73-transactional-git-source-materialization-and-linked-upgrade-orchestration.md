---
id: edd-73
type: edd
title: transactional Git source materialization and linked upgrade orchestration
tags: [git, materialization, accepted-revision, upgrade, project-memory]
owners: []
links: []
artifacts: []
relates: [goal-52, goal-60, goal-65, goal-66, goal-67, goal-68]
refs: [dec-61, dec-63, dec-64, dec-75, dec-76, dec-77, dec-78, dec-79]
aliases: [transactional-git-materialization, linked-repository-upgrade-orchestration]
created: 2026-07-11
updated: 2026-07-11
---

# Overview

mdkg already provides low-level Git inspect, clone, fetch, closeout,
push-readiness, and explicit push primitives. The next generic capability is a
fail-closed materialization transaction that accepts a versioned request,
proves caller-selected source identity, validates optional project memory, and
publishes a destination only after every policy gate passes.

A separate optional upgrade orchestrator can reuse the existing single-repo
`mdkg upgrade` receipt across one root and explicitly selected local child
repositories. It is not part of materialization and does not make subgraph
projections writable.

# Architecture

`mdkg git materialize --request <file|-> --json` is additive. Existing
`mdkg git clone` behavior remains unchanged. The materializer parses one JSON
request, validates policy and access capability evidence, resolves the target
ref, clones into a sibling temporary directory, verifies commit and optional
tree identity, applies submodule and project-memory discovery policy, and
atomically renames the accepted tree into its contained destination.

`mdkg upgrade --linked` is a later independent capability. It selects the root
plus enabled registered subgraphs with contained local `source_path` values,
then applies explicit include/exclude filters. It aggregates existing
single-repo upgrade plans and writes nothing unless every selected repository
passes preflight.

# Data model

The v1 materialization request contains:

- `schema: mdkg.git.materialize.request.v1`
- stable `source_ref`
- execution-time `repository_ref`
- opaque `access_ref` and declared auth capability
- full `target_ref`
- required expected commit and optional expected tree
- contained relative destination
- clone depth policy of `full` or a positive integer
- submodule policy `deny` or `ignore`
- project-memory policy `required`, `optional`, or `forbidden`
- optional correlation ref and refs-only evidence policy

Receipts are versioned JSON records. They contain bounded refs, hashes,
expected and observed object identities, policy outcomes, redaction state,
reason codes, and relative destination evidence. They never contain repository
bodies, credential values, auth socket paths, or unbounded Git output.

# APIs / interfaces

Materialization interface:

`mdkg git materialize --request <file|-> [--json]`

Linked upgrade interface:

`mdkg upgrade --linked [--include <path>]... [--exclude <alias-or-path>]... [--dry-run|--apply] [--json]`

The installed CLI version supplies one managed seed set to every selected
repository. Version resolution and installation remain operator-owned release
steps, not linked-upgrade behavior.

# Failure modes

Materialization fails before destination publication for unsafe or
credential-bearing repository refs, unavailable declared auth capability,
missing or moved target refs, commit/tree mismatch, unsupported object state,
unsafe destination ancestry, existing destinations, denied submodules,
invalid project memory, cancellation, timeout, or partial clone state.
Temporary state is removed and the accepted destination remains absent.

Linked upgrade performs strict all-target preflight. Planned write overlap with
dirty paths blocks all writes. Unrelated dirtiness is preserved and reported.
An unexpected race after apply begins stops remaining repositories and emits a
partial-application receipt; cross-repository rollback is not attempted.

# Observability

Both commands emit deterministic structured receipts with schema version,
selected inputs, ordered policy checks, bounded warnings/errors, mutation
status, and next actions. JSON failure mode exits nonzero while still emitting
the bounded receipt.

# Security / privacy

System Git remains the executor. mdkg checks only capability availability for
unauthenticated, `gh`, SSH-agent, credential-helper, or environment-mediated
access. It never resolves or stores secrets. Recursive submodules, repository
hooks, implicit push, repository-controlled execution, absolute destination
escape, and automatic `.gitmodules` discovery for linked upgrades are outside
v1.

# Testing strategy

Use neutral local bare/file fixtures, external-auth capability fixtures,
positive SHA-1/SHA-256 object-format cases, and a closed negative matrix for
identity, containment, cancellation, submodules, discovery, redaction, and
destination safety. Packed-package tests must prove the public command,
generated contract, docs, and runtime behavior agree without downstream
product naming.

Linked upgrade tests cover deterministic selection, include/exclude precedence,
duplicate canonical paths, symlink escape, missing `.mdkg`, dirty overlap,
strict no-write failure, idempotency, partial race receipts, and no
commit/push/sync/registration behavior.

# Rollout plan

1. Complete the current release program through `goal-64`.
2. Implement and validate the materialization contract in `goal-66`.
3. Publish and verify it through `goal-67`.
4. Let downstream consumers upgrade and execute their own profiles.
5. Pursue linked-repository upgrade orchestration independently through
   `goal-68`; it does not block materialization consumers.
