---
id: epic-113
type: epic
title: 0.3.8 release metadata and roadmap alignment
status: todo
priority: 1
tags: [release, 0.3.8, metadata, roadmap]
owners: []
links: []
artifacts: []
relates: [goal-23]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-21
updated: 2026-06-21
---
# Goal

Align release metadata and roadmap labels so the source tree accurately describes the current published baseline and the new 0.3.8 work lane.

# Scope

- Correct stale source-version references in public docs.
- Add `0.3.8 - Unreleased` changelog notes.
- Retarget stale future-goal labels that still describe `0.3.7` after that version shipped.
- Prove `goal-23` is the single active root goal and routes to the alignment node first.

# Milestones

- `goal-23` active with scoped epics, tasks, tests, and spike.
- `goal-20` retargeted to the next live-demo milestone.
- Release metadata passes validation and `git diff --check`.

# Out of Scope

- No source package version bump to `0.3.8` until the release candidate pass.
- No real npm publish, tag, push, or global install.

# Risks

- Stale version strings can mislead release agents if not corrected.
- Retargeting a paused future goal must preserve its original live-demo intent.

# Links / Artifacts

- goal-23
- task-427
- task-428
- test-190
