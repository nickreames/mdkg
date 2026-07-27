---
id: task-815
type: task
title: Author a proceed defer or reject Remotion decision
status: backlog
priority: 1
epic: epic-255
prev: test-473
tags: [remotion, presentation, research, decision]
owners: [root-integration-owner]
links: []
artifacts: [artifact://remotion/decision-receipt]
relates: [goal-79]
blocked_by: []
blocks: []
refs: [goal-79, epic-255, spike-35, task-814, test-473, task-519, test-248, ai_native_sdlc_demo:goal-3, dec-92]
context_refs: [goal-79, epic-255, spike-35, task-814, test-473, task-519, test-248, ai_native_sdlc_demo:goal-3, dec-92]
evidence_refs: []
aliases: []
skills: [service-boundary-ownership-check, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-26
---
# Overview

Resolve dec-92 from the accepted comparison, rubric, and feasibility receipt so the optional Remotion lane has a durable proceed, defer, or reject answer.

# Acceptance Criteria

- dec-92 cites spike-35, task-814, and every test-473 result.
- The outcome is exactly proceed, defer, or reject with rationale, confidence, unresolved risks, owner, and review trigger.
- Proceed names one scene that materially benefits from motion and records satisfied offline rendering, captions, static fallback, license, dependency, accessibility, performance, no-secret, and retention boundaries.
- The decision separately selects presentation-only, canonical-site candidate requiring another decision, or no canonical-site usage.
- Defer/reject keeps goal-80 paused and empty; proceed still requires a separate scope-population and activation pass.
- No implementation, package, deck, site, Git publication, or provider work occurs.

# Files Affected

- `.mdkg/design/dec-92-select-whether-to-adopt-remotion-for-offline-presentation-and-mdkg-dev-storytell.md`
- Root mdkg evidence/checkpoint surfaces only.

# Implementation Notes

- Prefer the simplest medium that satisfies the narrative need.
- Do not use sunk-cost or demo novelty as proceed evidence.

# Test Plan

- dec-92 has one unambiguous outcome and independently traceable evidence.
- Goal-80 activation conditions can be evaluated without interpretation.
- Root changed-only and bounded full validation plus `git diff --check` pass.

# Links / Artifacts

- goal-79
- test-473
- dec-92
- goal-80
