---
id: task-424
type: task
title: add packed temp-repo integration UX smoke and prepublish gate
status: done
priority: 1
epic: epic-112
parent: goal-22
tags: [smoke, e2e, prepublish]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-423]
blocks: [test-189, task-425, task-426]
refs: []
aliases: [integration-ux-smoke]
skills: []
created: 2026-06-17
updated: 2026-06-17
---
# Overview

Add packed temp-repo proof for semantic refs, checkpoint templates, workflow validation, queue contract docs, and handoff creation.

# Acceptance Criteria

- New smokes pack/install mdkg into a temp prefix and use only the installed CLI.
- Temp repo creates an implementation goal, context/evidence refs, checkpoint kinds, workflow fixtures, queue contract proof, and handoff output.
- Smokes run in `prepublishOnly` before pack/publish dry-runs.
- E2E verifies no raw marker leakage in generated handoff output.

# Files Affected

- scripts/smoke-semantic-refs.js
- scripts/smoke-checkpoint-templates.js
- scripts/smoke-handoff.js
- scripts/smoke-integration-ux.js
- package.json
- scripts/assert-publish-ready.js

# Implementation Notes

- Smokes must use packed installed CLI behavior, not direct source imports.
- Keep temp paths and command receipts in closeout evidence.

# Test Plan

- npm run smoke:semantic-refs
- npm run smoke:checkpoint-templates
- npm run smoke:handoff
- npm run smoke:integration-ux
- test-189

# Links / Artifacts

- test-189
