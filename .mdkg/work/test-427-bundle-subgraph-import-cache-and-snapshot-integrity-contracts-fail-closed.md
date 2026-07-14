---
id: test-427
type: test
title: Bundle subgraph import cache and snapshot integrity contracts fail closed
status: done
priority: 1
epic: epic-242
tags: [security, regression, v0.5.0]
owners: []
links: []
artifacts: []
relates: [goal-69]
blocked_by: []
blocks: []
refs: [edd-75, dec-80]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-07-12
updated: 2026-07-12
---
# Overview

Prove transported and derived state cannot claim verification, projection, or seal
success without complete runtime schema, integrity, identity, and state binding.

# Target / Scope

`task-766` through `task-768` excluding public body confidentiality, which is
covered by `test-428`.

# Preconditions / Environment

Temporary bundle/subgraph/snapshot fixtures and isolated project databases.

# Test Cases

- Invalid manifest version/tool/profile/types/counts/indexes and self-consistent
  forged claims fail before verified success.
- Required subgraph indexes are bound to the verified payload.
- Import identities are validated before path planning.
- Queue policy is rechecked on the sealed copy; removed runtime hash invalidates
  stale evidence.
- Materializer events cannot cross writer project/branch authority.

# Results / Evidence

- Foreign bundle manifests are parsed from unknown and validate tool/version,
  profile, workspaces, files/counts, hashes, and all required indexes.
- Subgraphs bind generated index bytes to manifest rows and reject forged public
  projection state before importing nodes.
- Graph import identities are validated before destination path planning.
- Snapshot verification derives and rechecks queue policy from sealed bytes,
  requires runtime source identity, and rejects event/materializer scope crossing.
- Passed 619 package tests, 8 public-release tests, bundle/subgraph smokes, and DB
  event/materializer/snapshot smokes. See `chk-501` through `chk-503`.

# Notes / Follow-ups

- Closed without adding publisher signing; runtime profile and payload validation
  are the authoritative local controls for this release.
