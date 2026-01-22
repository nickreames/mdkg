---
id: task-8
type: task
title: add guide command tests and onboarding coverage
status: done
priority: 2
epic: epic-1
tags: [onboarding, tests]
owners: []
links: []
artifacts: [guide-tests]
relates: []
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-01-21
updated: 2026-01-21
---
# Overview

Add tests covering `mdkg guide` and the onboarding flow.

# Acceptance Criteria

- Guide command tests exist.
- Tests pass.

# Files Affected

- tests/commands/guide.test.ts
- tests/commands/new.test.ts

# Implementation Notes

- Added guide tests and a test-node creation test.

# Test Plan

- `npm run test`

# Links / Artifacts

- guide-tests
