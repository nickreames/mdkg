---
id: test-185
type: test
title: workflow validation fixture and raw-marker warning contract
status: done
priority: 1
epic: epic-108
parent: goal-22
tags: [workflow, validation, safety]
owners: []
links: []
artifacts: []
relates: [task-419]
blocked_by: [task-419]
blocks: []
refs: []
aliases: [workflow-validation-contract]
skills: []
cases: []
created: 2026-06-17
updated: 2026-06-17
---
# Overview

Validate generic workflow-file fixtures and raw marker diagnostics.

# Target / Scope

- SPEC validation.
- WORK validation.
- WORK_ORDER validation.
- RECEIPT verification.
- Raw-content warning scanner.

# Preconditions / Environment

- Temp repo with valid and invalid generic workflow fixtures.

# Test Cases

- Valid coordinator, worker, capability, order, and receipt fixtures pass.
- Missing refs and invalid lifecycle states are reported with typed diagnostics.
- Secret-like, prompt-like, token-like, and payload-like markers produce warnings.
- No product-specific naming appears in shipped fixtures.

# Results / Evidence

- Pending.

# Notes / Follow-ups

- Pair with `npm run smoke:work-invocation`.
