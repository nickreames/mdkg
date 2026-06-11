---
id: epic-78
type: epic
title: generated command docs and reference pipeline
status: todo
priority: 2
tags: [mdkg-dev, command-docs, generated-reference]
owners: []
links: []
artifacts: []
relates: [task-355, test-147]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
created: 2026-06-11
updated: 2026-06-11
---
# Goal

Generate public command reference docs from mdkg-native command contracts so
mdkg.dev docs stay aligned with the CLI.

# Scope

- command contract as source metadata
- generated command reference
- docs drift checks
- public reference IA integration

# Milestones

- `task-354` defines IA.
- `task-355` implements the reference gate.
- `test-147` proves drift detection.

# Out of Scope

- Hand-maintained public command reference as source of truth.
- Website implementation before launch readiness.

# Risks

- Docs drift if generated metadata is not canonical.
- Public docs become too command-centric without outcome guides.

# Links / Artifacts

- `goal-15`
- `task-355`
- `test-147`
