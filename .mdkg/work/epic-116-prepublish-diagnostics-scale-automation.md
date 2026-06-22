---
id: epic-116
type: epic
title: prepublish diagnostics-scale automation
status: todo
priority: 1
tags: [prepublish, smoke, diagnostics, automation]
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

Add a CI-style prepublish gate that prevents warning-heavy output regressions from shipping.

# Scope

- `scripts/smoke-warning-ux.js`.
- `npm run smoke:warning-ux`.
- `prepublishOnly` wiring.
- Publish-readiness assertions for the smoke, docs, and command matrix.

# Milestones

- Packed temp repo smoke creates 1000+ warning-producing nodes.
- Smoke proves bounded summary output and clean JSON receipt files.
- Full prepublish dry-run evidence is recorded.

# Out of Scope

- No real publish in this goal.
- No broad performance benchmarking beyond warning-scale regression coverage.

# Risks

- Smoke runtime must stay reasonable despite large fixtures.
- The smoke must use public CLI behavior, not private helper shortcuts.

# Links / Artifacts

- task-434
- task-435
- task-436
- test-195
