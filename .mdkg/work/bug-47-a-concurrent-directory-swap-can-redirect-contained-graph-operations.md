---
id: bug-47
type: bug
title: A concurrent directory swap can redirect contained graph operations
status: backlog
priority: 1
tags: [release-0.6.0, security, deferred, post-0.6.0]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/bug-47-recorded-0.5.2-source-assessment.json, .mdkg/artifacts/goal-86/bug-47-macos-fd-path-feasibility.json, .mdkg/artifacts/goal-86/filesystem-feasibility/receipt.json]
relates: []
blocked_by: []
blocks: []
refs: [task-837, goal-84, goal-86, task-828, dec-97, epic-256, goal-87, dec-98]
context_refs: [goal-86, goal-84, task-837]
evidence_refs: [chk-651]
aliases: []
skills: []
created: 2026-09-17
updated: 2026-09-28
---
# Overview

## Current disposition - 2026-09-28

**DEFERRED / UNRESOLVED**, owned by paused Goal87 under Dec98. Nick explicitly
removed remediation of this finding from the 0.6.0 completion gate while
keeping mdkg Node-only. Lifecycle is backlog with a deferred tag because the
schema has no deferred status. This is not accepted, fixed, closed, qualified,
or a standing authorization to implement native code. Preserve the medium
severity and all evidence below. Goal86 must disclose the limitation and
independently verify the remaining in-scope release work. Older blocker/native
decision language below is historical and superseded only for 0.6.0 routing.

2026-09-28 scoped continuation supersedes Dec97 only for owned local
filesystem feasibility experiments and a local fail-closed CI stub. The linked
filesystem-feasibility receipt records a deterministic validation-to-sink
ancestor swap in current Node code: read reached outside bytes, append changed
an outside sentinel, and remove deleted it. An experimental C fixture then
held directory descriptors and kept read, create, append, replace, and remove
inside the original directory after the pathname swap on macOS and isolated
Ubuntu ARM64. This is promising OS-primitive evidence, not a production mdkg
remedy, cross-process exploit proof, or release clearance. Bug47 stays blocked.

Dec97's original Node-only/no-VM routing is historical. The new local scope
does not authorize native runtime integration, hosted CI, or a waiver. Repeated
pathname checks remain insufficient for the stated invariant.

Goal: remediate g86-baseline-004 from the completed fresh Standard scan
9d6a2ca2-4273-45de-9013-20452c7651d0 under Task837. Publication blocker.
Severity: medium. The shared containment helper checks ancestors, then passes a pathname to later opens, renames and deletes. A narrower-rights local actor who can replace an ancestor can redirect an authorized operation outside the graph; skill mirroring supplies a concrete read-to-copy disclosure path.

Outside-root read/write authority can have high impact, but requires concurrent directory replacement rights and a race. Exposure is conditional on a shared or otherwise attacker-mutable namespace, not ordinary Markdown alone.

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

1. Use synchronized ancestor swaps on macOS/Linux for read-to-mirror, exclusive create, append, replacement and removal.
2. Prove outside sentinels remain unread/unmodified and operations fail closed.
3. Verify legitimate native Git worktree and private-checkout workflows remain supported.

# Expected vs Actual

Expected: the owning generic operation enforces its intended authority,
integrity and resource boundaries before effects and emits honest receipts.
Actual: Between path validation and open, replacing a writable ancestor with a link to a victim-readable private directory changes the resolved regular file without violating the leaf no-follow/type checks. The read bytes flow into the skill tree and later mirror. Analogous mutable-ancestor windows exist at mutation sinks, subject to their individual target constraints.

# Suspected Cause

inspectPath validates the present pathname components and returns absolutePath. withContainedPathSink invokes later filesystem operations that resolve those components again. Final-component O_NOFOLLOW and regular-file fstat checks do not bind the opened object to the previously inspected ancestors. Skill inventory retains read bytes and materializes them into mirrors; pathname create/append/rename/remove share the broken ancestry guarantee.

Source anchors:
- src/core/filesystem_authority.ts:137-201 (root_control)
- src/core/filesystem_authority.ts:222-236 (propagation)
- src/core/filesystem_authority.ts:362-398 (propagation)
- src/core/filesystem_authority.ts:436-487 (propagation)
- src/core/filesystem_authority.ts:502-510 (propagation)
- src/commands/skill_mirror.ts:123-139 (propagation)
- src/commands/skill_mirror.ts:189-205 (propagation)

# Fix Plan

Anchor traversal and operations to trusted directory descriptors with no-follow checks for every component on supported platforms, or enforce and verify a namespace whose ancestors cannot be replaced by less-trusted actors, including ACL and ownership checks. Rechecks alone do not eliminate the race.

Owned source allowlist:
- src/core/filesystem_authority.ts
- src/commands/skill_mirror.ts

Directly required shared helpers and regression files may be added only for
this control. Keep different findings separately attributable even when the
implementation shares a helper. Completed older bug milestones are historical
evidence, not reopened or substituted for this new regression.

# Test Plan

- Use synchronized ancestor swaps on macOS/Linux for read-to-mirror, exclusive create, append, replacement and removal.
- Prove outside sentinels remain unread/unmodified and operations fail closed.
- Verify legitimate native Git worktree and private-checkout workflows remain supported.
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
- .mdkg/artifacts/goal-86/bug-47-macos-fd-path-feasibility.json
- root:task-837; root:test-488; root:task-828; root:test-487
- Canonical raw finding/report remains plugin-owned; only sanitized evidence,
  hashes and regression/disposition references belong in this graph.

## Current State

2026-09-25 bounded Node-only feasibility: under an explicit Goal86 claim, two
owned disposable macOS arm64/Node26 probes held an open directory descriptor
and tested `/dev/fd/<fd>/item`. The child read returned ENOENT both before and
after replacing the original directory pathname; `/dev/fd/<fd>` itself stat'ed
as a directory but readdir returned ENOTDIR. All matching fixture roots were
removed. The linked receipt binds the exact source revision, synthetic setup,
results and limits. This rules out that simple macOS descriptor-path shortcut,
not every Node-only design; it neither reproduces the full race nor remedies
it, and provides no Linux proof. With Dec97 deferring native/bridge authority,
the bug is now explicitly blocked rather than silently left in backlog. Its
release gate and required security invariant remain unchanged.

2026-09-25 source-version assessment: the recorded 0.5.2 source revision
867ac7099faaa0b8eeed1e167609e0e1e482d519 retains the same ancestor
pathname check followed by later pathname-based sinks; its skill mirror also
reads source paths by name. The linked sanitized artifact binds exact blobs and
hashes to chk-535/task-823 provenance. This is static source-pattern evidence,
not an installed 0.5.2 test, race reproduction, cross-principal exploit proof,
or an earlier-version range. The bug remains unresolved and release-blocking;
Dec97 does not waive it. No blocked scan context was accessed.

Historical planning state: source finding accepted; no full exploit reproduction
or remediation had been performed. Goal85 remains paused.

2026-09-28 local feasibility addendum: exact probe/source hashes, synthetic
results, VM custody, and unverified cases are in the linked receipt. Neither
native prototype is shipped by mdkg. Callback path sinks, failure injection,
installed artifacts, x64, independent security review, and package delivery
still need a bounded implementation and qualification design.
