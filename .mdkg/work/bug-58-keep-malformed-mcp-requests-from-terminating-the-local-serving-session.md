---
id: bug-58
type: bug
title: Keep malformed MCP requests from terminating the local serving session
status: backlog
priority: 1
tags: [release-0.6.0, correctness]
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

Malformed JSON-RPC null and null batch elements reach raw.id before request-shape validation and terminate the single local stdio session. This is a confirmed correctness/publication blocker, not an additional security finding: no cross-session or privilege impact was established.

Context: frozen draft0.6.0 source e42f1d93497119c9a1f8684df926510da91dea42.
Affected-version assessment is candidate-only until exact earlier local package
proof exists. Do not change Task837's fourteen-finding count.

Owner: mdkg-project-agent, one repository writer under the explicit Goal86 run. Allowed: this bounded generic source remedy, directly required helpers, regression/installed fixtures, release-critical truth corrections and sanitized mdkg evidence. Preserve authored history, selected Goal73, runtime DB, Demo3 bundles and unrelated custody. No canonical migration, bundle/subgraph refresh, remote Git, publication, provider/deployment, cross-project writes, global configuration or history rewrite. Stop for a materially new architecture/security decision; no documentation-only waiver.

# Reproduction Steps

Use owned disposable synthetic fixtures and exact installed bytes. Reproduce
before correction and retain all positive controls; never mutate canonical
Git metadata, runtime DB or protected graphs to exercise refusal.

# Expected vs Actual

Malformed JSON-RPC null and null batch elements reach raw.id before request-shape validation and terminate the single local stdio session. This is a confirmed correctness/publication blocker, not an additional security finding: no cross-session or privilege impact was established.

# Suspected Cause

src/commands/mcp.ts:652-716 casts unknown parsed values to JsonRpcRequest and dereferences raw.id before entering its catch.

# Fix Plan

Validate non-null non-array request objects and required JSON-RPC fields before access. Emit the protocol-appropriate invalid-request response and continue processing later requests. Preserve valid notifications, batches, IDs, existing limits and fixed read-only dispatch.

Owned source and directly required regression scope:
- src/commands/mcp.ts
- tests/commands/mcp.test.ts

# Test Plan

- null, booleans, numbers, strings, empty objects, nested arrays and mixed valid/invalid batches do not end the session.
- A valid ping and graph read after each invalid input still complete; notification semantics and normal IDs remain unchanged.
- Bounded malformed input, max batch/depth/line limits and unchanged filesystem/Git/runtime inventories remain effective.
- Bind failing-before and passing-after evidence to source/package hashes.
- Test488 and Task828 independently verify current remediation; final installed
  qualification and macOS/Linux acceptance remain separate from local closure.

# Links / Artifacts

- .mdkg/artifacts/goal-86/task-837-standard-security-audit.json
- g86-dbwork-001 rejected security candidate; Task837 source coverage
- root:goal-86; root:goal-84; root:test-488; root:task-828; root:test-487

## Current State

Planned / backlog. No fix or runtime/platform clearance claimed.
