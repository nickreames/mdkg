---
id: task-831
type: task
title: Recheck mdkg 0.6.0 approval blockers and sealed candidate
status: blocked
priority: 1
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
blocked_by: [chk-570, task-828]
blocks: []
refs: []
context_refs: [goal-85]
evidence_refs: []
aliases: []
skills: []
created: 2026-09-07
updated: 2026-09-07
---

# Overview

Goal: Future fresh publication authority and independent candidate identity verification.

Context: Future goal-85 only; current authority excludes publication.

# Acceptance Criteria

Stay blocked and unclaimed until goal-85 receives fresh explicit publication authority. Verify chk-570 is completed, task-828 passed and goal-84 has no unresolved blockers. Independently verify exact version, source, package-input hashes, tarball integrity and validation freshness. Require the same qualified artifact; do not rebuild implicitly.

# Files Affected

Read goals, immutable candidate and fresh registry state only after explicit publication approval; no action in the current pass.

# Implementation Notes

This is the user-approved local-only 0.6.0 qualification pass. Owner mdkg-project-agent is the sole repository writer; use supported goal claims and transient locks. Preserve selected Goal 73, protected Demo 3 bundles, unrelated paths and runtime DB bytes. No remote Git, publication/dist-tags, tags, history rewriting, provider/deployment, consumer/root/sibling writes, canonical graph migration or bundle/subgraph refresh. Disposable local fixtures are allowed only under /private/tmp. Local explicit-path commits on main are authorized after validation and staged review. Stop for unknown custody, concurrent writer, baseline movement, required global configuration or materially new decisions.

# Test Plan

Fresh authority receipt plus artifact/blocker recheck; goal done/evaluate alone never authorizes publication.

# Links / Artifacts

Owning goal and dependencies are explicit above. Record exact commands, input/source/artifact hashes and pass/fail before completion.
