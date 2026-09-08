---
id: task-824
type: task
title: Audit mdkg 0.6.0 behavioral contracts and classify validation gaps
status: backlog
priority: 1
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
blocked_by: [task-823, task-825]
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

Goal: End-to-end bootstrap, identity, migration, reconciliation, recovery, observational-read and release-gate audit.

Context: The complete approved contract is goal-83 and bounded blocker ownership is goal-84.

# Acceptance Criteria

Reuse achieved Goals 74/77/78/81/82 rather than reopen them. Reproduce audit observations before promoting defects: legacy cache writes on reads; pack identity serialization; format and repeated init on v2; bundle payload verification at consumers; checkpoint blocker routing; site build cache dependency closure. Classify each as confirmed blocker, rejected with evidence, or explicitly nonblocking.

# Files Affected

Read all current source and tests; write only owned findings/evidence, with validated bounded remedies routed through goal-84.

# Implementation Notes

This is the user-approved local-only 0.6.0 qualification pass. Owner mdkg-project-agent is the sole repository writer; use supported goal claims and transient locks. Preserve selected Goal 73, protected Demo 3 bundles, unrelated paths and runtime DB bytes. No remote Git, publication/dist-tags, tags, history rewriting, provider/deployment, consumer/root/sibling writes, canonical graph migration or bundle/subgraph refresh. Disposable local fixtures are allowed only under /private/tmp. Local explicit-path commits on main are authorized after validation and staged review. Stop for unknown custody, concurrent writer, baseline movement, required global configuration or materially new decisions.

# Test Plan

Case-level installed fixtures and source/contract trace; no speculative feature expansion.

# Links / Artifacts

Owning goal and dependencies are explicit above. Record exact commands, input/source/artifact hashes and pass/fail before completion.
