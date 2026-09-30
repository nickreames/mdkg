---
id: bug-67
type: bug
title: Preserve whole identifiers during legacy duplicate ID repair
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

Goal: remedy legacy duplicate-id repair rewrites unrelated identifier prefixes within Goal86's accepted generic, Node-only local release scope.

Context: Current Standard scan 78faed0e-5058-4db4-969a-62ccb02d6910 completed against main 72a3c8780af7d4c2888590b02158ddc60476facc plus 280 frozen dirty paths. This is a new current-source finding, not recovery of blocked historical context. Goal84 is the paused blocker ledger; Goal86 is the sole execution lane.

Severity/impact: medium. ID repair replaces every substring occurrence of the old alias, not exact identifiers or validated references. Renumbering task-1 to task-2 also changes a valid reference to task-10 into task-20. With --base-ref, a matching file absent from the base is classified as safe for whole-file replacement; consequently its own unrelated id: task-10 can also become id: task-20. The collision-free allocation check covers the intended replacement alias, not these collateral identity changes.

Owner: mdkg-project-agent, one writer. Allowed paths: src/commands/fix.ts and legacy ID repair matcher/regression tests; directly required mdkg evidence/projections and disposable synthetic fixtures.

Boundaries: no remote Git, publication, provider, consumer/root/sibling write, native helper, canonical branch/worktree change, graph migration or bundle refresh. Preserve unknown work, selected Goal73, runtime DB and Demo3 bundles. Bugs46/47 remain deferred/unresolved, not fixed or accepted. Stop on custody movement or a materially new decision.

Done when: failing-before evidence, the bounded remedy, focused regressions and shared-caller positives, independent post-patch review and installed successor-candidate controls pass. Full release ladder/platform/security acceptance and exact sealing remain separate gates; do not claim release readiness from a local fix.

# Reproduction Steps

Installed fix ids --base-ref HEAD --target task-1 --apply returned success and changed unrelated task-10 identity to task-20 and a reference to task-10 into task-20. All work occurred inside a synthetic Git fixture.

Only synthetic data was used. Source-only sibling routes are not claimed dynamically tested. Canonical report hashes and sanitized mapping are in .mdkg/artifacts/goal-86/current-security-audit-20260929.json.

# Expected vs Actual

- Expected: Local graph/evidence boundaries remain exact, ownership-aware and non-destructive.
- Actual: ID repair replaces every substring occurrence of the old alias, not exact identifiers or validated references. Renumbering task-1 to task-2 also changes a valid reference to task-10 into task-20. With --base-ref, a matching file absent from the base is classified as safe for whole-file replacement; consequently its own unrelated id: task-10 can also become id: task-20. The collision-free allocation check covers the intended replacement alias, not these collateral identity changes.

# Suspected Cause

ID repair replaces every substring occurrence of the old alias, not exact identifiers or validated references. Renumbering task-1 to task-2 also changes a valid reference to task-10 into task-20. With --base-ref, a matching file absent from the base is classified as safe for whole-file replacement; consequently its own unrelated id: task-10 can also become id: task-20. The collision-free allocation check covers the intended replacement alias, not these collateral identity changes.

Affected-version assessment: exact retained 0.6.0 candidate 6154e4ea920bfa09d57532171df808f3f406250b44b2b318f0bb48542f82cdca and frozen current source confirmed. Earlier published versions are unassessed; do not infer exposure from version numbers.

# Fix Plan

Use one workspace-aware whole-reference matcher for planning counts, self/external/Git-stage rewriting and safe filename handling. Preserve supported standalone prose mentions while leaving longer IDs, foreign qualified references and opaque substrings unchanged. Keep ambiguity review-only and staging unchanged.

# Test Plan

Duplicate task-1 beside task-10/task-100, qualified foreign references, punctuation-delimited self notes, filenames and incidental substrings; preview/application count agreement, untouched canonical nodes and Git index.

Use selective iteration under verify-close-and-checkpoint. Broaden for shared helper callers; Test491 and Task828 independently bind final installed/review evidence. Source/package-input changes invalidate the old candidate for final acceptance, not its immutable historical receipts.

# Links / Artifacts

- Current rule: integrity.identifier-substring-rewrite.
- .mdkg/artifacts/goal-86/current-security-audit-20260929.json and Chk667.
- Pre-patch boundary review was read-only and reused an independent reviewer because a fresh worker hit the host thread limit; this is not fresh post-patch verification.
