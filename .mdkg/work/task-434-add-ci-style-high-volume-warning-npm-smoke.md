---
id: task-434
type: task
title: add CI-style high-volume warning npm smoke
status: done
priority: 1
epic: epic-116
parent: goal-23
tags: [smoke, prepublish, warnings]
owners: []
links: []
artifacts: []
relates: []
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
# Overview

Add an npm smoke that recreates warning-heavy repo behavior before publish so future releases catch output-volume regressions.

# Acceptance Criteria

- `scripts/smoke-warning-ux.js` creates a temp repo with 1000+ warning-producing nodes.
- The smoke uses the built or packed CLI consistently with existing smoke conventions.
- The smoke asserts bounded summary output, clean `--json-out`, heading formatter summary output, changed-only validation, and normal graph validation.
- `npm run smoke:warning-ux` is added to `package.json` and `prepublishOnly`.

# Files Affected

- scripts/smoke-warning-ux.js
- package.json

# Implementation Notes

- Keep smoke runtime reasonable.
- Do not depend on network or registry access.

# Test Plan

- `npm run smoke:warning-ux`
- `npm run prepublishOnly`

# Links / Artifacts

- test-195
