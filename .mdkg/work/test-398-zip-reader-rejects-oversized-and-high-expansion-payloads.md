---
id: test-398
type: test
title: ZIP reader rejects oversized and high expansion payloads
status: done
priority: 2
parent: loop-5
tags: [security, zip, resource-exhaustion, regression]
owners: []
links: []
artifacts: []
relates: [loop-5, task-727, goal-61]
blocked_by: []
blocks: []
refs: [loop-5, task-727, goal-61]
context_refs: [spike-27, spike-30]
evidence_refs: [spike-27, spike-30]
aliases: []
skills: [verify-close-and-checkpoint]
cases: []
created: 2026-07-10
updated: 2026-07-10
---
# Overview

Verify that mdkg's ZIP reader enforces bounded resource use before returning archive contents while preserving valid bundle and subgraph round trips.

# Target / Scope

- `task-727`
- `src/util/zip.ts`
- Bundle, graph, and subgraph archive consumers

# Preconditions / Environment

Construct deterministic in-memory archives and use small override limits so the suite does not allocate dangerous payloads. No network or large fixture files are required.

# Test Cases

- Valid stored and deflated archives round trip.
- Raw archive byte, entry-count, filename-length, per-entry output, aggregate output, and expansion-ratio limits reject independently.
- Inflate output is bounded even when declared uncompressed size is forged.
- Truncated entries, duplicate names, unsupported methods, and declared/actual size mismatches reject clearly.
- Existing path traversal and integrity regressions remain green.

# Results / Evidence

Record focused ZIP results plus the existing archive-consumer regression results. Passing requires each rejection to occur without allocating output beyond the configured test bound.

# Notes / Follow-ups

- Production defaults should be conservative enough for mdkg artifacts while remaining finite.
- Public configurability is intentionally deferred unless real consumer evidence requires it.
