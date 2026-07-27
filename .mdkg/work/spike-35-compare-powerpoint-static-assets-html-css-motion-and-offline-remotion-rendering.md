---
id: spike-35
type: spike
title: Compare PowerPoint/static assets, HTML/CSS motion, and offline Remotion rendering
status: backlog
priority: 1
epic: epic-255
next: task-814
tags: [remotion, presentation, research, offline]
owners: [root-integration-owner]
links: []
artifacts: [artifact://remotion/options-comparison]
relates: [goal-79]
blocked_by: []
blocks: []
refs: [goal-79, epic-255, task-519, test-248, ai_native_sdlc_demo:goal-3, dec-92]
context_refs: [goal-79, epic-255, task-519, test-248, ai_native_sdlc_demo:goal-3, dec-92]
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context, service-boundary-ownership-check]
created: 2026-07-26
updated: 2026-07-26
---
# Research Question

Which medium—PowerPoint/static assets, HTML/CSS motion, or offline Remotion rendering—best communicates the AI coding evolution and Plan -> Work -> Evidence story under the presentation's offline, accessibility, timing, and maintenance constraints?

# Context And Constraints

- Research-only; no installation, code, render, deck, or site changes.
- Primary/current package, license, and rendering documentation is required for external claims.
- The presentation path must work offline with captions, reduced motion, and still fallbacks.
- Canonical-site use is a separate decision and may not introduce runtime scripts by implication.

# Search Plan

- Re-read task-519, test-248, dec-92, and the read-only presentation goal projection.
- Compare narrative value, authoring cost, reproducibility, offline behavior, accessibility, performance, dependency/license boundaries, maintenance, and retention.
- Identify which scenes materially benefit from motion and which are better as static deck assets.

# Findings

Pending activation.

# Options And Tradeoffs

- PowerPoint/static assets: lowest dependency and strongest presenter control; limited procedural motion.
- HTML/CSS motion: lightweight web-native storytelling; separate offline capture and zero-JavaScript constraints require care.
- Offline Remotion: deterministic frame/video composition and reuse; adds dependency, render, caption, asset, and maintenance costs.

# Recommendation

Pending evidence. Recommend proceed only if a named scene scores materially higher than static alternatives and every goal-80 activation boundary is supportable.

# Follow-Up Nodes To Create

- None. The complete planned chain already exists.

# Skill Candidates

- None unless research exposes a repeatable offline-media workflow.

# Data Structures And Algorithms Notes

- Record inputs, weights, assumptions, and evidence independently so task-814 can define a reproducible rubric.

# UX Notes

- Prefer motion only where sequence or state change is materially clearer than a static slide.

# Security Notes

- No secrets, private prompts, provider payloads, remote tracking, or unreviewed third-party assets in evidence.

# mdkg.dev Launch Implications

- Canonical-site usage remains unapproved unless dec-92 explicitly selects it and preserves site performance/accessibility/static constraints.

# Evidence And Sources

Pending activation. Record source URL/title, publication/access date, supported claim, approved paraphrase, and confidence.
