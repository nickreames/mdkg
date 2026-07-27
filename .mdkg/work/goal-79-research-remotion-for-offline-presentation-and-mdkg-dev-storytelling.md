---
id: goal-79
type: goal
title: Research Remotion for offline presentation and mdkg.dev storytelling
status: backlog
priority: 3
goal_state: paused
goal_condition: Remotion feasibility research is complete when spike-35, task-814, test-473, and task-815 are done with source-backed evidence, dec-92 records an accepted proceed, defer, or reject outcome plus presentation-only versus canonical-site boundaries, and no dependency installation, Remotion code, deck, site, publication, or provider mutation occurs.
scope_refs: [epic-255]
required_skills: [select-work-and-ground-context, service-boundary-ownership-check, verify-close-and-checkpoint]
required_checks: [mdkg goal show goal-79 --json, mdkg goal next goal-79 --json, mdkg pack spike-35 --pack-profile concise --dry-run --stats, mdkg validate --changed-only --json, mdkg validate --summary --json --limit 20, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [remotion, presentation, mdkg-dev, research, offline]
owners: [root-integration-owner]
links: []
artifacts: [artifact://remotion/options-comparison, artifact://remotion/evaluation-rubric, artifact://remotion/feasibility-receipt]
relates: []
blocked_by: []
blocks: []
refs: [task-519, test-248, ai_native_sdlc_demo:goal-3, dec-92]
context_refs: [task-519, test-248, ai_native_sdlc_demo:goal-3, dec-92]
evidence_refs: []
aliases: [remotion-offline-storytelling-research]
skills: [select-work-and-ground-context, service-boundary-ownership-check, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-26
---
# Objective

Determine whether offline Remotion rendering materially improves the AI-native SDLC presentation or mdkg.dev storytelling enough to justify its dependency, rendering, accessibility, performance, and retention costs.

# End Condition

The four-node research chain is complete, every test-473 case has public-safe evidence, and dec-92 is accepted with a proceed, defer, or reject outcome. A proceed outcome also distinguishes presentation-only from canonical-site use and identifies the exact scene that warrants motion.

# Activation Conditions

Activate only after the presentation program projection is current and a root research writer lease is granted. This goal is optional and must not delay Goals 2–7 in `ai_native_sdlc_demo`.

# Non-Goals

- No Remotion or media dependency installation.
- No source code, package, lockfile, deck, canonical site, run graph, deployment, Git publication, or provider mutation.
- No assumption that motion belongs on mdkg.dev.
- No implementation scope creation inside goal-80.

# Recursive Algorithm

1. Re-read task-519, test-248, the read-only presentation goal, dec-92, and the active writer lease.
2. Compare PowerPoint/static assets, HTML/CSS motion, and offline Remotion rendering in spike-35.
3. Define candidate scenes and the evaluation rubric in task-814.
4. Evaluate every dependency, license, rendering, caption, fallback, accessibility, performance, retention, and no-secret case in test-473.
5. Resolve dec-92 through task-815, validate, and close only with durable evidence.

# Required Skills

- select-work-and-ground-context
- service-boundary-ownership-check
- verify-close-and-checkpoint

# Required Checks

- `mdkg goal show goal-79 --json`
- `mdkg goal next goal-79 --json`
- `mdkg pack spike-35 --pack-profile concise --dry-run --stats`
- `mdkg validate --changed-only --json`
- `mdkg validate --summary --json --limit 20`
- `git diff --check`

# Acceptance Criteria

- The comparison uses current primary package/license/rendering documentation and current repository constraints.
- Candidate scenes identify the audience value that motion adds and a static alternative for each.
- The rubric covers narrative value, offline determinism, setup cost, license, captions, reduced motion, still fallback, accessibility, performance, reproducibility, asset retention, secrets, and maintenance.
- dec-92 records proceed, defer, or reject and a separate canonical-site-use decision.
- A proceed outcome names one scene that materially benefits from motion and proves all activation gates for goal-80.
- No implementation or publication work occurs.

# Definition Of Done

- All scoped nodes are done in the declared chain.
- dec-92 is accepted with evidence and consequences.
- Required checks and an accepted research checkpoint are recorded.
- goal-80 remains paused with empty scope unless a separate population/activation pass is authorized.

# Stop Conditions

- Current package/license documentation cannot be verified.
- Research requires an install, code change, media render, or provider mutation.
- Presentation scope or source boundaries drift before the decision.
- Another root writer owns an overlapping surface.

# Current State

Fully scoped and paused. First actionable node is spike-35. This goal is non-blocking for the presentation, rehearsal, and event.

# Iteration Log

- 2026-07-26: Created as a paused research placeholder during the isolated presentation-program authoring pass.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- Pending.
