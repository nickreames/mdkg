---
id: bug-66
type: bug
title: Bound and contain diagnostic file reads and storage walks
status: done
priority: 1
tags: [release-0.6.0, current-security]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/current-security-audit-20260929.json, .mdkg/artifacts/goal-86/successor-installed-case-acceptance-20260930.json, .mdkg/artifacts/goal-86/successor-installed-platform-qualification-20260930.json, .mdkg/artifacts/goal-86/successor-security-acceptance-20260930.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-86, goal-84, task-828, test-491, chk-667]
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-09-29
updated: 2026-09-30
---
# Overview

Goal: remedy diagnostic readers and storage walks bypass contained, bounded input admission within Goal86's accepted generic, Node-only local release scope.

Context: Current Standard scan 78faed0e-5058-4db4-969a-62ccb02d6910 completed against main 72a3c8780af7d4c2888590b02158ddc60476facc plus 280 frozen dirty paths. This is a new current-source finding, not recovery of blocked historical context. Goal84 is the paused blocker ledger; Goal86 is the sole execution lane.

Severity/impact: medium. DB and repair cache inspection, repair selected-goal inspection, status changelog reads, and doctor storage-root walks follow pre-existing repository-controlled links. Installed DB inspection exposed a synthetic external marker; the other routes are source-confirmed. Unbounded reads can exhaust resources; storage walks enumerate external filenames.

Owner: mdkg-project-agent, one writer. Allowed paths: src/commands/db.ts, fix.ts, status.ts, doctor.ts and reusable bounded contained-read/walk helpers with direct tests; directly required mdkg evidence/projections and disposable synthetic fixtures.

Boundaries: no remote Git, publication, provider, consumer/root/sibling write, native helper, canonical branch/worktree change, graph migration or bundle refresh. Preserve unknown work, selected Goal73, runtime DB and Demo3 bundles. Bugs46/47 remain deferred/unresolved, not fixed or accepted. Stop on custody movement or a materially new decision.

Done when: failing-before evidence, the bounded remedy, focused regressions and shared-caller positives, independent post-patch review and installed successor-candidate controls pass. Full release ladder/platform/security acceptance and exact sealing remain separate gates; do not claim release readiness from a local fix.

# Reproduction Steps

db index status --json followed a cache symlink to a small synthetic file outside the fixture root and included part of its contents in parse diagnostics. It returned process0 with ok:false. The outside file was unchanged. The unbounded /dev/zero path is source-supported only and was intentionally not executed. Parent traced fix cache/selected-goal, status changelog, and doctor root-walk paths in source; those additional routes were not dynamically executed.

Only synthetic data was used. Source-only sibling routes are not claimed dynamically tested. Canonical report hashes and sanitized mapping are in .mdkg/artifacts/goal-86/current-security-audit-20260929.json.

# Expected vs Actual

- Expected: Local graph/evidence boundaries remain exact, ownership-aware and non-destructive.
- Actual: DB and repair cache inspection, repair selected-goal inspection, status changelog reads, and doctor storage-root walks follow pre-existing repository-controlled links. Installed DB inspection exposed a synthetic external marker; the other routes are source-confirmed. Unbounded reads can exhaust resources; storage walks enumerate external filenames.

# Suspected Cause

db index status and db index verify call collectDbIndexChecks. Its subgraphs check resolves .mdkg/index/subgraphs.json and evaluates isSubgraphsIndexStale, which only uses existence and timestamp checks. jsonCacheCheck then calls readJsonCache, which uses raw fs.readFileSync with no containment, regular-file admission, or byte bound. Repair/status/doctor sibling diagnostics use raw readFileSync or readdirSync before contained regular-file/root admission.

Affected-version assessment: exact retained 0.6.0 candidate 6154e4ea920bfa09d57532171df808f3f406250b44b2b318f0bb48542f82cdca and frozen current source confirmed. Earlier published versions are unassessed; do not infer exposure from version numbers.

# Fix Plan

Use contained, bounded optional-file reads and budgeted directory walks. Admit roots and leaf types before inspection, including dangling links, special files and oversized inputs. Refused inspection must not be represented as clean or missing. Preserve normal missing optional state, cache diagnostics and one-object JSON output.

# Test Plan

Leaf/ancestor/root links, dangling links, direct special files, oversized text/cache, depth/entry limits, no external-byte disclosure or cache persistence, and normal diagnostics. Use bounded synthetic sentinels only; never execute an unbounded device read.

Use selective iteration under verify-close-and-checkpoint. Broaden for shared helper callers; Test491 and Task828 independently bind final installed/review evidence. Source/package-input changes invalidate the old candidate for final acceptance, not its immutable historical receipts.

# Links / Artifacts

- Current rule: filesystem.unadmitted-observational-read.
- .mdkg/artifacts/goal-86/current-security-audit-20260929.json and Chk667.
- Pre-patch boundary review was read-only and reused an independent reviewer because a fresh worker hit the host thread limit; this is not fresh post-patch verification.
