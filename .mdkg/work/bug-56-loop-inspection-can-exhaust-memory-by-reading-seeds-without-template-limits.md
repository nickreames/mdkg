---
id: bug-56
type: bug
title: Loop inspection can exhaust memory by reading seeds without template limits
status: backlog
priority: 1
tags: [release-0.6.0, security]
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

Goal: remediate g86-graph-003 from the completed fresh Standard scan
9d6a2ca2-4273-45de-9013-20452c7651d0 under Task837. Publication blocker.
Severity: low. Loop list, seed show, fork and provenance lookup read regular seed bodies without the configured file, aggregate or catalog limits. A supplied large seed or many seeds can stall or terminate local inspection or authoring despite the normal template safety envelope.

Repository content can exhaust the local operator-triggered CLI, but no shared remote service is established. The attack needs large input, unlike the separately reported symlink and small numeric-ID paths.

Context: frozen source e42f1d93497119c9a1f8684df926510da91dea42,
draft package0.6.0. This is source-validated evidence, not executed exploit proof.
Earlier published versions were not assessed by that offline current-source scan.
Establish affected-version bounds from exact local package/source evidence during
remediation; do not assume published0.5.2 is affected.

Owner: mdkg-project-agent, one repository writer under the explicit Goal86 run. Allowed: this bounded generic source remedy, directly required helpers, regression/installed fixtures, release-critical truth corrections and sanitized mdkg evidence. Preserve authored history, selected Goal73, runtime DB, Demo3 bundles and unrelated custody. No canonical migration, bundle/subgraph refresh, remote Git, publication, provider/deployment, cross-project writes, global configuration or history rewrite. Stop for a materially new architecture/security decision; no documentation-only waiver.

# Reproduction Steps

Use synthetic, owned disposable fixtures only. Reproduce the source-bound
failure before changing its control, retain passing controls, and bind the
commands/results to exact source and installed artifact hashes. Never run
malicious inputs against canonical state or recovered Demo3 payloads.

1. Bound actual bytes, aggregate bytes, seed count, directory entries and traversal depth.
2. Cover oversized regular body, many moderate seeds, and excessive unrelated directory entries.
3. Exercise list, show, fork, provenance and new-loop suggestions with unchanged authored state on refusal.

# Expected vs Actual

Expected: the owning generic operation enforces its intended authority,
integrity and resource boundaries before effects and emits honest receipts.
Actual: The alternate loop readers omit all normal template budget arguments. The shared reader calls readFileSync when maxBytes is absent; frontmatter line/list checks do not cap the seed body. Valid regular seeds over the default 8MiB envelope are therefore fully read. This is independently reachable through list, show, fork, provenance and new-loop suggestion routes.

# Suspected Cause

The loop-specific readers do not reuse `localTemplateLimits`. `loadSeedTemplates` walks and enumerates the catalog and retains every seed string and parsed body. Direct `resolveLoopTemplate` reads the selected file without `maxBytes`. Both reach `parseFrontmatter`, which first splits the entire input. Provenance lookup can reload the catalog. Containment rejects static links but does not limit valid regular-file input.

Source anchors:
- src/commands/loop.ts:423-432 (root_control)
- src/commands/loop.ts:477-482 (root_control)
- src/commands/loop.ts:519-522 (entrypoint)
- src/commands/loop.ts:1839-1844 (entrypoint)
- src/commands/loop.ts:1912-1925 (entrypoint)
- src/commands/new.ts:99-121 (entrypoint)
- src/graph/frontmatter.ts:190-202 (sink)

# Fix Plan

Apply localTemplateLimits to every loop seed read, including actual-byte enforcement, cumulative bytes, seed count, directory-entry count, and depth. Reuse a bounded catalog within one command instead of reloading every seed for each provenance check. Test oversized bodies, aggregate overflow, directory-entry overflow, and all list/show/fork/new-loop entry points.

Owned source allowlist:
- src/commands/loop.ts
- src/commands/new.ts
- src/graph/frontmatter.ts

Directly required shared helpers and regression files may be added only for
this control. Keep different findings separately attributable even when the
implementation shares a helper. Completed older bug milestones are historical
evidence, not reopened or substituted for this new regression.

# Test Plan

- Bound actual bytes, aggregate bytes, seed count, directory entries and traversal depth.
- Cover oversized regular body, many moderate seeds, and excessive unrelated directory entries.
- Exercise list, show, fork, provenance and new-loop suggestions with unchanged authored state on refusal.
- Failing-before/passing-after controls with no unintended filesystem, Git-index,
  selected-state or runtime-state effects; record all skips and missing proof.
- Current-source tests and exact installed package on Node24.15.0/24.18.0/26,
  macOS and Linux x86_64/ARM64 where the case is platform-sensitive.
- Bind this finding to test488 and relevant existing installed families; Task828
  independently reviews the complete remediation range after fixes are frozen.
- Local bug completion requires a verified remedy; final release clearance still
  requires independent review, full qualification and the new exact artifact seal.

# Links / Artifacts

- .mdkg/artifacts/goal-86/task-837-standard-security-audit.json
- root:task-837; root:test-488; root:task-828; root:test-487
- Canonical raw finding/report remains plugin-owned; only sanitized evidence,
  hashes and regression/disposition references belong in this graph.

## Current State

Planned / backlog. Source finding accepted; no remediation or runtime
verification has been performed for this new record. Goal85 remains paused.
