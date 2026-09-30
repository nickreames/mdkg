---
id: bug-68
type: bug
title: Resolve workflow evidence using its owning workspace
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

Goal: remedy legacy work and capability linkage attribute evidence across workspace aliases within Goal86's accepted generic, Node-only local release scope.

Context: Current Standard scan 78faed0e-5058-4db4-969a-62ccb02d6910 completed against main 72a3c8780af7d4c2888590b02158ddc60476facc plus 280 frozen dirty paths. This is a new current-source finding, not recovery of blocked historical context. Goal84 is the paused blocker ledger; Goal86 is the sole execution lane.

Severity/impact: low. The selected order's status response can contain an unrelated workspace's receipt count, declared outcome, verification state, and evidence references, corrupting the structural evidence association presented to callers.

Owner: mdkg-project-agent, one writer. Allowed paths: src/commands/work.ts, src/graph/capabilities_indexer.ts, capabilities_index_cache.ts and direct tests; directly required mdkg evidence/projections and disposable synthetic fixtures.

Boundaries: no remote Git, publication, provider, consumer/root/sibling write, native helper, canonical branch/worktree change, graph migration or bundle refresh. Preserve unknown work, selected Goal73, runtime DB and Demo3 bundles. Bugs46/47 remain deferred/unresolved, not fixed or accepted. Stop on custody movement or a materially new decision.

Done when: failing-before evidence, the bounded remedy, focused regressions and shared-caller positives, independent post-patch review and installed successor-candidate controls pass. Full release ladder/platform/security acceptance and exact sealing remain separate gates; do not claim release readiness from a local fix.

# Reproduction Steps

Installed work order status a:order.same reported b:receipt.only-b with success even though the receipt refers to b:order.same. Source confirms equivalent unqualified matching in capability work-order/receipt linkage.

Only synthetic data was used. Source-only sibling routes are not claimed dynamically tested. Canonical report hashes and sanitized mapping are in .mdkg/artifacts/goal-86/current-security-audit-20260929.json.

# Expected vs Actual

- Expected: Local graph/evidence boundaries remain exact, ownership-aware and non-destructive.
- Actual: The selected order's status response can contain an unrelated workspace's receipt count, declared outcome, verification state, and evidence references, corrupting the structural evidence association presented to callers.

# Suspected Cause

listReceiptsForOrder compares every receipt's raw work_order_id against a set containing the selected order's unqualified ID. It does not resolve the reference using receipt.ws. Consequently, B's receipt for B:order.example is returned by status for A:order.example when both use the same legacy alias. Capability linkage independently uses the same raw alias-membership test for work_id and work_order_id across all workspaces.

Affected-version assessment: exact retained 0.6.0 candidate 6154e4ea920bfa09d57532171df808f3f406250b44b2b318f0bb48542f82cdca and frozen current source confirmed. Earlier published versions are unassessed; do not infer exposure from version numbers.

# Fix Plan

Resolve each work/order/receipt reference in its owning workspace and compare exact QIDs/identities. Use shared typed resolution and ensure warm/stale cached linkage cannot retain old cross-workspace associations. Preserve explicit cross-workspace links and deterministic order.

# Test Plan

Identical aliases in two workspaces; no accidental association; explicit qualified links, same-workspace legacy and v2 positives; agreement with receipt verification; cold/warm/stale JSON and SQLite views.

Use selective iteration under verify-close-and-checkpoint. Broaden for shared helper callers; Test491 and Task828 independently bind final installed/review evidence. Source/package-input changes invalidate the old candidate for final acceptance, not its immutable historical receipts.

# Links / Artifacts

- Current rule: integrity.workspace-evidence-association.
- .mdkg/artifacts/goal-86/current-security-audit-20260929.json and Chk667.
- Pre-patch boundary review was read-only and reused an independent reviewer because a fresh worker hit the host thread limit; this is not fresh post-patch verification.
