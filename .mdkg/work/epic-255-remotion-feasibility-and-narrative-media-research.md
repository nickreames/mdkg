---
id: epic-255
type: epic
title: Remotion feasibility and narrative-media research
status: backlog
priority: 3
tags: [remotion, presentation, mdkg-dev, research]
owners: [root-integration-owner]
links: []
artifacts: [artifact://remotion/options-comparison, artifact://remotion/evaluation-rubric, artifact://remotion/feasibility-receipt]
relates: [goal-79]
blocked_by: []
blocks: []
refs: [goal-79, task-519, test-248, ai_native_sdlc_demo:goal-3, dec-92]
context_refs: [goal-79, task-519, test-248, ai_native_sdlc_demo:goal-3, dec-92]
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context, service-boundary-ownership-check, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-26
---
# Goal

Deliver a decision-ready, evidence-backed comparison of PowerPoint/static assets, HTML/CSS motion, and offline Remotion rendering without installing or implementing Remotion.

# Scope

- Current repository and presentation constraints.
- Candidate narrative scenes and evaluation rubric.
- Dependency, license, offline rendering, captions, still fallback, accessibility, performance, retention, and no-secret evaluation.
- Proceed, defer, or reject decision with presentation-only versus canonical-site consequences.

# Milestones

- spike-35 comparison
- task-814 candidate scenes and rubric
- test-473 boundary verification
- task-815 resolution of dec-92

# Out of Scope

Package installation, rendering implementation, deck/site source edits, canonical publication, and provider mutation.

# Risks

- Motion may add novelty without material narrative value.
- Dependency/license/rendering cost may exceed a static alternative.
- Canonical-site motion may violate static, performance, reduced-motion, or zero-client-JavaScript expectations.

# Links / Artifacts

- task-519
- test-248
- ai_native_sdlc_demo:goal-3
- dec-92
