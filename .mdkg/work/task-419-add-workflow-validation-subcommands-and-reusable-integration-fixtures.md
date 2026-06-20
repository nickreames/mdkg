---
id: task-419
type: task
title: add workflow validation subcommands and reusable integration fixtures
status: done
priority: 1
epic: epic-108
parent: goal-22
tags: [spec, work, receipt, validation]
owners: []
links: []
artifacts: []
relates: [goal-8, goal-9]
blocked_by: [task-414]
blocks: [test-185, task-423]
refs: []
aliases: [workflow-validation-subcommands]
skills: []
created: 2026-06-17
updated: 2026-06-17
---
# Overview

Strengthen generic workflow-file validation so integration repos can rely on mdkg instead of adapter-specific checks.

# Acceptance Criteria

- Add or improve focused validation for SPEC, WORK, WORK_ORDER, and RECEIPT-style files.
- Provide generic coordinator, worker, capability, order, and receipt fixtures/templates.
- Diagnostics are typed, machine-readable, and avoid product-specific naming.
- Obvious raw secret, token, prompt, and payload markers produce warnings.

# Files Affected

- Workflow commands and validators.
- Templates and fixtures.
- CLI command matrix and help snapshots.

# Implementation Notes

- Keep fixtures generic and free of product-specific naming.
- Validation should prefer typed diagnostics over prose-only output.

# Test Plan

- Unit tests for valid and invalid fixtures.
- npm run smoke:work-invocation
- test-185

# Links / Artifacts

- test-185
