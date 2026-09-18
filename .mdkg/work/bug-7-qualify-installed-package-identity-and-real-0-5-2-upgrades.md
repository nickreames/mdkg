---
id: bug-7
type: bug
title: Qualify installed package identity and real 0.5.2 upgrades
status: progress
priority: 1
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-7-progress.json]
relates: [task-826]
blocked_by: [task-824]
blocks: []
refs: [chk-586]
context_refs: [goal-84, goal-83]
evidence_refs: []
aliases: []
skills: []
created: 2026-09-07
updated: 2026-09-09
---

# Overview

Current source/unit tests do not establish installed-package identity behavior or a real published 0.5.2 upgrade. Missing required compatibility evidence blocks publication.

Owner and qualified execution scope: goal-84. Source evidence: Goal 82 installed-package qualification absent from current smoke manifest.

# Reproduction Steps

Reproduce the stated gap against the frozen baseline, then the installed candidate; preserve exact source and package identity.

# Expected vs Actual

Expected: the stated contract is safe and fully evidenced. Actual: the known defect/evidence gap remains unresolved at intake.

# Suspected Cause

Current source/unit tests do not establish installed-package identity behavior or a real published 0.5.2 upgrade. Missing required compatibility evidence blocks publication.

# Fix Plan

Add manifest-backed installed tarball fixtures covering actual 0.5.2 upgrade and complete identity/reconciliation/legacy semantics across approved runtimes.

Allowed paths: affected implementation above, directly linked helper/consumer paths, focused regression tests and owned mdkg evidence. No unrelated refactoring. This is the user-approved local-only 0.6.0 qualification pass. Owner mdkg-project-agent is the sole repository writer; use supported goal claims and transient locks. Preserve selected Goal 73, protected Demo 3 bundles, unrelated paths and runtime DB bytes. No remote Git, publication/dist-tags, tags, history rewriting, provider/deployment, consumer/root/sibling writes, canonical graph migration or bundle/subgraph refresh. Disposable local fixtures are allowed only under /private/tmp. Local explicit-path commits on main are authorized after validation and staged review. Stop for unknown custody, concurrent writer, baseline movement, required global configuration or materially new decisions.

Affected-version assessment: confirmed against current 9d7e0d3f candidate source. Verify published 0.5.2 implementation before claiming it affected; identity features may be candidate-only. No invented CVE or advisory claim.

# Test Plan

1. Actual published 0.5.2 tarball integrity and installed upgrade, not a mock legacy seed
2. Default compact init, --graph-only and --agent compatibility
3. Customized AGENTS/CLAUDE and project README/LICENSE preserved
4. Repeated preview/apply, stale plan, interrupted upgrade and recovery
5. Native skill mirrors, resource links and rollback compatibility
6. Two offline local branches create colliding numeric aliases and cross-linked stable identities
7. Ordinary commands work on uncommitted, staged and unstaged authored nodes
8. Different identities remap deterministically; same-identity changes use real ancestry
9. Lifecycle/evidence conflict, delete/modify, repeated integration and explicit reintroduction
10. Cherry-pick/revert and newer ancestry preserve immutable external receipt bytes

Require failing-before/passing-after results and independent verification in task-828. Every security bug links a case-level source regression and installed consumer regression where applicable. No automatic waiver.

# Links / Artifacts

Initial approved plan and chk-563/Goal 82 history.

Disposition: open, not fixed, not publication-ready.

## 2026-09-09 Installed Upgrade and Independent Branch Milestone

Chk-586 and `.mdkg/artifacts/goal-84/bug-7-progress.json` record real published
0.5.2 standard/customized upgrades plus independent-clone v2 collaboration on
Node 24.18.0 and 26.0.0. Existing smoke entries retain prior coverage while adding
natural collisions, cross-links, staged/untracked reads, reviewed mappings,
same-identity decisions, stale plans, replay/revert and reintroduction checks.
User documents, custom skills/mirrors, Git staging and external fixture evidence
retain their required treatment. Full source suite: 1341 passed; CLI/docs,
focused contracts and graph checks pass. Fixture corrections are recorded.

Still open: minimum Node 24.15.0, complete installed recovery/delete-modify and
evidence-conflict cases, legacy/old-client compatibility, remaining task-826
families, final independent task-828 review, full ladder and artifact seal.
This milestone does not close bug-7 or authorize publication. Bug-17 remains
separate custody; selected Goal 73 and runtime/bundle bytes are unchanged.
