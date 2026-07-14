---
id: test-442
type: test
title: Archive receipts help docs and imported discovery preserve command contracts
status: done
priority: 1
epic: epic-249
tags: [archive, json, help, docs, discovery]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-779, task-780, task-781]
blocks: []
refs: [goal-70, task-779, task-780]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-07-14
updated: 2026-07-14
---
# Overview

Keep the user/agent command surface transparent and backward compatible.

# Target / Scope

JSON/text receipts, help, command matrix, generated contract, public docs,
list/show/search/capability discovery, and Unreleased changelog.

# Preconditions / Environment

Use deterministic fixture output and canonical generation/check commands.

# Test Cases

- Existing JSON fields are unchanged and additive selection fields match schema.
- Human output states mutation/exclusion boundaries.
- Help/docs show exact accepted syntax and errors.
- Imported archives remain discoverable through all read surfaces.

# Results / Evidence

Passed: CLI snapshot and typed command-contract checks are clean, 463 public
documentation command examples have zero failures, JSON/text receipts expose
the mutation boundary, and imported archives remain available through
list/show and merged-index discovery.

# Notes / Follow-ups

- Any undocumented output or syntax drift blocks closeout.
