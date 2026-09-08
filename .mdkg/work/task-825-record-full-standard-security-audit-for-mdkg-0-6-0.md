---
id: task-825
type: task
title: Record full Standard security audit for mdkg 0.6.0
status: done
priority: 1
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [chk-571]
context_refs: [goal-83]
evidence_refs: []
aliases: []
skills: []
created: 2026-09-07
updated: 2026-09-07
---

# Overview

Goal: The completed immutable Standard security source scan and its sanitized durable finding dispositions.

Context: The complete approved contract is goal-83 and bounded blocker ownership is goal-84.

# Acceptance Criteria

Bind scan 35ca791e-716a-4bc3-8067-88d47224e288 to frozen 9d7e0d3f source and snapshot digest. Record independent baseline, 8 focused review packets, 359 authored executable files including 123 runtime files, explicit exclusions and 13 findings. Rejected query-credential candidate has source-backed counterevidence. This task does not clear findings or qualify publication.

# Files Affected

Plugin-owned canonical reports remain outside the repository; write only scan IDs, hashes, summaries and regression references to mdkg.

# Implementation Notes

This is the user-approved local-only 0.6.0 qualification pass. Owner mdkg-project-agent is the sole repository writer; use supported goal claims and transient locks. Preserve selected Goal 73, protected Demo 3 bundles, unrelated paths and runtime DB bytes. No remote Git, publication/dist-tags, tags, history rewriting, provider/deployment, consumer/root/sibling writes, canonical graph migration or bundle/subgraph refresh. Disposable local fixtures are allowed only under /private/tmp. Local explicit-path commits on main are authorized after validation and staged review. Stop for unknown custody, concurrent writer, baseline movement, required global configuration or materially new decisions.

# Test Plan

Canonical report exists and sealed manifest/findings/coverage hashes match chk-571. No missing source coverage represented as no findings.

# Links / Artifacts

Owning goal and dependencies are explicit above. Sealed scan receipt: chk-571.
