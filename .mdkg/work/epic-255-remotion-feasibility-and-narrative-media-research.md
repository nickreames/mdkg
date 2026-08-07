---
id: epic-255
type: epic
title: Remotion feasibility and narrative-media research
status: done
priority: 3
tags: [remotion, presentation, mdkg-dev, research]
owners: [root-integration-owner]
links: []
artifacts: [artifact://remotion/options-comparison, artifact://remotion/evaluation-rubric, artifact://remotion/feasibility-receipt, artifact://remotion/decision-receipt, .mdkg/artifacts/goal-79/remotion/options-comparison.md, .mdkg/artifacts/goal-79/remotion/evaluation-rubric.md, .mdkg/artifacts/goal-79/remotion/feasibility-receipt.md, .mdkg/artifacts/goal-79/remotion/decision-receipt.md]
relates: [goal-79]
blocked_by: []
blocks: []
refs: [goal-79, task-519, test-248, ai_native_sdlc_demo:goal-3, dec-92]
context_refs: [goal-79, task-519, test-248, ai_native_sdlc_demo:goal-3, dec-92]
evidence_refs: [spike-35, task-814, test-473, task-815, chk-561, chk-562]
aliases: []
skills: [select-work-and-ground-context, service-boundary-ownership-check, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-27
---
# Goal

Deliver a decision-ready, evidence-backed comparison of PowerPoint/static assets, HTML/CSS motion, and offline Remotion rendering without installing or implementing Remotion.

# Scope

- Current repository and presentation constraints.
- Candidate narrative scenes and evaluation rubric.
- Dependency, license, offline rendering, captions, still fallback, accessibility, performance, retention, and no-secret evaluation.
- Proceed, defer, or reject decision with presentation-only versus canonical-site consequences.

# Milestones

- spike-35 comparison: done
- task-814 candidate scenes and rubric: done
- test-473 boundary verification: done
- task-815 resolution of dec-92: done

# Outcome

Research supports **defer**, not proceed or reject. Remotion is technically
plausible for a future isolated presentation-only source-to-specialized scene,
but ten of twelve proceed gates fail, the current readiness score is 32.0/100,
and no legal, render, playback, performance, accessibility, reproducibility, or
human A/B proof supports adoption.

The accepted static deck and retained still remain the presentation path.
Canonical mdkg.dev receives no Remotion dependency/runtime/asset. Goal 80
remains paused with empty scope. No install, render, functional change,
publication, or provider action occurred.

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
- `.mdkg/artifacts/goal-79/remotion/options-comparison.md`
- `.mdkg/artifacts/goal-79/remotion/evaluation-rubric.md`
- `.mdkg/artifacts/goal-79/remotion/feasibility-receipt.md`
- `.mdkg/artifacts/goal-79/remotion/decision-receipt.md`
