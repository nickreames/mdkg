---
id: task-814
type: task
title: Define candidate Remotion scenes and an evaluation rubric
status: done
priority: 1
epic: epic-255
prev: spike-35
next: test-473
tags: [remotion, presentation, research, rubric]
owners: [root-integration-owner]
links: []
artifacts: [artifact://remotion/evaluation-rubric, .mdkg/artifacts/goal-79/remotion/evaluation-rubric.md]
relates: [goal-79]
blocked_by: [spike-35]
blocks: [test-473]
refs: [goal-79, epic-255, spike-35, task-519, test-248, ai_native_sdlc_demo:goal-3, dec-92]
context_refs: [goal-79, epic-255, spike-35, task-519, test-248, ai_native_sdlc_demo:goal-3, dec-92]
evidence_refs: [spike-35, chk-561]
aliases: []
skills: [select-work-and-ground-context, service-boundary-ownership-check]
created: 2026-07-26
updated: 2026-07-27
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

# Completed Rubric

The accepted rubric is
`.mdkg/artifacts/goal-79/remotion/evaluation-rubric.md`.

It defines three complete candidates:

1. reusable source -> specialized goal -> accepted evidence, 12–16 seconds;
2. Plan -> Work -> Evidence, 8–12 seconds; and
3. AI coding capability accumulation, 18–24 seconds.

Each binds the narrative job, audience value, change over time, captions and
transcript, reduced-motion behavior, still fallback, retention set,
presentation/canonical-site boundary, and false-inference risk. The live reveal
is explicitly excluded because authored motion could be mistaken for current
execution evidence.

The rubric freezes 12 non-compensable gates, a 100-point weighted score, and
candidate-specific pilot budgets before test-473. `Proceed` requires every
gate, at least 80/100, at least a 10-point advantage over both alternatives, and
human A/B evidence. Missing evidence scores zero. `Defer` applies when a bounded
pilot can resolve missing gates; `reject` applies to hard incompatibility or a
fully evidenced failure.

Current evidence-backed R1 scores are PowerPoint/static 73.4, HTML/CSS 53.2,
and Remotion 32.0. These are readiness scores, not quality forecasts. Remotion's
material-benefit, license, performance, and target-environment evidence is
currently absent, so the rubric cannot support proceed.

# Test Plan

- Every candidate has all required fields and a static alternative.
- The same evidence produces the same score and outcome.
- test-473 can evaluate every gate without inventing missing requirements.
- Manual arithmetic check: weights sum to 100; the recorded current scores
  reproduce to 73.4, 53.2, and 32.0.

# Links / Artifacts

- goal-79
- spike-35
- test-473
- dec-92
- `.mdkg/artifacts/goal-79/remotion/evaluation-rubric.md`
