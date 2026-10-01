---
id: bug-52
type: bug
title: Recovery journal operations are not bound to the approved upgrade plan hash
status: done
priority: 1
tags: [release-0.6.0, security]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/bug-52-baseline.json, .mdkg/artifacts/goal-86/bug-52-full-verification.json, .mdkg/artifacts/goal-86/bug-52-installed-verification.json]
relates: []
blocked_by: []
blocks: []
refs: [task-837, goal-84, goal-86, task-828, test-488, bug-53]
context_refs: [goal-86, goal-84, task-837]
evidence_refs: []
aliases: []
skills: []
created: 2026-09-17
updated: 2026-09-21
---
# Overview

Goal: remediate g86-bootstrap-004 from the completed fresh Standard scan
9d6a2ca2-4273-45de-9013-20452c7651d0 under Task837. Publication blocker.
Severity: low. Resuming or recovering an upgrade compares the user-approved plan hash to a mutable journal string but does not bind the journal's operations to that hash. A replaced journal can add ordinary-file writes while retaining the approved hash.

The exact-approval invariant is broken, but exploitation requires access to mode0600 local recovery state or its replaceable namespace. No remote journal delivery or ordinary cross-tenant boundary is established; Git and graph identity protections still apply.

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

1. Tamper an ordinary-file operation while keeping the approved plan_hash and recomputing auxiliary hashes; resume and recover must refuse before writes.
2. Bind the complete canonical original plan and dependencies, and isolate mutable progress from approved intent.
3. Keep stale-byte, graph identity, Git-path, owner and interrupted recovery regression coverage.

# Expected vs Actual

Expected: the owning generic operation enforces its intended authority,
integrity and resource boundaries before effects and emits honest receipts.
Actual: Keeping journal.plan_hash unchanged while replacing an ordinary-file operation and recomputing the journal's auxiliary hashes passes hash-string admission. Setting before to current bytes passes per-file custody; recovery's identity/workspace callback does not constrain README.md or package.json operation membership. This establishes operation-approval substitution without a cryptographic collision, conditional on journal replacement authority.

# Suspected Cause

The original plan hash covers operations, observed inputs, directories, and extra plan data. The journal stores that hash alongside separately self-hashed operations and dependencies. readUpgradeJournal validates the auxiliary hashes but never recomputes the approved plan hash. continueUpgrade only compares the operator's hash with journal.plan_hash, then writes journal-controlled before or after bytes. An attacker can retain the approved plan_hash, add an ordinary-file operation with matching current bytes, and recompute the unkeyed auxiliary hashes.

Source anchors:
- src/commands/upgrade_transaction.ts:164-166 (expected_control)
- src/commands/upgrade_transaction.ts:188-193 (propagation)
- src/commands/upgrade_transaction.ts:60-67 (root_control)
- src/commands/upgrade_transaction.ts:206-209 (root_control)
- src/commands/upgrade_transaction.ts:229-234 (sink)
- src/commands/upgrade.ts:698-720 (propagation)

# Fix Plan

Persist the complete canonical approved-plan payload and verify its digest against the operator-supplied hash before admitting recovery operations or dependencies. Keep mutable progress state separate. Reject unbound legacy journals or require a separately reviewed recovery plan. Test resume and recover after inserting or modifying an ordinary-file operation while retaining the original plan_hash and recomputing auxiliary hashes.

Owned source allowlist:
- src/commands/upgrade_transaction.ts
- src/commands/upgrade.ts

Directly required shared helpers and regression files may be added only for
this control. Keep different findings separately attributable even when the
implementation shares a helper. Completed older bug milestones are historical
evidence, not reopened or substituted for this new regression.

# Test Plan

- Tamper an ordinary-file operation while keeping the approved plan_hash and recomputing auxiliary hashes; resume and recover must refuse before writes.
- Bind the complete canonical original plan and dependencies, and isolate mutable progress from approved intent.
- Keep stale-byte, graph identity, Git-path, owner and interrupted recovery regression coverage.
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

2026-09-21 local remedy verified from current source and retained finding only.
No blocked context accessed, recovered, or historical scan rerun. Goal85 remains
paused; final release NOT_READY.

Prepatch at67743f5 reproduced ordinary README replacement in both resume and
recover while keeping the original approved hash and recomputing auxiliary
operation/dependency hashes. This is synthetic local transaction-helper evidence,
not a remote exploit or a claim about published0.5.2 affectedness.

Schema3 persists the complete canonical approved plan (ordered operation bytes,
file and directory observations, and extra preview data). Recovery compares its
digest to the operator-retained hash and verifies effective operation/dependency
membership before selected-path reads, locks, terminal shortcuts or writes.
Progress is separate. Apply requires a captured fresh approval and executes its
snapshot rather than mutable plan-map references. Legacy schema1/2 journals stay
inspectable but automatically resume/recover on neither legacy nor v2 graphs;
preserve evidence for explicit investigation. README/install guidance records
the intentional refusal and distinguishes local consistency from attestation.

Verification: build/build:test pass;1718/1718 full discovered tests,82 independent
focused checks and219 installed cases pass with zero failures/skips. The installed
matrix uses exact Node24.15.0/24.18.0/26.0.0 on macOS arm64,73 cases each. The
intermediate tarball SHA256 is
2e31963463aeb550272a5204a4b90cda93fa172d06f399ef1a526191fd82ade3;
all230 package input/installed file hashes remain unchanged. Offline pack/install
with lifecycle scripts disabled. Full source run421775ms. Normal interrupted
upgrades, customization, graph identities, stale custody and unchanged Git staging
remain covered; tampering, dependency removal, downgraded schemas and altered
terminal journals refuse without filesystem changes. Independent source-only
candidate review found no concrete in-scope bypass or new regression.

CLI/docs/workflow parity, graph validation and diff checks pass. Three existing
stale-subgraph warnings remain; no bundle refresh. An initial mistyped compiled
test path ran no tests and was corrected, not counted as a product failure.

Review limitation: the existing unfinished-journal diagnostic displays its stored
hash; this is not trusted approval evidence. Revised guidance requires the saved
reviewed-preview hash. Nonblocking diagnostic wording can be aligned in the
release-critical guidance pass; no original-hash bypass was found.

Linux/macOS x86_64, final independent Task828 acceptance, full release ladder and
final artifact seal remain open. Bugs46/47 native-filesystem concerns remain
separate. Next retained finding: Bug53 hard-linked init manifest peers.
