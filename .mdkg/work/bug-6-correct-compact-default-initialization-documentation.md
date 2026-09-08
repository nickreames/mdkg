---
id: bug-6
type: bug
title: Correct compact default initialization documentation
status: backlog
priority: 1
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: [test-477]
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

Maintained bootstrap instructions still describe agent guidance as optional while compact setup is the init default. Correct materially false release/install guidance and validate every documented command.

Owner and qualified execution scope: goal-84. Source evidence: README.md bootstrap/init sections; Goal 81 completed source contract.

# Reproduction Steps

Reproduce the stated gap against the frozen baseline, then the installed candidate; preserve exact source and package identity.

# Expected vs Actual

Expected: the stated contract is safe and fully evidenced. Actual: the known defect/evidence gap remains unresolved at intake.

# Suspected Cause

Maintained bootstrap instructions still describe agent guidance as optional while compact setup is the init default. Correct materially false release/install guidance and validate every documented command.

# Fix Plan

Update maintained README/release guidance for default compact init, graph-only and --agent compatibility; preserve project documentation and legacy customization behavior.

Allowed paths: affected implementation above, directly linked helper/consumer paths, focused regression tests and owned mdkg evidence. No unrelated refactoring. This is the user-approved local-only 0.6.0 qualification pass. Owner mdkg-project-agent is the sole repository writer; use supported goal claims and transient locks. Preserve selected Goal 73, protected Demo 3 bundles, unrelated paths and runtime DB bytes. No remote Git, publication/dist-tags, tags, history rewriting, provider/deployment, consumer/root/sibling writes, canonical graph migration or bundle/subgraph refresh. Disposable local fixtures are allowed only under /private/tmp. Local explicit-path commits on main are authorized after validation and staged review. Stop for unknown custody, concurrent writer, baseline movement, required global configuration or materially new decisions.

Affected-version assessment: confirmed against current 9d7e0d3f candidate source. Verify published 0.5.2 implementation before claiming it affected; identity features may be candidate-only. No invented CVE or advisory claim.

# Test Plan

1. Actual published 0.5.2 tarball integrity and installed upgrade, not a mock legacy seed
2. Default compact init, --graph-only and --agent compatibility
3. Customized AGENTS/CLAUDE and project README/LICENSE preserved
4. Repeated preview/apply, stale plan, interrupted upgrade and recovery
5. Native skill mirrors, resource links and rollback compatibility

Require failing-before/passing-after results and independent verification in task-828. Every security bug links a case-level source regression and installed consumer regression where applicable. No automatic waiver.

# Links / Artifacts

Initial approved plan and chk-563/Goal 82 history.

Disposition: open, not fixed, not publication-ready.
