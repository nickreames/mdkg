---
id: task-423
type: task
title: update docs command matrix init assets help snapshots and publish readiness
status: done
priority: 1
epic: epic-111
parent: goal-22
tags: [docs, help, readiness]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-415, task-416, task-417, task-418, task-419, task-420, task-421, task-422]
blocks: [task-424]
refs: []
aliases: [integration-ux-docs-readiness]
skills: []
created: 2026-06-17
updated: 2026-06-17
---
# Overview

Update all public docs and readiness assertions for the new integration UX surfaces.

# Acceptance Criteria

- README, init assets, CLI command matrix, and help snapshots describe new behavior consistently.
- Publish-readiness assertions require the new docs, command surfaces, and smoke scripts.
- Docs avoid product-specific naming and keep runtime integration examples generic.
- Deferred boundaries remain clear: mdkg packages semantic graph memory and handoff context, not raw execution traces.

# Files Affected

- README.md
- assets/init/
- CLI_COMMAND_MATRIX.md
- help snapshots
- scripts/assert-publish-ready.js

# Implementation Notes

- Update docs and generated snapshots in one pass so command behavior and reference text do not drift.
- Keep examples generic and local-first.

# Test Plan

- npm run cli:check
- npm run cli:contract
- node scripts/assert-publish-ready.js

# Links / Artifacts

- task-424
