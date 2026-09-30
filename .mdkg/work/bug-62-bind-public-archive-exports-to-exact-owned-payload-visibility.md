---
id: bug-62
type: bug
title: Bind public archive exports to exact owned payload visibility
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

Goal: remedy public bundles can disclose private archive payloads through directory-level visibility inheritance within Goal86's accepted generic, Node-only local release scope.

Context: Current Standard scan 78faed0e-5058-4db4-969a-62ccb02d6910 completed against main 72a3c8780af7d4c2888590b02158ddc60476facc plus 280 frozen dirty paths. This is a new current-source finding, not recovery of blocked historical context. Goal84 is the paused blocker ledger; Goal86 is the sole execution lane.

Severity/impact: medium. For example, valid a-private.md and z-public.md sidecars in .mdkg/archive/shared can cause private.zip to enter the public bundle. The private sidecar and private index node remain excluded, obscuring the disclosure in graph-level inspection. Recipients can decompress the included ZIP to obtain the private content.

Owner: mdkg-project-agent, one writer. Allowed paths: src/commands/bundle.ts, reusable archive ownership helpers, and direct bundle/archive regression tests; directly required mdkg evidence/projections and disposable synthetic fixtures.

Boundaries: no remote Git, publication, provider, consumer/root/sibling write, native helper, canonical branch/worktree change, graph migration or bundle refresh. Preserve unknown work, selected Goal73, runtime DB and Demo3 bundles. Bugs46/47 remain deferred/unresolved, not fixed or accepted. Stop on custody movement or a materially new decision.

Done when: failing-before evidence, the bounded remedy, focused regressions and shared-caller positives, independent post-patch review and installed successor-candidate controls pass. Full release ladder/platform/security acceptance and exact sealing remain separate gates; do not claim release readiness from a local fix.

# Reproduction Steps

The exact candidate CLI exported the synthetic private ZIP with visibility public while excluding its private sidecar and index node; command exited0.

Only synthetic data was used. Source-only sibling routes are not claimed dynamically tested. Canonical report hashes and sanitized mapping are in .mdkg/artifacts/goal-86/current-security-audit-20260929.json.

# Expected vs Actual

- Expected: An archive marked private must not have its compressed payload included in a public bundle.
- Actual: For example, valid a-private.md and z-public.md sidecars in .mdkg/archive/shared can cause private.zip to enter the public bundle. The private sidecar and private index node remain excluded, obscuring the disclosure in graph-level inspection. Recipients can decompress the included ZIP to obtain the private content.

# Suspected Cause

archiveVisibilityByPath records each sidecar's exact visibility but assigns only one visibility value to its containing directory. A later public sidecar overwrites the directory value for a colocated private archive. archivePathVisibility also returns the first matching directory prefix instead of resolving ownership, allowing a public ancestor archive to override a nested private archive. buildBundle uses this inferred value to include the private archive's ZIP bytes and label them public.

Affected-version assessment: exact retained 0.6.0 candidate 6154e4ea920bfa09d57532171df808f3f406250b44b2b318f0bb48542f82cdca and frozen current source confirmed. Earlier published versions are unassessed; do not infer exposure from version numbers.

# Fix Plan

Build an exact sidecar/raw/cache ownership inventory. Remove directory inheritance; unknown or multiply claimed payloads must not become public. Preserve custom/nested public archives, private exports and resource ownership without recompressing canonical archives.

# Test Plan

Shared public/private directories in both orderings; nested archives; unknown adjacent files; conflicting resource claims; public ZIP/manifest sentinel absence and ordinary public/private positive controls.

Use selective iteration under verify-close-and-checkpoint. Broaden for shared helper callers; Test491 and Task828 independently bind final installed/review evidence. Source/package-input changes invalidate the old candidate for final acceptance, not its immutable historical receipts.

# Links / Artifacts

- Current rule: authorization.archive-payload-visibility.
- .mdkg/artifacts/goal-86/current-security-audit-20260929.json and Chk667.
- Pre-patch boundary review was read-only and reused an independent reviewer because a fresh worker hit the host thread limit; this is not fresh post-patch verification.
