---
id: bug-53
type: bug
title: Init rewrites hard-linked manifest peers outside the selected repository
status: done
priority: 1
tags: [release-0.6.0, security]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/bug-53-baseline.json, .mdkg/artifacts/goal-86/bug-53-full-verification.json, .mdkg/artifacts/goal-86/bug-53-installed-verification.json]
relates: []
blocked_by: []
blocks: []
refs: [task-837, goal-84, goal-86, task-828, test-488, bug-46, bug-47, bug-54]
context_refs: [goal-86, goal-84, task-837]
evidence_refs: []
aliases: []
skills: []
created: 2026-09-17
updated: 2026-09-21
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

2026-09-21 bounded local remedy verified against current source and retained
finding only. No blocked context accessed, recovered or historical scan rerun.
Goal85 remains paused; final release NOT_READY.

At02da123d all six default/agent/graph-only, force/non-force CLI reproductions
changed a synthetic external hard-linked manifest peer while exiting0. The
prepatch regression family had six failures and one passing ordinary-init
control. This proves the current local defect, not published0.5.2 affectedness
or a remote delivery path; ordinary Git cloning does not transport hard links.

Chosen accepted remedy: fail closed on multiply linked manifests before init's
first write, repeat admission under the existing lock, then independently guard
the actual writer. The internal writer now takes an explicit root/relative path,
uses contained authority, opens without truncation, checks a regular single-link
descriptor and correlates its device/inode with the admitted and current path
before writing. New files use exclusive creation. Existing single-link writes
retain their inode rather than introducing unqualified replacement metadata
semantics. Default/agent/graph-only and --force cannot bypass the refusal.

Verification: build/build:test,59 final focused and1730 full discovered tests
pass, zero failures/skips. Full run419585ms on Node26.0.0/macOS arm64. Installed
Node24.15.0/24.18.0/26.0.0 each pass37 cases (111 total) against tarball SHA256
166ce48297af02aff57036686e4e343161e99aa6b48a1cf712e96afd17dae10a;
all230 package input/installed file hashes remain unchanged. Offline local
pack/install, lifecycle scripts disabled; not a final release seal.

Controls cover unchanged complete fixture/Git inventories on early refusal,
direct-helper hard links/symlinks/directories, links introduced before/after
open, moved opened inodes, exclusive creation, repeated init preserving inode,
0600 mode and owner/group, and existing v2 identity/upgrade safeguards. CLI,
docs472examples, workflow, graph and diff checks pass; three stale-subgraph
warnings remain intentionally.

Fresh read-only investigator creation was unavailable (agent thread limit).
The parent performed the skill's separate boundary and candidate-review fallback;
this is explicitly not independent acceptance. Review required correlating the
opened inode with the current path so a moved descriptor cannot target its peer.
Task828 independent review remains mandatory. Native last-check/namespace races,
concurrent namespace ownership and general ACL/metadata qualification remain
Bugs46/47; this single-link admission is not a substitute for that architecture.
Linux/macOS x86_64, final ladder and seal remain open. Next: Bug54 numeric aliases.
