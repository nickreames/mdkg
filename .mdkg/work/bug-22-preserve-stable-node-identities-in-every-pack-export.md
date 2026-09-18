---
id: bug-22
type: bug
title: Preserve stable node identities in every pack export
status: backlog
priority: 1
tags: [release-0.6.0, behavioral-audit]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-83/task-824-behavioral-audit.json]
relates: [task-824, goal-84, goal-83]
blocked_by: []
blocks: []
refs: []
context_refs: [goal-84, goal-83, task-824]
evidence_refs: []
aliases: []
skills: []
created: 2026-09-08
updated: 2026-09-08
---
# Overview

Pack exports discard the immutable identity carried by the pack engine. Impact: a handoff cannot reliably distinguish nodes after branch alias remapping. Functional severity: medium; blocks the complete identity slice.

Owner: mdkg-project-agent. Context: root:task-824 under root:goal-83; remediation belongs to root:goal-84. Publication blocker, not a new security advisory. No source fix or verification is claimed at intake.

Allowed future remedy: named source paths, directly required helpers, regression tests, and sanitized mdkg evidence under the approved local qualification contract. Preserve numeric aliases, explicit v2 adoption, user-authored content, Git staging, selected Goal 73, runtime DB and protected bundles. No canonical migration, bundle refresh, remote/provider action, publication or unrelated refactoring. Stop on ownership collision, moving baseline or a materially new decision. Require failing-before/passing-after installed evidence and independent root:task-828 verification.

# Reproduction Steps

Explicitly migrate a synthetic graph with linked task-1/task-2. show task-1 --json establishes identity and mdkg:// stable reference. Export pack task-1 with --profile headers --skills none --out and each --format json, md, xml, toon. All four exit 0, but none contains the task node UUID or stable reference.

# Expected vs Actual

Each supported pack representation carries additive stable identity without dropping existing aliases/QIDs or exposing private records. Actual: serializers drop identity even though buildPackNode includes it.

# Suspected Cause

src/pack/pack.ts populates identity/stable_ref/alias_qid. src/pack/export_json.ts manually constructs a narrower object; export_md.ts and export_xml.ts also omit identity; export_toon.ts delegates JSON.

# Fix Plan

Define compatible serialized identity fields for all four formats and preserve them through ordinary, concise and headers profiles and relevant MCP/CLI wrappers. Do not synthesize missing legacy identity or change graph resolution authority.

Allowed paths: src/pack/pack.ts, types.ts, export_json.ts, export_md.ts, export_xml.ts, export_toon.ts; directly required CLI/MCP serialization and tests.

Affected-version assessment: Unpublished v2 identity functionality. Published 0.5.2 does not claim this identity slice; do not label 0.5.2 affected by missing v2 fields.

# Test Plan

All formats/profiles, legacy controls, stable cross-links, alias remapping and repeated integration, imported nodes, visibility filtering, truncation/token accounting and parseable structured output. Compare exact persisted identity with exported identity.

Acceptance: all reproduced failures corrected with passing controls preserved; root:test-483 and root:task-828 verify the exact installed candidate. No missing proof is a waiver.

# Links / Artifacts

- .mdkg/artifacts/goal-83/task-824-behavioral-audit.json
- root:test-483; root:task-824; root:task-828; root:goal-84
- Initial candidate SHA-256: 3238663f76882f094cfd1e9c86abbd43e057aa165ec69099a976949f9d011c05 (development metadata 0.5.2; not a 0.6.0 seal).
