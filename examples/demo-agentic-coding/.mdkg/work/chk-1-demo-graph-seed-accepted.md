---
id: chk-1
type: checkpoint
title: Demo graph seed accepted
status: backlog
priority: 9
tags: [demo, checkpoint, seed]
owners: []
links: []
artifacts: []
relates: [goal-1]
blocked_by: []
blocks: []
refs: []
context_refs: [goal-1, epic-1, spike-1, task-1, test-1, edd-3, dec-1]
evidence_refs: []
aliases: []
skills: []
scope: []
created: 2026-06-22
updated: 2026-06-22
---
# Summary

The demo-agentic-coding example graph has been seeded with an umbrella goal, epic, spike, implementation task, validation test, design record, deployment-boundary decision, and public-safe brief files.

# Scope Covered

- goal-1
- epic-1
- spike-1
- task-1
- test-1

# Decisions Captured

- dec-1 keeps the demo local-only until explicit promotion.
- edd-3 defines the goal-only agent-start information architecture.

# Implementation Summary

The graph is intentionally small and public-inspectable. An agent can begin with `goal-1`, run `mdkg pack goal-1 --profile concise`, and discover the research, task, test, and boundary records without private parent context.

# Verification / Testing

Validation is performed by the parent goal and future smoke automation. The required local proof is `mdkg validate --json`, `mdkg goal next goal-1 --json`, and `mdkg pack goal-1 --profile concise`.

# Known Issues / Follow-ups

- Future implementation should build the local artifact.
- Future rehearsal can decide whether this graph deserves preview promotion.

# Links / Artifacts

- README.md
- DEMO_BRIEF.md
- dec-1
- edd-3
