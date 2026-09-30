---
id: task-829
type: task
title: Run full mdkg 0.6.0 local release qualification ladder
status: done
priority: 1
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/successor-installed-case-acceptance-20260930.json, .mdkg/artifacts/goal-86/successor-installed-platform-qualification-20260930.json, .mdkg/artifacts/goal-86/successor-security-acceptance-20260930.json, .mdkg/artifacts/goal-86/successor-package-gates-20260930.json, .mdkg/artifacts/goal-86/successor-private-preview-20260930.json]
relates: []
blocked_by: [task-828, test-477, test-478, test-479, test-480, test-481, test-482, task-827, bug-30, task-837, test-483, test-484, test-486, test-487, task-838, task-839, test-488, test-490]
blocks: []
refs: [dec-100]
context_refs: [goal-83, goal-86, dec-96]
evidence_refs: []
aliases: []
skills: []
created: 2026-09-07
updated: 2026-09-30
---

# Current accepted package closeout contract - 2026-09-28 Dec100

Run37 CLI/package smokes, full applicable discovery, unchanged89/77/96 coverage, packaged guidance/skills/contracts/MCP/seed parity, graph/SQLite/diff checks. Consume admitted retained bytes without silent repacking. Task843/Test490 prepare the harness before Task828; this task performs final acceptance afterward.

Dec100 requires37 package smokes plus local platform/security/guidance acceptance.
All46 definitions remain; nine website smokes/nine site profiles defer to Epic258
and hosted execution to Epic257. Same-input case evidence can be reused; missing
seal does not erase passes. Node >=24.18.0 <25 replaces old runtime success gates.
Bugs46/47 remain deferred/unresolved; no blocked scan context recovery. This
amendment is not qualification proof or publication authority.

# Historical contract and evidence retained below

# Current Successor Contract - 2026-09-13

Run the entire manifest-backed ladder after task828 and all final-artifact test
gates including test487. Preserve89/77/96coverage floors, complete discovery,
source/help/docs/MCP/seed/native-skill/package parity, full/changed graph validation,
supported db index verify and diff checks. Both macOS/Linux evidence sets must
bind the same package inputs/tarball. This final refresh is not a prerequisite
of test487's earlier platform proof, avoiding a ladder/platform dependency cycle.

The earlier sections below retain their historical evidence. This current addendum,
updated dependencies, goal-86 and dec-96 govern the remaining work. Planning
authoring is not execution, qualification, a writer claim, or publication.

# Overview

Goal: Complete local release ladder, tests, coverage and graph integrity for the final candidate.

Context: The complete approved contract is goal-83 and bounded blocker ownership is goal-84.

# Acceptance Criteria

Require task-828, all installed fixture tests and draft metadata complete. Run full manifest-backed ladder, complete tests, CLI/command/docs/skill/package checks, full and changed-only graph validation, SQLite verification and git diff --check. Floors remain 89 percent lines, 77 branches and 96 functions. Compare protected before/after hashes; hosted CI and remotes remain unverified.

# Files Affected

Owned validation infrastructure and evidence; generated build outputs/caches only as required; protected bundles/runtime/selection excluded.

# Implementation Notes

This is the user-approved local-only 0.6.0 qualification pass. Owner mdkg-project-agent is the sole repository writer; use supported goal claims and transient locks. Preserve selected Goal 73, protected Demo 3 bundles, unrelated paths and runtime DB bytes. No remote Git, publication/dist-tags, tags, history rewriting, provider/deployment, consumer/root/sibling writes, canonical graph migration or bundle/subgraph refresh. Disposable local fixtures are allowed only under /private/tmp. Local explicit-path commits on main are authorized after validation and staged review. Stop for unknown custody, concurrent writer, baseline movement, required global configuration or materially new decisions.

# Test Plan

All existing gates retained and passing; missing runtimes, tests, provenance or required coverage block qualification.

# Links / Artifacts

Owning goal and dependencies are explicit above. Record exact commands, input/source/artifact hashes and pass/fail before completion.
