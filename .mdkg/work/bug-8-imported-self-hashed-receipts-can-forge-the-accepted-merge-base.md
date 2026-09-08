---
id: bug-8
type: bug
title: Imported self-hashed receipts can forge the accepted merge base
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

Incoming graph evidence is copied into the same receipt namespace that later authorizes replay and semantic-base selection. A branch author can supply a self-consistent receipt claiming acceptance of an unaccepted revision, making a later reviewed plan overwrite target lifecycle changes or skip an integration without the conflict decision that the real common ancestor requires.

Severity: medium. High integrity impact on target project memory, constrained to a local operator importing an attacker-influenced branch and subsequently approving exact plans; no unauthenticated service or code execution.

Owner and qualified execution scope: goal-84. Source evidence: src/graph/identity_history.ts:35, src/graph/identity_reconciliation_plan.ts:134, src/graph/identity_history.ts:116, src/graph/identity_reconciliation_plan.ts:99, src/graph/identity_reconcile.ts:179.

# Reproduction Steps

Use synthetic attacker-controlled inputs matching the sealed scan finding in an owned disposable fixture. Establish failing-before evidence without touching host sentinels outside owned temporary roots.

# Expected vs Actual

Expected: the stated contract is safe and fully evidenced. Actual: the sealed source scan confirms the reachable control gap; runtime reproduction is still pending.

# Suspected Cause

Transported provenance and authoritative target acceptance share one namespace and parser; a valid self-hash proves content consistency, not acceptance.

# Fix Plan

Separate transported evidence from target-owned acceptance authority. Validate full receipt structure, require verifiable target ancestry/output or a locally verified transaction before using a receipt as a replay base, and fail closed or quarantine unproven incoming receipts. Preserve immutable evidence bytes without letting their self-hashes grant authority.

Allowed paths: affected implementation above, directly linked helper/consumer paths, focused regression tests and owned mdkg evidence. No unrelated refactoring. This is the user-approved local-only 0.6.0 qualification pass. Owner mdkg-project-agent is the sole repository writer; use supported goal claims and transient locks. Preserve selected Goal 73, protected Demo 3 bundles, unrelated paths and runtime DB bytes. No remote Git, publication/dist-tags, tags, history rewriting, provider/deployment, consumer/root/sibling writes, canonical graph migration or bundle/subgraph refresh. Disposable local fixtures are allowed only under /private/tmp. Local explicit-path commits on main are authorized after validation and staged review. Stop for unknown custody, concurrent writer, baseline movement, required global configuration or materially new decisions.

Affected-version assessment: confirmed against current 9d7e0d3f candidate source. Verify published 0.5.2 implementation before claiming it affected; identity features may be candidate-only. No invented CVE or advisory claim.

# Test Plan

1. Self-hashed receipt with empty mappings cannot become authority.
2. Receipt-only import naming an unaccepted revision cannot alter the semantic base.
3. False-base lifecycle overwrite and forged replay suppression fail closed.
4. Legitimate repeated integration and independent-fork provenance remain supported.

Require failing-before/passing-after results and independent verification in task-828. Every security bug links a case-level source regression and installed consumer regression where applicable. No automatic waiver.

# Links / Artifacts

Codex Security scan 35ca791e-716a-4bc3-8067-88d47224e288; candidate key identity-incoming-acceptance-provenance; sanitized hash receipt chk-571.

Disposition: open, not fixed, not publication-ready.
