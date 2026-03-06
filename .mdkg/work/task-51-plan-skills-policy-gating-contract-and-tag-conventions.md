---
id: task-51
type: task
title: plan skills policy gating contract and tag conventions
status: done
priority: 1
epic: epic-5
tags: [v0_4, skills, policy, stage_gating]
owners: []
links: []
artifacts: []
relates: [prd-1, dec-10, edd-3, edd-5, edd-7, edd-8, epic-5]
blocked_by: []
blocks: []
refs: []
aliases: [stage:plan, policy-gating]
created: 2026-03-04
updated: 2026-03-05
---

# Overview

Define v0.4 policy-level skill gating semantics so orchestrators can restrict skill access by stage and risk tags.

# Acceptance Criteria

- Hybrid gating model is explicit: query-time filtering plus policy-time gating.
- Tag conventions for stage/risk classes are documented and portable.
- Policy-level enforcement responsibilities are scoped to external orchestrators.
- No global stage allowlist validation is introduced in v0.4 docs.
- Guidance is compatible with flattened metadata policy.

# Files Affected

- .mdkg/design/edd-3-mdkg-agent-memory-model-deterministic-memory-skills-events.md
- .mdkg/design/edd-5-mdkg-skills-integration-guide-v0-4-agent-skills-standard-and-packs.md
- .mdkg/design/edd-7-v0-4-agent-skills-standards-alignment-and-research-snapshot.md
- .mdkg/design/edd-8-v0-4-external-orchestrator-minimal-run-event-artifact-contract.md

# Implementation Notes

- Keep policy gating declarative and runtime-agnostic in this pass.
- Avoid command namespace expansion in v0.4 docs.

# Test Plan

Validate stage-policy contracts and query alignment (`test-20`).

# Links / Artifacts

- prd-1
- dec-10
- edd-3
- edd-5
- edd-7
- edd-8
- epic-5
