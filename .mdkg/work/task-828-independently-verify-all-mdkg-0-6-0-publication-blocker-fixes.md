---
id: task-828
type: task
title: Independently verify all mdkg 0.6.0 publication blocker fixes
status: backlog
priority: 1
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
blocked_by: [bug-5, bug-6, bug-7, bug-8, bug-9, bug-10, bug-11, bug-12, bug-13, bug-14, bug-15, bug-16, bug-17, bug-18, bug-19, bug-20, task-826, task-827]
blocks: []
refs: []
context_refs: [goal-83]
evidence_refs: []
aliases: []
skills: []
created: 2026-09-07
updated: 2026-09-07
---

# Overview

Goal: Independent verification of every publication blocker and exact remediation diff.

Context: The complete approved contract is goal-83 and bounded blocker ownership is goal-84.

# Acceptance Criteria

Require every bug in goal-84 fixed with failing-before/passing-after regression and affected-version assessment. Run a separate Codex Security diff workflow on the exact fix range after writers freeze it. Validate realistic consumers and dependency routing. Missing security coverage, failed tests, data loss or unresolved decisions keep this task incomplete. No automatic risk waivers.

# Files Affected

Read exact fix range and supporting code; write sanitized verification evidence only unless a newly validated bounded bug is explicitly routed first.

# Implementation Notes

This is the user-approved local-only 0.6.0 qualification pass. Owner mdkg-project-agent is the sole repository writer; use supported goal claims and transient locks. Preserve selected Goal 73, protected Demo 3 bundles, unrelated paths and runtime DB bytes. No remote Git, publication/dist-tags, tags, history rewriting, provider/deployment, consumer/root/sibling writes, canonical graph migration or bundle/subgraph refresh. Disposable local fixtures are allowed only under /private/tmp. Local explicit-path commits on main are authorized after validation and staged review. Stop for unknown custody, concurrent writer, baseline movement, required global configuration or materially new decisions.

# Test Plan

Independent diff report/hash, complete regression matrix, no unresolved publication-blocking finding and exact source range.

# Links / Artifacts

Owning goal and dependencies are explicit above. Record exact commands, input/source/artifact hashes and pass/fail before completion.
