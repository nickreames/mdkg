---
id: task-829
type: task
title: Run full mdkg 0.6.0 local release qualification ladder
status: backlog
priority: 1
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
blocked_by: [task-828, test-477, test-478, test-479, test-480, test-481, test-482, task-827, bug-30]
blocks: []
refs: []
context_refs: [goal-83]
evidence_refs: []
aliases: []
skills: []
created: 2026-09-07
updated: 2026-09-09
---

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
