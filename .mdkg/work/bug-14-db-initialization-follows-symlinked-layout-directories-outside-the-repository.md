---
id: bug-14
type: bug
title: DB initialization follows symlinked layout directories outside the repository
status: done
priority: 1
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-14-verification.json]
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

A repository-controlled .mdkg/db directory link is accepted as an existing directory. The normal db init command then writes project-db.json and creates child directories in the external target, although only repository-local DB initialization was requested.

Severity: medium. External file replacement with generated manifest content and external directory creation. Requires local operator consumption; no remote execution.

Owner and qualified execution scope: goal-84. Source evidence: src/commands/db.ts:178.

# Reproduction Steps

Use synthetic attacker-controlled inputs matching the sealed scan finding in an owned disposable fixture. Establish failing-before evidence without touching host sentinels outside owned temporary roots.

# Expected vs Actual

Expected: the stated contract is safe and fully evidenced. Actual: the sealed source scan confirms the reachable control gap; runtime reproduction is still pending.

# Suspected Cause

DB layout is lexically contained, but ensureDirectory uses statSync and manifest writes use uncontained atomicWriteFile. The mutation lock protects a different index directory.

# Fix Plan

Preflight every configured DB layout component using the existing contained filesystem authority before any write; use contained creation and manifest replacement and reject links or nonregular targets.

Allowed paths: affected implementation above, directly linked helper/consumer paths, focused regression tests and owned mdkg evidence. No unrelated refactoring. This is the user-approved local-only 0.6.0 qualification pass. Owner mdkg-project-agent is the sole repository writer; use supported goal claims and transient locks. Preserve selected Goal 73, protected Demo 3 bundles, unrelated paths and runtime DB bytes. No remote Git, publication/dist-tags, tags, history rewriting, provider/deployment, consumer/root/sibling writes, canonical graph migration or bundle/subgraph refresh. Disposable local fixtures are allowed only under /private/tmp. Local explicit-path commits on main are authorized after validation and staged review. Stop for unknown custody, concurrent writer, baseline movement, required global configuration or materially new decisions.

Affected-version assessment: confirmed against current 9d7e0d3f candidate source. Verify published 0.5.2 implementation before claiming it affected; identity features may be candidate-only. No invented CVE or advisory claim.

# Test Plan

1. DB root and child-directory symlinks fail before changes.
2. External project-db.json sentinel remains byte-identical.
3. Normal/custom contained layout and repeated init remain supported.

Require failing-before/passing-after results and independent verification in task-828. Every security bug links a case-level source regression and installed consumer regression where applicable. No automatic waiver.

# Links / Artifacts

Codex Security scan 35ca791e-716a-4bc3-8067-88d47224e288; candidate key db-init-directory-symlink; sanitized hash receipt chk-571.

## Local remediation verification

The DB-init containment defect is fixed locally. Every configured directory and
manifest/config target is checked before scaffold creation, then written through
the shared contained filesystem authority. Native configured layouts preserve
valid `..project-db` names, POSIX literal backslashes and root-self layouts.
The canonical graph/runtime DB and protected bundles were not initialized or
refreshed. Published 0.5.2 contains the same vulnerable implementation; no earlier
version claim is made.

Evidence: `.mdkg/artifacts/goal-84/bug-14-verification.json` binds exact source/test
hashes, failing-before triggers, independent review, 39 focused checks, 766 main
plus 26 release-contract tests, and a real installed-package DB smoke.
Both compatibility regressions found by the independent reviewer were reproduced
and corrected. No general concurrent-hostile-filesystem guarantee is claimed.

Disposition: local fix verified. Final task-828 security diff review and full
0.6.0 qualification remain required; this bug's completion is not publication
clearance or a substitute for the remaining blockers.
