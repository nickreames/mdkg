---
id: task-43
type: task
title: plan external orchestrator single writer and commit cadence guidance
status: todo
priority: 1
epic: epic-4
tags: [v0_4, memory-model, orchestration]
owners: []
links: []
artifacts: []
relates: [prd-1, dec-8, dec-9, edd-2, edd-3, edd-6]
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-02-27
updated: 2026-02-27
---

# Overview

Define v0.4 guidance for external orchestrators to update mdkg memory safely using single-writer ownership and batched commits.

# Acceptance Criteria

- Single-writer guidance is explicit and scoped to external orchestrators (human or runtime), not mdkg CLI enforcement.
- Commit cadence guidance is explicit: end-of-run, checkpoint milestone, and optional timer flush for persistent agents.
- Guidance explicitly disallows commit-on-every-tool-call behavior.
- Relationship between event logs, checkpoint summaries, and task status updates is documented.
- Default inclusion of the latest checkpoint (when available), plus policy-driven skill inclusion behavior, are described in retrieval/update flow guidance.

# Files Affected

- .mdkg/design/edd-3-mdkg-agent-memory-model-deterministic-memory-skills-events.md
- .mdkg/design/edd-6-mdkg-event-logs-and-checkpoints-guide-v0-4-episodic-memory-and-provenance.md
- .mdkg/design/prd-1-mdkg-product-spec-v0-4-deterministic-agent-memory-and-skills.md
- .mdkg/design/dec-8-v0-4-doc-integration-source-truth-and-gap-policy.md
- .mdkg/design/dec-9-v0-4-decision-log-design-philosophy-and-key-decisions.md
- README.md

# Implementation Notes

- This is documentation policy work only in this pass.
- Keep command/flag naming for skills/events deferred.
- Preserve source-truth disclaimers for current runtime behavior.

# Test Plan

Future implementation and docs checks should validate orchestrator guidance consistency and non-enforcement in mdkg runtime (`test-14`).

# Links / Artifacts

- prd-1
- dec-8
- dec-9
- edd-2
- edd-3
- edd-6
- epic-4
