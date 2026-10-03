---
id: chk-681
type: checkpoint
title: Cloud three-goal planning audit and draft PR evidence
status: review
priority: 1
tags: [cloud-planning, design-only]
owners: []
links: []
artifacts: [docs/cloud-planning-experiment.md, .mdkg/artifacts/cloud-planning/checks.json]
relates: []
blocked_by: []
blocks: []
refs: [test-494, test-495, test-496]
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [edd-83, goal-88, goal-89, goal-90, task-856]
created: 2026-10-02
updated: 2026-10-02
checkpoint_kind: review
---

# Summary

Cloud-only design proposal from verified remote main d9b74c3fa172688a99406fd908571c7e3f666395. Exactly three new
goals: goal-88 / goal-89 / goal-90, sequential provisional 0.6.1/0.6.2/0.6.3.
No source implementation, package bump, graph migration or feature-test passes.

# Scope Covered

edd-83, three paused goals, their bounded tasks/tests/future checkpoints,
and deferred task-856. Existing goal-41/81/82 records are reused unchanged.

# Decisions Captured

AGENTS-only generated root instructions with both native skill mirrors retained;
persistent working storage distinct from canonical nodes with explicit GC and
honest cloud durability; independent selected sibling graphs without federation.
Names/grammar/compatibility/retention choices require later design review.

# Verification / Testing

Actual docs-only evidence and setup/retries appear in
docs/cloud-planning-experiment.md and .mdkg/artifacts/cloud-planning/checks.json.
Future tests test-494/test-495/test-496
are NOT_RUN. Read the executed check receipt before any closeout claim.

# Known Issues / Follow-ups

Nick reviews/merges this draft before implementation. Local unpublished Mac
changes were not accessed; numeric branch aliases need review on integration.
The git-gud exception applies only here. Fast CI is not complete hosted Linux
portable qualification; goal-87 and epic-257 gaps remain. No release/adoption.

# Implementation Summary

No feature implementation or future acceptance was performed by this planning PR.

# Links / Artifacts

edd-83; docs/cloud-planning-experiment.md. Future artifact references must be added after they exist.
