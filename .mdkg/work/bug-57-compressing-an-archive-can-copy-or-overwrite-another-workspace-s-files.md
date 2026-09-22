---
id: bug-57
type: bug
title: Compressing an archive can copy or overwrite another workspace's files
status: done
priority: 1
tags: [release-0.6.0, security]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/bug-57-baseline.json, .mdkg/artifacts/goal-86/bug-57-full-verification.json, .mdkg/artifacts/goal-86/bug-57-installed-verification.json]
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

Goal: remediate g86-export-001 from the completed fresh Standard scan
9d6a2ca2-4273-45de-9013-20452c7651d0 under Task837. Publication blocker.
Severity: medium. Archive compression authorizes the sidecar owner but trusts its relative payload paths within the entire repository. A root-owned sidecar can point into a nested private or disabled workspace, copy its raw data into a parent archive, or replace its graph documents with ZIP bytes without force.

This crosses an explicit workspace ownership and confidentiality boundary and can overwrite independently owned graph documents. Exploitation requires a contributor-controlled sidecar and a suitable nested workspace or overlapping same-owner resource; it is local and not arbitrary outside-repository access.

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

1. Reject stored or compressed payload paths owned by private, disabled or other nested workspaces before any read or write.
2. Prove private sentinel bytes cannot enter a parent archive or later public export.
3. Reject destinations overlapping sidecars, raw inputs, graph documents, protected metadata or any other selected operation's targets.
4. Preserve explicit archive-add source authority and valid per-archive compression.

# Expected vs Actual

Expected: the owning generic operation enforces its intended authority,
integrity and resource boundaries before effects and emits honest receipts.
Actual: With a configured nested private or disabled workspace below .mdkg/archive/child/.mdkg, a root sidecar can name child/.mdkg/private.txt as stored_path and entry.zip as compressed_path. Root-scoped compression reads the child's bytes into the parent ZIP. The same mechanism accepts child/.mdkg/work/task-1.md or another sidecar as compressed_path and overwrites it. Disabled children need not be indexed afterward. Existing tests cover direct imported/disabled owner selection, not selected-sidecar payload ownership.

# Suspected Cause

`validateArchiveFrontmatter` restricts `stored_path` and `compressed_path` to relative paths. `archiveNodePaths` resolves them beneath the sidecar directory. `assertWritableArchiveOwner` authorizes only the sidecar node. `preflightArchiveCompression` then checks all three paths against the overall repository root, without receiving configuration or checking deepest workspace ownership, resource layout or overlapping targets. It regenerates hashes from the chosen raw bytes and replaces the chosen cache path. Deferred integrity means an attacker does not need the private payload's prior hash.

Source anchors:
- src/graph/archive_file.ts:90-93 (user_input)
- src/commands/archive.ts:274-287 (propagation)
- src/commands/archive.ts:646-663 (propagation)
- src/commands/archive.ts:748-761 (root_control)
- src/commands/archive.ts:815-825 (sink)
- src/graph/workspace_ownership.ts:41-56 (expected_control)

# Fix Plan

Pass configuration and a deepest-owner resolver into payload preflight. Require both payload paths to belong to the selected enabled local owner and its admitted archive resource layout. Reject cache destinations overlapping authored documents, raw inputs, other sidecars, protected metadata, or another operation's targets. Complete these checks before any reads or writes. Add regressions for a disabled/private child beneath .mdkg/archive, private-byte copying into a public parent ZIP, foreign document clobbering, and same-owner sidecar/raw/cache collisions.

Owned source allowlist:
- src/graph/archive_file.ts
- src/commands/archive.ts
- src/graph/workspace_ownership.ts

Directly required shared helpers and regression files may be added only for
this control. Keep different findings separately attributable even when the
implementation shares a helper. Completed older bug milestones are historical
evidence, not reopened or substituted for this new regression.

# Test Plan

- Reject stored or compressed payload paths owned by private, disabled or other nested workspaces before any read or write.
- Prove private sentinel bytes cannot enter a parent archive or later public export.
- Reject destinations overlapping sidecars, raw inputs, graph documents, protected metadata or any other selected operation's targets.
- Preserve explicit archive-add source authority and valid per-archive compression.
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

2026-09-21: Bounded local remedy verified against source base
fb3700edf4c6ef76e3612ecb61dac4aa648a05f8. Compression now admits the whole
selected resource set before payload reads: deepest configured workspace owner,
archive layout, protected configured metadata, portable path aliases and
cross-resource/ancestor collisions. All local archives contribute ownership
claims, including unselected entries. Sidecar authority is checked again before
reading the raw input. Native path interpretation is consistent at the sinks.

Fresh corrected prepatch fixtures:19 failures and5 legitimate passes. One
independent candidate review exposed template-root normalization and regular
dotfile compatibility gaps; both reproduced and were corrected. Parent testing
also confirmed/fixed literal-# filename rejection caused by confusing filenames
with imported projection markers. Imported/read-only mutation refusal remains.

Verification:83 focused tests,1958 complete discovered tests, and38 installed
cases each on Node24.15.0/24.18.0/26.0.0 (114 total), all pass with0 skips.
Build, CLI/docs/workflow parity and full/changed graph checks pass; three
preserved stale-import warnings remain. The preliminary run overlapping a dist
rebuild is explicitly discarded, not counted as a product pass.

Exact intermediate tarball SHA256:
a861a6e9083c151c6fa039747e0af14f6637305eae737f8e9205978b9638b634.
All231 installed files unchanged. This is macOS arm64 local evidence, not a
final release seal. Published0.5.2 affectedness remains unassessed.

Limits: no new hardlink policy or Bug47 concurrent ancestor-substitution remedy
is claimed. Linux, Test488, final Task828 acceptance, full coverage ladder and
artifact seal remain separate gates. Goal85 stays paused. No blocked context,
old finding recovery, remote Git, provider action or publication occurred.
