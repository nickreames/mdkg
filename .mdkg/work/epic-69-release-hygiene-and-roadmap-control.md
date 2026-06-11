---
id: epic-69
type: epic
title: release hygiene and roadmap control
status: done
priority: 1
tags: [release, hygiene, roadmap, 0-3-1]
owners: []
links: []
artifacts: []
relates: [goal-13, goal-10, task-148]
blocked_by: []
blocks: [task-323, test-129, test-130]
refs: []
aliases: []
skills: []
created: 2026-06-09
updated: 2026-06-09
---
# Goal

Make `0.3.1` a small alignment release slice: release bookkeeping, selected
goal state, stale handoff state, and the new hardening roadmap are coherent
before functional CLI work begins.

# Scope

- Date the already-published `0.3.0` changelog entry and restore an
  `Unreleased` section.
- Clear or reselect stale achieved `goal-10`.
- Resolve `task-148` through the broader orchestrator and hardening roadmap.
- Create the umbrella hardening goal and capability epics.

# Milestones

- `0.3.1`: release hygiene and roadmap graph alignment only.

# Out of Scope

- Functional CLI changes.
- npm publish, git tag, or push.

# Risks

- Starting status/doctor/fix work before the roadmap graph is coherent.

# Closeout

Closed 2026-06-09 after the changelog release heading was corrected, the
`goal-13` hardening umbrella and capability epics were created, `task-148` was
closed as superseded by the broader roadmap, and `task-323`, `test-129`, and
`test-130` were completed with checkpoints.

# Links / Artifacts

- related docs
- related tasks
- external links
