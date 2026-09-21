---
id: test-483
type: test
title: Verify installed behavioral audit blockers and passing compatibility controls
status: backlog
priority: 1
tags: [release-0.6.0, behavioral-audit]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-83/task-824-behavioral-audit.json, .mdkg/artifacts/goal-83/task-824-contract-audit.json, .mdkg/artifacts/goal-84/bug-24-adjacent-findings.json]
relates: [task-824, bug-21, bug-22, bug-23, bug-24, bug-25, bug-26, bug-27]
blocked_by: [bug-21, bug-22, bug-23, bug-24, bug-25, bug-26, bug-27, bug-28, bug-29, bug-32, bug-33, bug-34, task-827, task-839, task-838]
blocks: []
refs: [bug-28, bug-29, bug-32, bug-33, bug-34]
context_refs: [goal-83, goal-84, goal-86, dec-96]
evidence_refs: []
aliases: []
skills: []
cases: [test-483-case-1, test-483-case-2, test-483-case-3, test-483-case-4, test-483-case-5, test-483-case-6, test-483-case-7, test-483-case-8, test-483-case-9, test-483-case-10, test-483-case-11, test-483-case-12]
created: 2026-09-08
updated: 2026-09-17
---

# Current Successor Contract - 2026-09-13

Refresh the complete deduplicated behavioral-regression and passing-control matrix on final bytes; keep original failing-before evidence without reopening completed fixes.

This test no longer waits for task826 or Bug7 aggregate closure. Its updated
implementation prerequisites lead into installed cases; task826 consumes the
results. Record historical/current-intermediate/final-artifact-pass/failure/
unverified states. Final qualification uses one frozen0.6.0 tarball; macOS/Linux
completeness is independently bound by test487. Task828 remains independent
acceptance, not an upstream requirement for these test results.

The earlier sections below retain their historical evidence. This current addendum,
updated dependencies, goal-86 and dec-96 govern the remaining work. Planning
authoring is not execution, qualification, a writer claim, or publication.

# Overview

Verify the recorded behavioral blockers against the installed candidate and preserve passing compatibility controls. This is future fix verification, not a claim that the initial reproductions passed the desired contracts.

# Target / Scope

root:bug-21 through root:bug-29 and root:bug-32; root:task-824 evidence intake and bug-24 adjacent probes; root:task-828 independent acceptance. Bug32 adds installed quickstart and upgrade-hint parity, including reviewed hash/selection requirements and preserved refusal behavior.

# Preconditions / Environment

One frozen package with exact source/tarball hashes, disposable synthetic graphs under /private/tmp, isolated caches and local-only Git fixtures. Record exact Node version; repeat required installed qualification on 24.15.0, supported 24 and 26. No canonical migration, bundle refresh, source changes during snapshot review, remote Git, public routes or provider action. One mdkg-project-agent writer; preserve protected states and existing dirty custody.

# Test Cases

1. Legacy/v2, JSON/SQLite inspection on missing/stale caches makes no persistent changes; explicit index remains supported. Cover read-only storage, imported graphs and no-cache/reindex policy.
2. All four pack formats and profiles preserve stable identity and existing aliases, including remapped cross-links, visibility controls and output/token limits.
3. Format supports valid v2 identities and references without changing identity; legacy and unknown-version refusal controls remain passing; repeated formatting is deterministic.
4. Initialization preserves valid v2 graphs with optional legacy core omitted, respects unknown format/feature gates before all writes, and preserves complete-graph default/graph-only/--agent behavior, force boundaries and custom instructions.
5. Site cache invalidates direct/transitive external source changes and cannot issue acceptance evidence for stale output; unchanged inputs reuse the same immutable build/artifact identity.
6. Checkpoint routing withholds dependent work until checkpoint completion. No goal state alone substitutes for publication artifact and blocker rechecks.
7. Legacy delete/recreate at a reused alias/path requires explicit provenance before migration, while uninterrupted edits retain ancestor identity. Cover restoration/revert versus intentional recreation without guessing.
8. Migration candidate validation rejects missing skills and agrees with normal strict graph validation. Bind dependency inventory/content to preview, apply and recovery; no successful applied receipt for an invalid result.
9. Scaffold upgrade preserves v2 node identities; unsafe seed restoration and
   stale graph-format changes refuse before writes. Safe non-node upgrades and
   explicit interrupted-operation recovery remain supported.
10. Untouched packaged initialization has a closed reference graph and can adopt
    v2 without importing repository-only design docs. Preserve legacy/customized
    inputs without silently stripping their references to make migration pass.
11. Large CLI text/JSON/XML/TOON/Markdown output and nonzero diagnostics drain
    completely to ordinary and slow pipes, preserving UTF-8 bytes and exit codes.
    Compare installed output with regular-file output on all three runtimes.
    The frozen private graph migration preview must return a complete parseable
    plan; a blocked plan is not permission to synthesize bindings or apply it.
12. Portable skill/tool/model/WASM/image dependency labels survive migration,
    ordinary binding, reconciliation, template import and independent fork even
    when aliases collide. Explicit immutable refs stay strict and remappable;
    subagent refs keep graph/role checks. JSON/SQLite capability arrays agree and
    authored bytes remain unchanged by projection. Bug-34 has eight regressions
    passing on all three installed runtimes; final independent verification is
    still required before this aggregate test closes.

# Results / Evidence

Initial evidence: 26 primary and eight supplemental probes, zero final harness errors, five reproduced defect families. No remedies yet; this test stays backlog until failing-before/passing-after verification. Two original missing-core cases started invalid; the strengthened valid-before/invalid-after cases establish the init regression. A corrected temporary harness syntax error is not product evidence. Exact private receipt and harness hashes are in the linked sanitized artifact.

# Notes / Follow-ups

2026-09-09 intake: three further migration probes establish two additional
blockers, seven total. The 124 passing installed controls are not remedy
verification. Exact evidence is in the contract-audit artifact; this node stays
backlog until the seven fixes and required runtime matrix are verified.

All nine bugs block independent task-828 and therefore publication. Keep scope generic: graph identity, observational CLI behavior and reproducible local validation. No new skill or loop. Preserve unknown-version formatter refusal and complete-v2 init controls rather than weakening them to obtain a pass.
