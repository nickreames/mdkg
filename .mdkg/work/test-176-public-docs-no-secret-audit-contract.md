---
id: test-176
type: test
title: public docs no secret audit contract
status: todo
priority: 2
epic: epic-103
parent: goal-21
tags: [0.4.0, security]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-407, task-408]
blocks: []
refs: []
aliases: []
skills: []
cases: [Docs contain no raw secrets or private tokens., Local absolute paths are redacted or example-only.]
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Validate public docs no secret audit contract.

# Target / Scope

- task-407
- task-408

# Preconditions / Environment

- Use a fresh temp repo or deterministic fixture where mutation behavior is under test.
- Run through the public CLI surface unless the test explicitly targets an internal helper.

# Test Cases

- Docs contain no raw secrets or private tokens.
- Local absolute paths are redacted or example-only.

# Expected Evidence

- No-secret scan output.

# Notes / Follow-ups

- Record command output, receipts, and linked checkpoints when implemented.
