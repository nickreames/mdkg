---
id: edd-75
type: edd
title: v0.5.0 security remediation and release requalification contract
tags: [security, remediation, release, architecture]
owners: []
links: []
artifacts: []
relates: [goal-69]
refs: [goal-64, task-718, test-389]
aliases: []
created: 2026-07-12
updated: 2026-07-12
---
# Overview

Define the remediation architecture and proof contract for the 51 findings that
survived the v0.5.0 pre-publish audit. The findings are separate reachable
instances but cluster around a smaller set of missing owned controls. The design
must remove those root causes without weakening local-first behavior or release
verification.

# Architecture

The implementation has five layers:

1. **Filesystem authority**: one internal capability resolves an allowed root,
   rejects unsafe lexical components and linked ancestors, enforces canonical
   containment immediately before the sink, and distinguishes contained paths
   from explicitly operator-selected external destinations.
2. **Canonical-data authority**: Markdown and validated manifests remain source
   of truth. JSON/SQLite indexes, bundle manifests, imported projections, and
   snapshot metadata are untrusted until runtime schema and integrity checks pass.
3. **Workflow authority**: loop approvals, evidence, child completion, and next
   routing use exact typed identities and normalized actions. Read-only command
   descriptors use non-persisting projections.
4. **Resource authority**: count, byte, depth, recursion, and response budgets are
   checked before inflation, closure, body reads, or response construction.
5. **Release authority**: a 51-row closure matrix and fresh immutable-revision
   scan are required before Goal 64 may perform its first push.

# Data model

- `FindingClosure`: candidate ID, severity, owning task, affected sinks, fix or
  rejection evidence, regression refs, and final status.
- `ContainedPath`: declared root, operation (`read`, `create`, `replace`,
  `delete`), normalized relative identity, canonical target, and link policy.
- `ValidatedProjection`: canonical source digest, schema version, visibility,
  profile, bounded counts, and projection payload.
- `TypedAuthority`: required action/lane identity, decision ref, approval ref,
  evidence ref, and completion state.
- `ResourceBudget`: maximum files, bytes, nodes, depth, inflated bytes, request
  bytes, response bytes, and deterministic truncation/error behavior.

Every final finding maps to exactly one closure row. Shared fixes may satisfy many
rows, but each row retains its own regression evidence.

# APIs / interfaces

- Internal safe-path helpers replace direct `path.resolve` plus later filesystem
  calls at security-sensitive sinks. Callers must declare their allowed root and
  operation; arbitrary external output remains an explicit separate capability.
- Runtime parsers accept `unknown` and return validated bundle/cache/snapshot
  contracts; TypeScript casts are not validation.
- Loop projection helpers return typed readiness and authorization outcomes.
- CLI behavior remains compatible for valid inputs. Unsafe linked paths,
  malformed projections, unauthorized lanes, and over-budget inputs fail before
  side effects with stable structured errors.

# Failure modes

- **TOCTOU or linked ancestry**: repeat canonical/no-follow enforcement at the
  final sink; never rely only on planning-time checks.
- **Partial multi-file mutation**: validate the complete plan before writes and
  use staged/transactional replacement or compensating cleanup.
- **Stale/forged cache**: reject or rebuild from canonical source in memory;
  read-only routes must not persist the rebuild.
- **Mixed authority**: do not let existence alone satisfy typed evidence or
  approval requirements.
- **Budget exhaustion**: reject before expensive work and return deterministic
  bounded receipts.
- **Regression hidden by aggregation**: the exact closure matrix fails if any
  candidate lacks a direct test and final disposition.

# Observability

Structured receipts should identify the command, declared boundary, validation
stage, and stable error code without exposing external file contents or secrets.
Tests record before/after filesystem, SQLite ID, event, and index state. The fresh
scan records target revision, closed coverage, candidate counts, and zero
release-blocking findings.

# Security / privacy

Repository content, imported bundles, caches, symlinks, frontmatter, and agent
context are attacker-influenced data. Operator intent authorizes the documented
operation, not an undeclared external target. Public projections must re-establish
visibility from canonical state. Approval URIs are references, not proof, unless
resolved to the required typed decision and status.

# Testing strategy

- Unit-test lexical and canonical containment, symlink ancestors, final-component
  links, non-existing targets, replace/delete behavior, and platform variance.
- Exercise every affected command family in disposable roots and assert outside
  sentinels remain unchanged.
- Test runtime schemas with malformed, self-consistent, stale, and visibility-
  confused projections.
- Snapshot filesystem, SQLite, IDs, events, and index hashes around every
  read-only route.
- Test budgets at limit, over limit, nested, duplicate, cyclic, and inflated
  cases.
- Preserve existing CLI/JSON envelopes and run all package, graph, docs, site,
  DB, loop, and installed-package regressions.
- Finish with the exact 51-row matrix and a clean fresh scan.

# Rollout plan

1. Implement and prove the shared path capability.
2. Migrate high-severity destructive/read-write sinks first.
3. Migrate remaining containment sinks and land projection/authorization/budget
   controls in independent reviewable tasks.
4. Run the 51-row regression matrix and complete local prepublish verification.
5. Run a fresh immutable-revision security scan.
6. Reactivate Goal 64 only after `test-434` and `test-389` prove no unresolved
   release blocker. Goal 64 retains ownership of push, publish, global install,
   activation, deploy, and post-publish verification.
