---
id: test-330
type: test
title: validate contract profile fields and redaction warnings before release
status: todo
priority: 1
tags: [goal-48, validation, profiles]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-48]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-07-02
updated: 2026-07-02
---
# Overview

Validate the eventual contract-profile field and warning plan before any
generic mdkg release claims support for Omni Room contract profiles.

# Target / Scope

- `task-632`
- `task-636`
- MANIFEST, WORK, WORK_ORDER, and RECEIPT fixtures for accepted profile fields.

# Preconditions / Environment

- `task-633` inventory is complete.
- `task-632` has accepted or rejected candidate names for `contract_profile`,
  `receipt_kind`, `redaction_class`, and related aliases.

# Test Cases

- Valid generic profile fields pass focused workflow validation.
- Unknown profile values produce the planned warning or error severity.
- RECEIPT redaction behavior distinguishes current `redaction_policy` from any
  accepted `redaction_class` behavior.
- Raw-content markers still warn and recommend refs, hashes, summaries, or
  artifact links.
- Runtime-only fields fail or warn according to the accepted profile plan.

# Results / Evidence

Pending. This test is intentionally todo with the seeded planning goal.

# Notes / Follow-ups

- Do not add fixture files until a later execution goal authorizes source/test
  changes.
