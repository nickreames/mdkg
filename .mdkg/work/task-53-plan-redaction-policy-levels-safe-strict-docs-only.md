---
id: task-53
type: task
title: plan redaction policy levels safe strict docs only
status: done
priority: 1
epic: epic-5
tags: [v0_4, events, security, redaction]
owners: []
links: []
artifacts: []
relates: [prd-1, dec-10, edd-6, edd-8, epic-5]
blocked_by: []
blocks: []
refs: []
aliases: [redaction-policy, safe-strict]
created: 2026-03-04
updated: 2026-03-05
---

# Overview

Define 0.0.4 documentation-level redaction policy model for event logging and provenance artifacts.

# Acceptance Criteria

- Policy levels are documented: `safe` (default guidance) and `strict`.
- Boundaries between policy docs and runtime enforcement are explicit.
- Guidance favors artifact references over raw content dumps.
- Sensitive data handling expectations are documented for checkpoints and events.
- No runtime redaction implementation is introduced in this pass.

# Files Affected

- .mdkg/design/edd-6-mdkg-event-logs-and-checkpoints-guide-v0-4-episodic-memory-and-provenance.md
- .mdkg/design/edd-8-v0-4-external-orchestrator-minimal-run-event-artifact-contract.md
- README.md

# Implementation Notes

- Keep policy language conservative and deterministic.
- Capture unknown implementation choices explicitly for later runtime design.

# Test Plan

Validate safe/strict policy contract wording and docs-only boundary (`test-23`).

# Links / Artifacts

- prd-1
- dec-10
- edd-6
- edd-8
- epic-5
