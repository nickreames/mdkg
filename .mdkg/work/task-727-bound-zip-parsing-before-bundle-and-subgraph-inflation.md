---
id: task-727
type: task
title: Bound ZIP parsing before bundle and subgraph inflation
status: done
priority: 2
parent: loop-5
tags: [security, zip, resource-exhaustion, hardening]
owners: []
links: []
artifacts: []
relates: [loop-5, goal-61, spike-27, spike-30, test-398]
blocked_by: []
blocks: []
refs: [loop-5, goal-61, spike-27, spike-30, test-398]
context_refs: [spike-27, spike-30]
evidence_refs: [spike-27, spike-30]
aliases: []
skills: [service-boundary-ownership-check, verify-close-and-checkpoint]
created: 2026-07-10
updated: 2026-07-10
---
# Overview

Bound untrusted ZIP parsing before bundle, graph, and subgraph archives can consume unbounded memory or CPU. Current integrity checks run after inflation, so a small high-expansion archive can exhaust resources before validation rejects it.

# Acceptance Criteria

- Reject archives exceeding configured raw-byte, entry-count, filename-length, per-entry output, total output, or expansion-ratio limits.
- Apply an inflate output cap before allocation completes, including for forged size metadata.
- Reject truncation, duplicate entry names, unsupported compression methods, and declared/actual size mismatches with clear diagnostics.
- Preserve normal mdkg archive round trips and existing path/integrity validation.
- Keep limits internal and overrideable by tests; do not add a dependency or public CLI flags in this release.

# Files Affected

- `src/util/zip.ts`
- ZIP, bundle, graph, and subgraph archive tests

# Implementation Notes

- Check raw size and structural metadata before entry inflation.
- Use zlib's output-length bound for compressed entries, then enforce aggregate and ratio limits.
- Count actual decoded bytes rather than trusting archive declarations.
- Centralize defaults so all callers inherit one security policy.

# Test Plan

- Run `test-398` cases for each independent limit and malformed archive class.
- Run existing bundle, graph, and subgraph import/export tests to prove compatibility.
- Run the complete test and packaged release-readiness ladders before closing `goal-61`.

# Links / Artifacts

- Earlier analysis: `spike-27`
- Release security finding: `spike-30`
- Regression contract: `test-398`
