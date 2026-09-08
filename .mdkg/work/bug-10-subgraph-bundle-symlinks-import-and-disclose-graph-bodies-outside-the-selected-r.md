---
id: bug-10
type: bug
title: Subgraph bundle symlinks import and disclose graph bodies outside the selected repository
status: done
priority: 1
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-10-verification.json]
relates: [test-479]
blocked_by: []
blocks: []
refs: [chk-572]
context_refs: [goal-84, goal-83]
evidence_refs: []
aliases: []
skills: []
created: 2026-09-07
updated: 2026-09-08
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

Disposition: fixed locally on 2026-09-08; final task-828 verification and publication qualification remain open.

## Local Verification

Shared configured-bundle boundary validates raw paths before resolution,
rejects linked/nonregular/oversized input and bounds actual ZIP reads. Projection,
capability rereads and both body readers share it. Previously loaded cache bytes
remain available after genuine deletion, but links and malformed replacements
are rejected; cached bytes do not establish fresh verification. Operator-selected
external bundle inspection, native relative names and disabled aliases remain.

Before patch, 9/13 initial cases failed; 4 controls passed. Final focused suite:
16 passed. Installed package: 33 passed, including existing subgraph commands
and the unchanged cached-deletion compatibility test. Full source suite and 26
release/security-contract checks pass; CLI/docs/full and changed-only graph/diff
checks pass. Three inherited bundle-age warnings remain untouched.

First full run caught a cached-deletion compatibility regression (938/939);
the implementation was corrected, not the existing test, and all gates rerun.
Independent prepatch and one candidate source review completed. Published 0.5.2
contains the same unchecked paths. Exact source hashes, intermediate installed
integrity, remaining platform/race qualifications and preserved-state bookends:
.mdkg/artifacts/goal-84/bug-10-verification.json.

No runtime lease acquired; transient locks released. SQLite remains accepted
uncommitted generated custody. No remote, publication, provider, canonical graph
migration or bundle/subgraph refresh occurred. Goal qualification is NOT_READY.
