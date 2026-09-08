---
id: bug-16
type: bug
title: Public bundles include a nested private workspace as public parent files
status: backlog
priority: 1
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: [test-479]
blocked_by: []
blocks: []
refs: []
context_refs: [goal-84, goal-83]
evidence_refs: []
aliases: []
skills: []
created: 2026-09-07
updated: 2026-09-07
---

# Overview

Configuration permits a private workspace document root nested under a public workspace's .mdkg directory. Public bundle traversal recursively includes those private files under the parent workspace's visibility, even though the filtered node index excludes the private workspace.

Severity: medium. Private authored graph bodies and associated files can be disclosed when an operator intentionally exports only public workspace content. Requires local operator consumption; no remote execution.

Owner and qualified execution scope: goal-84. Source evidence: src/commands/bundle.ts:756.

# Reproduction Steps

Use synthetic attacker-controlled inputs matching the sealed scan finding in an owned disposable fixture. Establish failing-before evidence without touching host sentinels outside owned temporary roots.

# Expected vs Actual

Expected: the stated contract is safe and fully evidenced. Actual: the sealed source scan confirms the reachable control gap; runtime reproduction is still pending.

# Suspected Cause

The bundle file walker is not workspace-ownership-aware. Alias filtering and reference checks apply to graph records, not every recursively collected file; configuration rejects equal roots but permits nested roots.

# Fix Plan

Establish exact file ownership across all registered workspace roots before export; prune nested roots from parent traversal and apply each owner's enabled/visibility policy, or reject unsupported overlap explicitly with compatibility guidance.

Allowed paths: affected implementation above, directly linked helper/consumer paths, focused regression tests and owned mdkg evidence. No unrelated refactoring. This is the user-approved local-only 0.6.0 qualification pass. Owner mdkg-project-agent is the sole repository writer; use supported goal claims and transient locks. Preserve selected Goal 73, protected Demo 3 bundles, unrelated paths and runtime DB bytes. No remote Git, publication/dist-tags, tags, history rewriting, provider/deployment, consumer/root/sibling writes, canonical graph migration or bundle/subgraph refresh. Disposable local fixtures are allowed only under /private/tmp. Local explicit-path commits on main are authorized after validation and staged review. Stop for unknown custody, concurrent writer, baseline movement, required global configuration or materially new decisions.

Affected-version assessment: confirmed against current 9d7e0d3f candidate source. Verify published 0.5.2 implementation before claiming it affected; identity features may be candidate-only. No invented CVE or advisory claim.

# Test Plan

1. Public parent with nested private/disabled child never exports child bytes.
2. Nested public child is included once with correct owner.
3. Sibling layouts and reference privacy validation remain valid.

Require failing-before/passing-after results and independent verification in task-828. Every security bug links a case-level source regression and installed consumer regression where applicable. No automatic waiver.

# Links / Artifacts

Codex Security scan 35ca791e-716a-4bc3-8067-88d47224e288; candidate key nested-private-workspace-bundle; sanitized hash receipt chk-571.

Disposition: open, not fixed, not publication-ready.
