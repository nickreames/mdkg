---
id: task-814
type: task
title: Define candidate Remotion scenes and an evaluation rubric
status: backlog
priority: 1
epic: epic-255
prev: spike-35
next: test-473
tags: [remotion, presentation, research, rubric]
owners: [root-integration-owner]
links: []
artifacts: [artifact://remotion/evaluation-rubric]
relates: [goal-79]
blocked_by: []
blocks: []
refs: [goal-79, epic-255, spike-35, task-519, test-248, ai_native_sdlc_demo:goal-3, dec-92]
context_refs: [goal-79, epic-255, spike-35, task-519, test-248, ai_native_sdlc_demo:goal-3, dec-92]
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context, service-boundary-ownership-check]
created: 2026-07-26
updated: 2026-07-26
---
# Overview

Translate spike-35's comparison into named candidate scenes and a reproducible rubric that can support a proceed, defer, or reject decision without producing media.

# Acceptance Criteria

- Candidate scenes include at least the AI coding capability timeline, reusable source versus specialized goal contrast, and Plan -> Work -> Evidence or explicitly explain why a scene is unsuitable for motion.
- Each scene states audience value, information change over time, static alternative, duration, caption requirements, reduced-motion behavior, still fallback, expected asset retention, and presentation-only/canonical-site applicability.
- The rubric scores narrative clarity, material benefit over static, offline determinism, authoring/rehearsal cost, dependency/license risk, captions, accessibility, performance, reproducibility, maintenance, retention, and no-secret safety.
- Weights and proceed/defer/reject thresholds are explicit before test-473 runs; missing evidence cannot receive a passing score.
- A proceed recommendation requires one named scene to materially outperform both static alternatives and pass every non-negotiable boundary.

# Files Affected

- Root mdkg evidence for `artifact://remotion/evaluation-rubric` only.
- No package, lockfile, source, deck, site, generated media, Git publication, or provider path.

# Implementation Notes

- Treat accessibility, license, offline rendering, captions, static fallback, no-secret, and retention as gates rather than compensating score dimensions.
- Keep presentation-only and canonical-site decisions separate.

# Test Plan

- Every candidate has all required fields and a static alternative.
- The same evidence produces the same score and outcome.
- test-473 can evaluate every gate without inventing missing requirements.

# Links / Artifacts

- goal-79
- spike-35
- test-473
- dec-92
