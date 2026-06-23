---
id: task-1
type: task
title: Build inspectable demo app and evidence flow
status: todo
priority: 1
epic: epic-1
parent: goal-1
tags: [demo, implementation, evidence]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [spike-1]
blocks: []
refs: []
context_refs: [goal-1, spike-1, edd-3, dec-1]
evidence_refs: [chk-1]
aliases: []
skills: []
created: 2026-06-22
updated: 2026-06-22
---
# Overview

Build the smallest inspectable local artifact that demonstrates an agent using mdkg context to do scoped work and close with evidence.

# Acceptance Criteria

- Artifact is local-only and public-inspectable.
- Artifact visibly connects goal context, implementation action, validation, and checkpoint closeout.
- No deployment, credentials, raw prompt transcript, or parent private context is required.
- `test-1` can validate the artifact and agent-start path.

# Files Affected

List files/directories expected to change.

- `DEMO_BRIEF.md`
- implementation files selected by the spike
- `.mdkg/work/chk-*` closeout evidence

# Implementation Notes

- Prefer boring static files over runtime services.
- Keep the demo short enough to explain during a live presentation.
- If the demo needs additional nodes, create them with mdkg and record why.

# Test Plan

- Run `mdkg validate --json`.
- Run `mdkg pack goal-1 --profile concise`.
- Execute the artifact-specific local check chosen by the spike.
- Record pass/fail evidence in a checkpoint.

# Links / Artifacts

- goal-1
- spike-1
- test-1
