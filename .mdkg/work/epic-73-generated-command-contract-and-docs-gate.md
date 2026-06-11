---
id: epic-73
type: epic
title: generated command contract and docs gate
status: done
priority: 1
tags: [cli-spec, docs, command-contract, 0-3-8, 0-3-9]
owners: []
links: []
artifacts: []
relates: [goal-13]
blocked_by: []
blocks: [task-328, task-345, task-346, test-131, test-141]
refs: []
aliases: []
skills: []
created: 2026-06-09
updated: 2026-06-09
---
# Goal

Make command documentation generated from the shipped CLI contract before
`mdkg.dev` publishes public command reference pages.

# Scope

- Generate an mdkg-native command contract or command matrix JSON.
- Optionally project to OpenCLI-compatible output later.
- Add docs-readiness smoke coverage for examples and command drift.

# Milestones

- `0.3.8`: generated mdkg CLI command contract.
- `0.3.9`: docs-readiness and generated reference checks.

# Out of Scope

- Hand-written public command docs as the source of truth.

# Risks

- mdkg.dev drifting from actual CLI behavior.

# Links / Artifacts

- `goal-13`
- `edd-22`
- `task-328`
- `task-345`
- `task-346`
- `test-131`
- `test-141`
- `scripts/generate-command-contract.js`
- `scripts/smoke-command-docs.js`
- `dist/command-contract.json`

# Closeout

Completed the generated command contract and docs-readiness gate. The package
now builds a deterministic mdkg-native command contract, validates drift through
`cli:contract`, ships `dist/command-contract.json`, and proves generated command
docs in a packed temp-repo smoke before prepublish can pass.
