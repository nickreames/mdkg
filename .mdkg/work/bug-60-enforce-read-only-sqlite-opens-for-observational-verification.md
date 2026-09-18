---
id: bug-60
type: bug
title: Enforce read-only SQLite opens for observational verification
status: backlog
priority: 1
tags: [release-0.6.0, observational]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [task-837, goal-84, goal-86, task-828]
context_refs: [goal-86, goal-84, task-837]
evidence_refs: []
aliases: []
skills: []
created: 2026-09-17
updated: 2026-09-17
---
# Overview

Observational status/validate/index-health paths open SQLite without explicit readOnly. Static source review did not establish an exploit or concrete native mutation, so this is a release-blocking observational-contract/platform gap, not an additional confirmed security finding.

Context: frozen draft0.6.0 source e42f1d93497119c9a1f8684df926510da91dea42.
Affected-version assessment is candidate-only until exact earlier local package
proof exists. Do not change Task837's fourteen-finding count.

Owner: mdkg-project-agent, one repository writer under the explicit Goal86 run. Allowed: this bounded generic source remedy, directly required helpers, regression/installed fixtures, release-critical truth corrections and sanitized mdkg evidence. Preserve authored history, selected Goal73, runtime DB, Demo3 bundles and unrelated custody. No canonical migration, bundle/subgraph refresh, remote Git, publication, provider/deployment, cross-project writes, global configuration or history rewrite. Stop for a materially new architecture/security decision; no documentation-only waiver.

# Reproduction Steps

Use owned disposable synthetic fixtures and exact installed bytes. Reproduce
before correction and retain all positive controls; never mutate canonical
Git metadata, runtime DB or protected graphs to exercise refusal.

# Expected vs Actual

Observational status/validate/index-health paths open SQLite without explicit readOnly. Static source review did not establish an exploit or concrete native mutation, so this is a release-blocking observational-contract/platform gap, not an additional confirmed security finding.

# Suspected Cause

src/core/project_db_migrations.ts:842-855 and src/graph/sqlite_index.ts:459 use writable-capable DatabaseSync connections during verification. Related snapshot readers must receive the same read-versus-write audit.

# Fix Plan

Use explicit read-only opens for genuinely observational callers; retain intentional writer connections only under supported mutation commands. Admit contained ordinary files and relevant sidecar state before native opens. Fail honestly on unsupported/read-only recovery states without creating DBs, sidecars or directories. Do not claim immutable-mode shortcuts are safe for active databases.

Owned source and directly required regression scope:
- src/core/project_db_migrations.ts
- src/graph/sqlite_index.ts
- src/core/project_db_snapshot.ts
- src/commands/status.ts
- src/commands/validate.ts
- src/commands/mcp.ts

# Test Plan

- Inspect closed, WAL/SHM, hot-journal, missing, malformed and permission-enforced read-only fixtures with complete before/after inventories.
- Compare status, validate, index verify and snapshot read routes on macOS and Linux x86_64/ARM64; native versus emulated results explicit.
- Keep intentional migrations, runtime queue writers, index rebuilds and snapshot sealing functional with exact ownership; no global configuration.
- Bind failing-before and passing-after evidence to source/package hashes.
- Test488 and Task828 independently verify current remediation; final installed
  qualification and macOS/Linux acceptance remain separate from local closure.

# Links / Artifacts

- .mdkg/artifacts/goal-86/task-837-standard-security-audit.json
- g86-architecture-001 rejected as unproven security impact; native effects remain unqualified
- root:goal-86; root:goal-84; root:test-488; root:task-828; root:test-487

## Current State

Planned / backlog. No fix or runtime/platform clearance claimed.
