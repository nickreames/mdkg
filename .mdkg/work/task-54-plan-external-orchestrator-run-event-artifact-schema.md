---
id: task-54
type: task
title: plan external orchestrator run event artifact schema
status: done
priority: 1
epic: epic-5
tags: [v0_4, orchestration, contract, events]
owners: []
links: []
artifacts: []
relates: [prd-1, dec-10, edd-3, edd-6, edd-8, epic-5]
blocked_by: []
blocks: []
refs: []
aliases: [run-envelope, artifact-uris]
created: 2026-03-04
updated: 2026-03-05
---

# Overview

Define the v0.4 minimal structured contract for external orchestrators: run envelope, event record shape, artifact URI conventions, and commit gate policy.

# Acceptance Criteria

- Required run-envelope fields are documented.
- Required event fields are documented and consistent with episodic docs.
- Artifact URI conventions are documented for patch/test/log/commit references.
- Commit gate policy is explicit and aligned to single-writer guidance.
- Contract remains docs-only and transport/runtime agnostic.

# Files Affected

- .mdkg/design/edd-8-v0-4-external-orchestrator-minimal-run-event-artifact-contract.md
- .mdkg/design/edd-3-mdkg-agent-memory-model-deterministic-memory-skills-events.md
- .mdkg/design/edd-6-mdkg-event-logs-and-checkpoints-guide-v0-4-episodic-memory-and-provenance.md

# Implementation Notes

- Keep schema minimal and interoperable across orchestrators.
- Avoid overfitting to one runtime implementation in v0.4 planning.

# Test Plan

Validate contract completeness and consistency (`test-24`).

# Links / Artifacts

- prd-1
- dec-10
- edd-3
- edd-6
- edd-8
- epic-5
