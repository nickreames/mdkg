---
id: bug-46
type: bug
title: Updating a private graph file can widen its filesystem permissions
status: blocked
priority: 1
tags: [release-0.6.0, security]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/bug-46-investigation.json]
relates: []
blocked_by: []
blocks: []
refs: [task-837, goal-84, goal-86, task-828, chk-623]
context_refs: [goal-86, goal-84, task-837]
evidence_refs: [chk-623]
aliases: []
skills: []
created: 2026-09-17
updated: 2026-09-18
---
# Overview

Goal: remediate g86-baseline-003 from the completed fresh Standard scan
9d6a2ca2-4273-45de-9013-20452c7651d0 under Task837. Publication blocker.
Severity: low. A routine task update replaces an existing file with a fresh inode using0666 subject to umask. An owner-only0600 file can become0644; existing ACL or ownership restrictions are not preserved by either atomic writer.

This is a local confidentiality defect requiring another principal to traverse the containing directory and restrictions that differ from new-file defaults. The source proves permission widening but not particular sensitive contents or an exposed deployment.

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

1. Update a0600 task under022 umask and assert no permission widening, including temporary files.
2. Test differing group ownership and restrictive per-file ACLs on macOS and Linux.
3. Cover both atomic helpers, mode-preserving callers and unchanged hard-linked peers.
4. Cover task, goal, competing-goal activation, formatting, selection and cache write routes through the centralized metadata contract.

# Expected vs Actual

Expected: the owning generic operation enforces its intended authority,
integrity and resource boundaries before effects and emits honest receipts.
Actual: A0600 task file updated under022 umask is rewritten through a0666 creation request and becomes0644. Atomic rename does not preserve the replaced inode's metadata. This crosses a local access-control boundary for principals with directory traversal rights; no runtime ACL test was performed.

# Suspected Cause

writeNodeFile preserves content but supplies no original metadata. atomicReplaceContainedFile creates a temporary inode through writeAndSync's0666 default and renames it over the destination. The general atomic writer does the same. Pack and mirror callers preserve some mode bits, but no caller shown preserves all owner/group/ACL restrictions. The same omission affects goal updates and competing-goal pause writes, formatting, selected-goal state and derived caches.

Source anchors:
- src/core/filesystem_authority.ts:208-215 (propagation)
- src/core/filesystem_authority.ts:471-487 (root_control)
- src/util/atomic.ts:25-30 (propagation)
- src/commands/task.ts:292-306 (propagation)
- src/commands/pack.ts:331-359 (propagation)
- src/commands/skill_mirror.ts:193-205 (propagation)
- src/commands/goal.ts:126-134 (propagation)
- src/commands/goal.ts:543-547 (propagation)
- src/commands/format.ts:609-614 (propagation)
- src/graph/selected_goal.ts:35-40 (propagation)
- src/graph/cache_output.ts:18-20 (propagation)

# Fix Plan

Preserve applicable mode, ownership and ACL restrictions on the new inode before writing/publishing sensitive bytes, or fail closed when preservation cannot be established. Define explicit new-file policy and keep hard-linked peers untouched.

Owned source allowlist:
- src/core/filesystem_authority.ts
- src/util/atomic.ts
- src/commands/task.ts
- src/commands/pack.ts
- src/commands/skill_mirror.ts
- src/commands/goal.ts
- src/commands/format.ts
- src/graph/selected_goal.ts
- src/graph/cache_output.ts

Directly required shared helpers and regression files may be added only for
this control. Keep different findings separately attributable even when the
implementation shares a helper. Completed older bug milestones are historical
evidence, not reopened or substituted for this new regression.

# Test Plan

- Update a0600 task under022 umask and assert no permission widening, including temporary files.
- Test differing group ownership and restrictive per-file ACLs on macOS and Linux.
- Cover both atomic helpers, mode-preserving callers and unchanged hard-linked peers.
- Cover task, goal, competing-goal activation, formatting, selection and cache write routes through the centralized metadata contract.
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

2026-09-18: Reproduced on main754710c7 with built-source Node26.0.0,
macOS arm64. Seven cases confirm both helpers widen0600 to0644, drop an
explicit deny-read ACL while retaining0644, and replace a differing owning
group. A real disposable task update also widens0600 to0644. Temporary
descriptors are already0644 before content writes. All six hard-linked peer
controls preserve their original bytes and metadata. Only synthetic data was
used; no cross-principal access or real disclosure is claimed.

One fresh read-only prepatch investigation confirmed the shared sinks and
compatibility constraints. Explicit0600 journal requests must remain effective;
mirror0775 under restrictive umask and pack/hardlink behavior must remain valid.
No production patch, installed-artifact qualification or candidate review exists.

Blocked on a material filesystem architecture decision. The current runtime
has no third-party dependencies and uses public Node APIs, which do not supply
the needed portable ACL operations. Mode-only changes, in-place overwrite,
post-publication chmod and ordinary copy are not complete substitutes. The
separately tracked Bug47 also requires descriptor-anchored containment or a
verified non-replaceable namespace; repeated pathname checks are not that proof.

Question for Nick: may mdkg add a narrowly scoped OS-native filesystem layer,
with explicit packaging/build/platform qualification? Recommendation: approve
a bounded design and feasibility proof, then settle distribution and supported
fallback behavior before implementation. A capability-checked system-tool
bridge is an alternative, but adds runtime prerequisites and performance/
portability costs; neither approach is approved or qualified by this record.
Do not weaken the existing security invariant or treat alpha status as a waiver.

Chk623 and bug-46-investigation.json bind exact evidence, source hashes,
version-assessment limits and the pending decision. Goal85 remains paused.
