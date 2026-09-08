---
id: task-832
type: task
title: Publish exact qualified mdkg 0.6.0 artifact and verify installation
status: blocked
priority: 1
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
blocked_by: [task-831]
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

Goal: Future exact-artifact npm publication and independent installed verification.

Context: Future goal-85 only; current authority excludes publication.

# Acceptance Criteria

Remain paused and unclaimed in this pass. Once task-831 passes under fresh approval, follow release-mdkg-package, publish the exact qualified 0.6.0 tarball, verify registry integrity and independent install workflows, and record immutable receipts. Push, tags, deployment, providers and consumer upgrades require separate approval.

# Files Affected

Only the explicitly approved registry/package and local verification fixtures under a new publication contract.

# Implementation Notes

This is the user-approved local-only 0.6.0 qualification pass. Owner mdkg-project-agent is the sole repository writer; use supported goal claims and transient locks. Preserve selected Goal 73, protected Demo 3 bundles, unrelated paths and runtime DB bytes. No remote Git, publication/dist-tags, tags, history rewriting, provider/deployment, consumer/root/sibling writes, canonical graph migration or bundle/subgraph refresh. Disposable local fixtures are allowed only under /private/tmp. Local explicit-path commits on main are authorized after validation and staged review. Stop for unknown custody, concurrent writer, baseline movement, required global configuration or materially new decisions.

# Test Plan

Registry exact version/integrity and fresh independent installed-package verification; no rebuilt artifact substitution.

# Links / Artifacts

Owning goal and dependencies are explicit above. Record exact commands, input/source/artifact hashes and pass/fail before completion.
