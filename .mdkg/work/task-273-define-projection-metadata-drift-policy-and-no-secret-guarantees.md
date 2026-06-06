---
id: task-273
type: task
title: define projection metadata drift policy and no secret guarantees
status: todo
priority: 1
epic: epic-49
parent: goal-8
tags: [projection, drift, secrets, security]
owners: []
links: []
artifacts: []
relates: [goal-8, epic-49, test-103]
blocked_by: [task-267]
blocks: [task-276]
refs: [edd-14, dec-21, dec-22]
aliases: [projection-drift-policy]
skills: [author-mdkg-skill]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Define how SPEC source maps to projection surfaces and how drift is detected.

# Acceptance Criteria

- Projection metadata links generated or manual projection files back to source
  SPECs.
- Manual edits are detectable and never silently overwritten.
- No secrets, credentials, local auth, provider config, or production controls
  are exported.
- Projection-only durable behavior creates repair work.

# Test Plan

- `mdkg capability search "projection drift policy" --json`

# Files Affected

- mdkg planning nodes only.

# Implementation Notes

- Keep exporter implementation deferred.

# Links / Artifacts

- `goal-8`
- `epic-49`
