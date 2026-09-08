---
id: bug-9
type: bug
title: Configured derived-cache paths follow symlinked parent directories outside the repository
status: done
priority: 1
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-9-verification.json]
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

Configuration accepts lexically contained custom index.global_index_path and capabilities.cache_path values. writeDerivedIndexes resolves these paths without checking filesystem ancestry and passes them through cache writers to atomicWriteFile. That writer creates and renames a temporary file through the supplied parent directory, following a pre-existing directory symlink. A repository can therefore set a custom cache destination such as redirected/victim.json, where redirected points to an external directory writable by the victim.

Severity: medium. A repository contributor can redirect a normal index operation into replacement of another writable host file. Generated JSON constrains bytes and local operator invocation is required.

Owner and qualified execution scope: goal-84. Source evidence: src/graph/reindex.ts:34, src/util/atomic.ts:25, src/core/config.ts:602.

# Reproduction Steps

Use synthetic attacker-controlled inputs matching the sealed scan finding in an owned disposable fixture. Establish failing-before evidence without touching host sentinels outside owned temporary roots.

# Expected vs Actual

Expected: configured cache outputs cannot replace files through linked ancestry. Before patch, six safety regressions failed and the contained native-path control passed. After patch, all original attacks and direct writer/loader siblings reject without outside writes.

# Suspected Cause

Parent verified the custom cache path is only lexically validated and reaches the generic atomic writer; the fixed .mdkg/index mutation lock does not validate that custom parent directory.

# Fix Plan

Use the existing root-aware atomicReplaceContainedFile authority for every derived-cache output, including custom configured paths. Check the full destination ancestry and retain containment at the actual replacement operation.

Allowed paths: affected implementation above, directly linked helper/consumer paths, focused regression tests and owned mdkg evidence. No unrelated refactoring. This is the user-approved local-only 0.6.0 qualification pass. Owner mdkg-project-agent is the sole repository writer; use supported goal claims and transient locks. Preserve selected Goal 73, protected Demo 3 bundles, unrelated paths and runtime DB bytes. No remote Git, publication/dist-tags, tags, history rewriting, provider/deployment, consumer/root/sibling writes, canonical graph migration or bundle/subgraph refresh. Disposable local fixtures are allowed only under /private/tmp. Local explicit-path commits on main are authorized after validation and staged review. Stop for unknown custody, concurrent writer, baseline movement, required global configuration or materially new decisions.

Affected-version assessment: the exact published 0.5.2 tarball contains the same raw cache writer and aggregate sequence; failing-before execution used the equivalent prepatch candidate. Earlier versions unassessed. No CVE or advisory claim.

# Test Plan

1. Regression for the exact source-to-sink input and every independently reachable sibling consumer.
2. Positive contained regular-file behavior and compatibility remain supported.
3. Rejected paths leave external files, selected state and Git staging unchanged.

Require failing-before/passing-after results and independent verification in task-828. Every security bug links a case-level source regression and installed consumer regression where applicable. No automatic waiver.

# Links / Artifacts

Codex Security scan 35ca791e-716a-4bc3-8067-88d47224e288; candidate key baseline-cache-parent-symlink; sanitized hash receipt chk-571.

Disposition: fixed and verified locally. All four JSON writers require explicit checkout-root authority and use contained replacement; all aggregate destinations are preflighted before earlier cache writes. Native contained custom paths and inactive SQLite behavior remain supported. This does not make earlier authored mutations in surrounding commands transactional, nor claim portable protection against concurrent hostile parent swaps.

Fresh independent investigation and one independent candidate review completed. The reviewer found no surviving static-link bypass or product regression, and identified a test portability issue on hosts without symlink privileges. EPERM-only fixture handling and scoped fault injection now pass without hiding unrelated failures. Final source checks pass 38 tests; actual offline installed-package checks pass 34 with unchanged installed bytes. The full suite passed 814 plus 26 tests against identical package inputs before the test-only portability adjustment. CLI/docs/graph/diff checks pass; three inherited bundle-age warnings remain untouched.

Evidence: `.mdkg/artifacts/goal-84/bug-9-verification.json`. Final task-828 security diff review and overall 0.6.0 qualification remain open; this is not publication readiness.
