---
id: bug-10
type: bug
title: Subgraph bundle symlinks import and disclose graph bodies outside the selected repository
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

resolveBundlePath performs path.resolve(root, source.path). projectOneSource reads the resulting bundle through readBundleEntries without root-aware filesystem containment. A lexically local source path can be a symlink to an external valid private bundle. After its normal manifest and integrity checks pass, its nodes become imported index entries. Both imported node-body readers subsequently resolve source.bundle_path and call readZipFileEntries directly, allowing ordinary show and pack operations, including MCP, to return the external graph bodies.

Severity: medium. Private external graph bodies can be disclosed through a configured local import. Requires a readable valid bundle at a known or guessed host location and operator consumption of the repository.

Owner and qualified execution scope: goal-84. Source evidence: src/graph/subgraphs.ts:232, src/graph/subgraphs.ts:384, src/graph/node_body.ts:28, src/graph/node_body.ts:53.

# Reproduction Steps

Use synthetic attacker-controlled inputs matching the sealed scan finding in an owned disposable fixture. Establish failing-before evidence without touching host sentinels outside owned temporary roots.

# Expected vs Actual

Expected: the stated contract is safe and fully evidenced. Actual: the sealed source scan confirms the reachable control gap; runtime reproduction is still pending.

# Suspected Cause

Parent verified projection and both imported-body readers follow a lexical bundle path through raw ZIP reads; manifest hashes establish bundle integrity, not root authorization.

# Fix Plan

Require contained, regular-file bundle reads at both initial source projection and every later body read. Reject symlinked source ancestry using filesystem_authority, or introduce a separately explicit external-source authority rather than accepting it through lexical relative paths.

Allowed paths: affected implementation above, directly linked helper/consumer paths, focused regression tests and owned mdkg evidence. No unrelated refactoring. This is the user-approved local-only 0.6.0 qualification pass. Owner mdkg-project-agent is the sole repository writer; use supported goal claims and transient locks. Preserve selected Goal 73, protected Demo 3 bundles, unrelated paths and runtime DB bytes. No remote Git, publication/dist-tags, tags, history rewriting, provider/deployment, consumer/root/sibling writes, canonical graph migration or bundle/subgraph refresh. Disposable local fixtures are allowed only under /private/tmp. Local explicit-path commits on main are authorized after validation and staged review. Stop for unknown custody, concurrent writer, baseline movement, required global configuration or materially new decisions.

Affected-version assessment: confirmed against current 9d7e0d3f candidate source. Verify published 0.5.2 implementation before claiming it affected; identity features may be candidate-only. No invented CVE or advisory claim.

# Test Plan

1. Regression for the exact source-to-sink input and every independently reachable sibling consumer.
2. Positive contained regular-file behavior and compatibility remain supported.
3. Rejected paths leave external files, selected state and Git staging unchanged.

Require failing-before/passing-after results and independent verification in task-828. Every security bug links a case-level source regression and installed consumer regression where applicable. No automatic waiver.

# Links / Artifacts

Codex Security scan 35ca791e-716a-4bc3-8067-88d47224e288; candidate key baseline-subgraph-link-disclosure; sanitized hash receipt chk-571.

Disposition: open, not fixed, not publication-ready.
