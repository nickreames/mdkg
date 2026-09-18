---
id: bug-53
type: bug
title: Init rewrites hard-linked manifest peers outside the selected repository
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

Goal: remediate g86-bootstrap-002 from the completed fresh Standard scan
9d6a2ca2-4273-45de-9013-20452c7651d0 under Task837. Publication blocker.
Severity: low. Running init, including without --force, can overwrite another repository's hard-linked init manifest with the selected repository's generated ownership metadata. This can corrupt the external repository's upgrade provenance. The finding does not require a race, but ordinary Git cloning does not preserve the required hard link.

A cross-root shared inode is overwritten, but setup needs a same-filesystem locally arranged hard link to an accepted manifest; ordinary Git cloning cannot transport the relationship and Linux hardlink protections may prevent it.

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

1. Initialize with a valid externally hard-linked manifest and prove the peer stays byte-identical.
2. Cover repeated init without force and failure admission with no partial peer writes.
3. Use metadata-preserving contained replacement or reject multiply-linked targets before mutation.

# Expected vs Actual

Expected: the owning generic operation enforces its intended authority,
integrity and resource boundaries before effects and emits honest receipts.
Actual: Init's preflight accepts a hard-linked regular manifest, reads its valid shape and reaches unconditional writeInitManifest. fs.writeFileSync rewrites the shared inode instead of replacing only the owned directory entry. A non-owned peer therefore changes without any race. The attacker must be able to arrange the hard link without already possessing equivalent direct mutation authority.

# Suspected Cause

Init validates that the existing manifest is a contained regular file, but hard links satisfy those checks. It reads and accepts the external peer's valid manifest and eventually calls writeInitManifest. That helper uses fs.writeFileSync on the existing path, truncating and rewriting the shared inode instead of replacing the selected directory entry.

Source anchors:
- src/commands/init.ts:533-537 (entrypoint)
- src/commands/init.ts:660-670 (propagation)
- src/commands/init_manifest.ts:168-170 (root_control)

# Fix Plan

Replace the manifest through the contained atomic-replacement helper rather than truncating its inode, or reject multi-linked manifests before modification. Add a regression test linking the selected manifest to a valid external sentinel manifest and confirm the external peer remains byte-identical.

Owned source allowlist:
- src/commands/init.ts
- src/commands/init_manifest.ts

Directly required shared helpers and regression files may be added only for
this control. Keep different findings separately attributable even when the
implementation shares a helper. Completed older bug milestones are historical
evidence, not reopened or substituted for this new regression.

# Test Plan

- Initialize with a valid externally hard-linked manifest and prove the peer stays byte-identical.
- Cover repeated init without force and failure admission with no partial peer writes.
- Use metadata-preserving contained replacement or reject multiply-linked targets before mutation.
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
