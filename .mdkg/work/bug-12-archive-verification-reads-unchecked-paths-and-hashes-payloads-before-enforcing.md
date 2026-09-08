---
id: bug-12
type: bug
title: Archive verification reads unchecked paths and hashes payloads before enforcing file and size limits
status: done
priority: 1
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-12-verification.json]
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

The default archive verify path parses sidecars directly and requires nonempty stored_path and compressed_path strings, but does not run their normal relative-path validator. It path.resolve's these attacker-controlled values and passes them to checkArchiveIntegrity. That function invokes hashArchiveFile, which performs an unrestricted fs.readFileSync. Even normal graph parsing's lexical relative-path checks can be bypassed with a payload symlink. The compressed file is fully read for hashing before the bounded ZIP reader runs; the raw file is fully read before its size is inspected.

Severity: low. Source-backed local availability and external-file fingerprint leakage, with operator consumption required. No arbitrary raw-content disclosure or code execution; constrained impact is downgraded from baseline's medium assessment.

Owner and qualified execution scope: goal-84. Source evidence: src/graph/archive_integrity.ts:26, src/commands/archive.ts:387, src/graph/archive_integrity.ts:41, src/graph/archive_integrity.ts:65.

# Reproduction Steps

Use synthetic attacker-controlled inputs matching the sealed scan finding in an owned disposable fixture. Establish failing-before evidence without touching host sentinels outside owned temporary roots.

# Expected vs Actual

Expected: the stated contract is safe and fully evidenced. Actual: the sealed source scan confirms the reachable control gap; runtime reproduction is still pending.

# Suspected Cause

Parent verified direct archive verification accepts unchecked payload path strings; ordinary parsing only gives lexical checks. Both ZIP and raw payloads are fully hashed before byte/regular-file containment controls. ZIP parser limits occur too late for the first allocation.

# Fix Plan

Validate sidecars through a shared schema and root-aware path authority for every command. Open only contained regular files, enforce compressed and raw byte limits before hashing, and hash through bounded reads. Do not expose external-file digests as an incidental consequence of invalid paths.

Allowed paths: affected implementation above, directly linked helper/consumer paths, focused regression tests and owned mdkg evidence. No unrelated refactoring. This is the user-approved local-only 0.6.0 qualification pass. Owner mdkg-project-agent is the sole repository writer; use supported goal claims and transient locks. Preserve selected Goal 73, protected Demo 3 bundles, unrelated paths and runtime DB bytes. No remote Git, publication/dist-tags, tags, history rewriting, provider/deployment, consumer/root/sibling writes, canonical graph migration or bundle/subgraph refresh. Disposable local fixtures are allowed only under /private/tmp. Local explicit-path commits on main are authorized after validation and staged review. Stop for unknown custody, concurrent writer, baseline movement, required global configuration or materially new decisions.

Affected-version assessment: confirmed against current 9d7e0d3f candidate source. Verify published 0.5.2 implementation before claiming it affected; identity features may be candidate-only. No invented CVE or advisory claim.

# Test Plan

1. Regression for the exact source-to-sink input and every independently reachable sibling consumer.
2. Positive contained regular-file behavior and compatibility remain supported.
3. Rejected paths leave external files, selected state and Git staging unchanged.

Require failing-before/passing-after results and independent verification in task-828. Every security bug links a case-level source regression and installed consumer regression where applicable. No automatic waiver.

# Links / Artifacts

Codex Security scan 35ca791e-716a-4bc3-8067-88d47224e288; candidate key baseline-archive-read-containment; sanitized hash receipt chk-571.

Disposition: fixed locally on 2026-09-08; final task-828 verification and publication qualification remain open.

## Local Verification

Direct verification now validates the shared archive schema before resolving
payload paths, and reads contained bounded sidecars. Live node parsing requires
explicit repository authority; all non-deferred source callers supply it.
ZIP hashing/parsing use identical bounded bytes. Raw hashing and byte counting
stream from one contained descriptor. Limits precede hashing, rejecting links,
special files and oversize payloads without incidental external fingerprints.
ID filtering precedes unrelated legacy payload verification. Absent raw copies,
corruption diagnostics, operator-selected external archive add and explicitly
deferred historical parsing remain supported.

Before patch: 13/18 cases failed, five controls passed. Expanded focused suite:
25 passed. Installed archive/work/ownership/ZIP tests: 48 passed. Full suite:
964 source tests and 26 contract checks passed with zero failures/skips.
CLI/docs/full and changed-only graph/diff checks pass; three inherited bundle-age
warnings remain untouched. Independent prepatch and one candidate source review
completed without a concrete surviving bypass or introduced regression.

Exact published 0.5.2 contains the same unrestricted hashing sink; earlier
versions unassessed. Source hashes, intermediate installed integrity, protected
state hashes and remaining platform/aggregate-work/race limitations are bound in
.mdkg/artifacts/goal-84/bug-12-verification.json. No runtime lease acquired;
transient locks released. SQLite remains accepted uncommitted generated custody.
No remote, publication, provider, canonical migration or bundle refresh occurred.
