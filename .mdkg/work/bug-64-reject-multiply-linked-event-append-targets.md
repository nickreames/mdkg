---
id: bug-64
type: bug
title: Reject multiply linked event append targets
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

Goal: remedy event append follows hard-linked files into non-owned peers within Goal86's accepted generic, Node-only local release scope.

Context: Current Standard scan 78faed0e-5058-4db4-969a-62ccb02d6910 completed against main 72a3c8780af7d4c2888590b02158ddc60476facc plus 280 frozen dirty paths. This is a new current-source finding, not recovery of blocked historical context. Goal84 is the paused blocker ledger; Goal86 is the sole execution lane.

Severity/impact: low. An event append changes every hard-linked peer, including a file outside the selected root. Automatic task transitions can therefore corrupt an external event log or other writable file without an ancestor-swap race.

Owner: mdkg-project-agent, one writer. Allowed paths: src/core/filesystem_authority.ts append primitive, event callers and direct regression tests; directly required mdkg evidence/projections and disposable synthetic fixtures.

Boundaries: no remote Git, publication, provider, consumer/root/sibling write, native helper, canonical branch/worktree change, graph migration or bundle refresh. Preserve unknown work, selected Goal73, runtime DB and Demo3 bundles. Bugs46/47 remain deferred/unresolved, not fixed or accepted. Stop on custody movement or a materially new decision.

Done when: failing-before evidence, the bounded remedy, focused regressions and shared-caller positives, independent post-patch review and installed successor-candidate controls pass. Full release ladder/platform/security acceptance and exact sealing remain separate gates; do not claim release readiness from a local fix.

# Reproduction Steps

The exact candidate CLI exited0 and changed a synthetic outside-root hard-linked event peer; descriptor link count was2.

Only synthetic data was used. Source-only sibling routes are not claimed dynamically tested. Canonical report hashes and sanitized mapping are in .mdkg/artifacts/goal-86/current-security-audit-20260929.json.

# Expected vs Actual

- Expected: Appending a repository event must not modify another repository's or another owner's file through shared-inode aliasing.
- Actual: An event append changes every hard-linked peer, including a file outside the selected root. Automatic task transitions can therefore corrupt an external event log or other writable file without an ancestor-swap race.

# Suspected Cause

appendEvent resolves the configured workspace event log, checks its presence, and calls appendContainedFile. That helper accepts a contained regular hard link, opens the shared inode with O_APPEND, and writes without checking nlink. Automatic task events reach the same helper.

Affected-version assessment: exact retained 0.6.0 candidate 6154e4ea920bfa09d57532171df808f3f406250b44b2b318f0bb48542f82cdca and frozen current source confirmed. Earlier published versions are unassessed; do not infer exposure from version numbers.

# Fix Plan

Reject non-regular or multiply-linked targets before mutation and on the opened descriptor. Keep ordinary append ordering, inode identity, fsync and missing-log semantics. This is not an ancestor-race or concurrent hard-link-creation remedy.

# Test Plan

In-root and outside-root hard-link peers; direct and automatic events; unchanged bytes on refusal; ordinary single-link append and existing rollback controls.

Use selective iteration under verify-close-and-checkpoint. Broaden for shared helper callers; Test491 and Task828 independently bind final installed/review evidence. Source/package-input changes invalidate the old candidate for final acceptance, not its immutable historical receipts.

# Links / Artifacts

- Current rule: filesystem.hardlinked-event-append.
- .mdkg/artifacts/goal-86/current-security-audit-20260929.json and Chk667.
- Pre-patch boundary review was read-only and reused an independent reviewer because a fresh worker hit the host thread limit; this is not fresh post-patch verification.
