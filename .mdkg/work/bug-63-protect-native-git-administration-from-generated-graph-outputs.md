---
id: bug-63
type: bug
title: Protect native Git administration from generated graph outputs
status: done
priority: 1
tags: [release-0.6.0, current-security]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/current-security-audit-20260929.json, .mdkg/artifacts/goal-86/independent-diff-review-20260930.json, .mdkg/artifacts/goal-86/successor-installed-case-acceptance-20260930.json, .mdkg/artifacts/goal-86/successor-installed-platform-qualification-20260930.json, .mdkg/artifacts/goal-86/successor-security-acceptance-20260930.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-86, goal-84, task-828, test-491, chk-667, bug-72, test-493]
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-09-29
updated: 2026-09-30
---
# Overview

Goal: remedy configured generated outputs can overwrite native git administration within Goal86's accepted generic, Node-only local release scope.

Context: Current Standard scan 78faed0e-5058-4db4-969a-62ccb02d6910 completed against main 72a3c8780af7d4c2888590b02158ddc60476facc plus 280 frozen dirty paths. This is a new current-source finding, not recovery of blocked historical context. Goal84 is the paused blocker ledger; Goal86 is the sole execution lane.

Severity/impact: medium. Running mdkg index against a maliciously configured ordinary checkout can destroy the native Git index, including staged state. Other ordinary administrative files such as .git/config can likewise be corrupted. No symlink or race is required.

Owner: mdkg-project-agent, one writer. Allowed paths: src/graph/cache_output.ts, reindex/SQLite output preflights, identity_validation.ts, subgraph output boundaries, and their direct tests; directly required mdkg evidence/projections and disposable synthetic fixtures.

Boundaries: no remote Git, publication, provider, consumer/root/sibling write, native helper, canonical branch/worktree change, graph migration or bundle refresh. Preserve unknown work, selected Goal73, runtime DB and Demo3 bundles. Bugs46/47 remain deferred/unresolved, not fixed or accepted. Stop on custody movement or a materially new decision.

Done when: failing-before evidence, the bounded remedy, focused regressions and shared-caller positives, independent post-patch review and installed successor-candidate controls pass. Full release ladder/platform/security acceptance and exact sealing remain separate gates; do not claim release readiness from a local fix.

# Reproduction Steps

The exact candidate CLI exited0 and replaced a synthetic .git/index with JSON during mdkg index. Separately, exact-candidate subgraph sync successfully replaced a synthetic parent .git/config with ZIP bytes. Identity operations also miss relocated inside-root Git administration in their lexical protected set; that topology route is source-validated only.

Only synthetic data was used. Source-only sibling routes are not claimed dynamically tested. Canonical report hashes and sanitized mapping are in .mdkg/artifacts/goal-86/current-security-audit-20260929.json.

# Expected vs Actual

- Expected: Rebuilding derived mdkg caches must not modify native Git administrative state.
- Actual: Running mdkg index against a maliciously configured ordinary checkout can destroy the native Git index, including staged state. Other ordinary administrative files such as .git/config can likewise be corrupted. No symlink or race is required.

# Suspected Cause

index.global_index_path passes requireContainedPath, which rejects absolute paths and parent components but accepts .git/index. runIndexCommand loads that configuration and invokes writeDerivedIndexes. Its preflight and writeCacheFile enforce root containment but do not invoke the Git-metadata destination guard. atomicReplaceContainedFile consequently replaces an ordinary .git/index with generated JSON.

Affected-version assessment: exact retained 0.6.0 candidate 6154e4ea920bfa09d57532171df808f3f406250b44b2b318f0bb48542f82cdca and frozen current source confirmed. Earlier published versions are unassessed; do not infer exposure from version numbers.

# Fix Plan

Reuse actual-topology Git metadata admission before effects and at sinks. Cover complete active output inventories, SQLite sidecars, identity plans/recovery and subgraph output paths. Preserve non-Git use, custom legitimate destinations, unused SQLite configuration in JSON mode and native path interpretation.

# Test Plan

Ordinary/separate Git dirs, linked worktrees, redirected index/object/hook stores, direct and aggregate cache writers, identity preview/apply/recovery, sync dry-run/apply; assert no earlier output or native staging changes on refusal.

Use selective iteration under verify-close-and-checkpoint. Broaden for shared helper callers; Test491 and Task828 independently bind final installed/review evidence. Source/package-input changes invalidate the old candidate for final acceptance, not its immutable historical receipts.

# Links / Artifacts

- Current rule: filesystem.git-metadata-cache-write.
- .mdkg/artifacts/goal-86/current-security-audit-20260929.json and Chk667.
- Pre-patch boundary review was read-only and reused an independent reviewer because a fresh worker hit the host thread limit; this is not fresh post-patch verification.

## Final bounded candidate review

The independent storage reviewer found an incoming-growth refusal-order
regression: old output was removed before the incoming temporary tree's bounded
Git inventory was admitted. The new synthetic installed-compatible case failed
with the old generated view missing and a temporary tree retained. The remedy
admits prospective paths, directory count and bare-store signatures before
extraction/removal, retaining boundary-equal materialization as a positive case.
This does not claim atomic protection against deferred Bug47 directory races.
