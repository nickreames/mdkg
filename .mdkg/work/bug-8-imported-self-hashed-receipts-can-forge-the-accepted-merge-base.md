---
id: bug-8
type: bug
title: Imported self-hashed receipts can forge the accepted merge base
status: done
priority: 1
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-8-verification.json]
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

Expected: receipt consistency cannot authorize target replay. The original defect reproduced in eight before-patch cases. The corrected candidate passes ten adversarial receipt/binding cases and legitimate replay, recovery, fork, clone and branch-rename controls; see the verification artifact.

# Suspected Cause

Transported provenance and authoritative target acceptance share one namespace and parser; a valid self-hash proves content consistency, not acceptance.

# Fix Plan

Separate transported evidence from target-owned acceptance authority. Validate receipt structure and exact binding bytes, require target ancestry plus a target-owned acceptance binding or the own receipt of a verified local application, and quarantine incoming bindings. Preserve immutable evidence bytes without letting their self-hashes grant authority. Acceptance cannot depend on freezing the output until a Git commit: the independent reviewer reproduced lost replay decisions after legitimate pre-commit edits followed by a clone or branch rename. The corrected binding preserves that target decision without treating imported bindings as authority.

Allowed paths: affected implementation above, directly linked helper/consumer paths, focused regression tests and owned mdkg evidence. No unrelated refactoring. This is the user-approved local-only 0.6.0 qualification pass. Owner mdkg-project-agent is the sole repository writer; use supported goal claims and transient locks. Preserve selected Goal 73, protected Demo 3 bundles, unrelated paths and runtime DB bytes. No remote Git, publication/dist-tags, tags, history rewriting, provider/deployment, consumer/root/sibling writes, canonical graph migration or bundle/subgraph refresh. Disposable local fixtures are allowed only under /private/tmp. Local explicit-path commits on main are authorized after validation and staged review. Stop for unknown custody, concurrent writer, baseline movement, required global configuration or materially new decisions.

Affected-version assessment: unpublished Goal 82 identity implementation. The exact published 0.5.2 package inventory contains no identity implementation modules; this finding is not claimed against 0.5.2. No CVE or advisory claim.

# Test Plan

1. Self-hashed receipt with empty mappings cannot become authority.
2. Receipt-only import naming an unaccepted revision cannot alter the semantic base.
3. False-base lifecycle overwrite and forged replay suppression fail closed.
4. Legitimate repeated integration and independent-fork provenance remain supported.

Require failing-before/passing-after results and independent verification in task-828. Every security bug links a case-level source regression and installed consumer regression where applicable. No automatic waiver.

# Links / Artifacts

Codex Security scan 35ca791e-716a-4bc3-8067-88d47224e288; candidate key identity-incoming-acceptance-provenance; sanitized hash receipt chk-571.

Disposition: fixed and verified locally. Source and installed-package reconciliation suites each pass 27 tests. The post-review full main suite and 26 release/security-contract checks pass; CLI/doc/graph/diff checks pass. Fresh independent investigation and one independent patch review completed; both reviewer regressions were reproduced and corrected. Final task-828 exact-range security review and the overall release qualification remain open; this is not publication readiness.

Evidence: `.mdkg/artifacts/goal-84/bug-8-verification.json`. No selected-goal, runtime DB, protected bundle, remote Git or publication changes.
