---
id: bug-58
type: bug
title: Keep malformed MCP requests from terminating the local serving session
status: done
priority: 1
tags: [release-0.6.0, correctness]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/bug-58-baseline.json, .mdkg/artifacts/goal-86/bug-58-full-verification.json, .mdkg/artifacts/goal-86/bug-58-installed-verification.json]
relates: []
blocked_by: []
blocks: []
refs: [task-837, goal-84, goal-86, task-828]
context_refs: [goal-86, goal-84, task-837]
evidence_refs: []
aliases: []
skills: []
created: 2026-09-17
updated: 2026-09-21
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

2026-09-21: Local remedy verified against source base
403c6bfd9b001485a08bdea63d25caaa935863c8. The shared request boundary accepts
unknown input and validates the non-null/non-array object, version/method,
finite valid ID and structured optional params before field access, notification
handling or tool dispatch. Batch members retain independent admission. Existing
transport framing, resource ceilings and read-only tool inventory are unchanged.

Fresh prepatch baseline:35 cases,22 pass/13 fail, including null request/batch
session termination and malformed IDs/params reaching normal dispatch. The new
tests send a valid ping and graph read after each malformed wire input and
compare complete filesystem inventories, including Git/runtime/selection sentinels.
Valid null/zero/negative/fractional/string IDs and notifications remain supported.
Request-envelope semantics follow https://www.jsonrpc.org/specification;
this does not claim new transport or protocol-version support.

Verification:41 focused cases,1993 full manifest-discovered tests,35 installed
cases each on Node24.15.0/24.18.0/26.0.0 (105 total), all pass with0 skips.
One bounded independent read-only reviewer found no concrete regression or
surviving malformed-wire route; source review is not final Security clearance.
Build, CLI/docs/workflow parity and full/changed graph checks pass; three
preserved stale-import warnings remain.

Exact intermediate tarball SHA256:
13cd35c621ffe000c8ffae0823e1718a04ba0d9414b37d1a8c2dfc4b971c7ffd.
All231 installed files unchanged. Local macOS arm64 proof only: Linux, Test488,
Task828, final coverage ladder and exact artifact seal remain required.
Published0.5.2 affectedness is unassessed. This closes a correctness blocker,
not another member of the fourteen security findings. Goal85 remains paused.
No blocked context, old reports, remote Git, publication or provider actions.
