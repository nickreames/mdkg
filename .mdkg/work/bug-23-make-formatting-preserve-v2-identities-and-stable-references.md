---
id: bug-23
type: bug
title: Make formatting preserve v2 identities and stable references
status: done
priority: 1
tags: [release-0.6.0, behavioral-audit]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-83/task-824-behavioral-audit.json, .mdkg/artifacts/goal-84/bug-23-verification.json]
relates: [task-824, goal-84, goal-83]
blocked_by: []
blocks: []
refs: []
context_refs: [goal-84, goal-83, task-824]
evidence_refs: []
aliases: []
skills: []
created: 2026-09-08
updated: 2026-09-09
---
# Overview

The formatter rejects a valid v2 graph. Impact: ordinary maintenance fails after supported identity adoption. Functional severity: medium; supported workflow compatibility blocker.

Owner: mdkg-project-agent. Context: root:task-824 under root:goal-83; remediation belongs to root:goal-84. Publication blocker, not a new security advisory. No source fix or verification is claimed at intake.

Allowed future remedy: named source paths, directly required helpers, regression tests, and sanitized mdkg evidence under the approved local qualification contract. Preserve numeric aliases, explicit v2 adoption, user-authored content, Git staging, selected Goal 73, runtime DB and protected bundles. No canonical migration, bundle refresh, remote/provider action, publication or unrelated refactoring. Stop on ownership collision, moving baseline or a materially new decision. Require failing-before/passing-after installed evidence and independent root:task-828 verification.

# Reproduction Steps

Explicitly migrate the synthetic cross-linked graph and validate successfully. Run format. It exits 2 with unknown key errors for graph_id/node_id, changes no files, and validate still passes. A legacy format control exits 0. Unknown format 99 with format --headings --apply refuses with no writes.

# Expected vs Actual

Supported v2 formatting preserves immutable identity and stable references; unsupported formats refuse before mutation. Actual: valid identity metadata is rejected. The unknown-version refusal already works and must remain a passing control.

# Suspected Cause

src/commands/format.ts normalizeFrontmatter enumerates schema.allowedKeys without reserved identity fields. normalizeIdRef also needs stable-reference review. src/util/lock.ts already gates graph format before mutation; do not duplicate a nonexistent unknown-format formatter finding.

# Fix Plan

Make normalization identity-aware with strict validation and byte-preserving identity/reference semantics. Preserve deterministic formatting, legacy behavior, and prewrite all-file validation. Never allocate identity during format.

Allowed paths: src/commands/format.ts; existing graph identity/frontmatter/schema helpers only as required; formatter and installed regression tests.

Affected-version assessment: Confirmed candidate v2 incompatibility. Published 0.5.2 has no supported v2 adoption, so this is not claimed as a published v2 regression.

# Test Plan

v2 UUIDs and mdkg:// references across supported relation fields, repeated format idempotency, valid custom fields, invalid identity/reference failure, legacy controls, headings mode, unsupported versions, mixed invalid files and unchanged Git staging.

Acceptance: all reproduced failures corrected with passing controls preserved; root:test-483 and root:task-828 verify the exact installed candidate. No missing proof is a waiver.

# Links / Artifacts

- .mdkg/artifacts/goal-83/task-824-behavioral-audit.json
- root:test-483; root:task-824; root:task-828; root:goal-84
- Initial candidate SHA-256: 3238663f76882f094cfd1e9c86abbd43e057aa165ec69099a976949f9d011c05 (development metadata 0.5.2; not a 0.6.0 seal).

## 2026-09-09 Local Verification

The normalizer now preserves reserved graph_id/node_id values independently of
template declarations, accepts stable scope/supersession refs and never fills in
absent legacy identities. Both normal and heading-only modes check persisted
identity, graph ownership, canonical stable-reference syntax and Git conflict
markers for every document before authored writes. Existing portable ID handling
and opaque consumer policy references remain unchanged; no graph-wide migration,
identity allocation or alias repair is hidden inside formatting.

The prior hash-verified installed package fails 12 of 24 new cases. The fixed
installed candidate passes all 24 new cases plus 13 existing formatter controls
on Node 24.18.0 and 26.0.0. Full validation passes 1108 source tests and 26
release/security-contract tests, no failures or skips. CLI/docs parity, graph
validation, SQLite verification and diff checks pass. Three existing subgraph
age warnings are preserved. Proof and exact candidate/source hashes are in
`.mdkg/artifacts/goal-84/bug-23-verification.json`.

Coverage includes custom templates, immutable reference values, real decision
supersession, idempotency, heading preview/apply, invalid and foreign identities,
malformed references, conflict markers, future formats, mixed invalid/valid
files, unchanged Git staging and no implicit legacy adoption. Initial fixture
assumptions about omitted empty relation keys were corrected before the final
installed before/after comparison.

This closes the local defect, not the final independent test-483/task-828 gate.
Exact Node 24.15.0, full consumer/runtime qualification, draft release metadata,
the release ladder and final artifact seal remain open. The partial bug-17 patch,
mixed SQLite projection, selected Goal 73, runtime DB and Demo 3 bundle remain
preserved. No canonical format/migration, bundle refresh, remote Git, provider or
publication action. Skills reused: pursue-mdkg-goal, build-pack-and-execute-task,
source-grounded-diagnose-and-fix, verify-close-and-checkpoint and
safe-git-publication-preflight. Skill candidates: none.
