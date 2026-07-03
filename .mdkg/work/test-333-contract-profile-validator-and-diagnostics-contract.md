---
id: test-333
type: test
title: contract-profile validator and diagnostics contract
status: todo
priority: 1
parent: goal-49
tags: [0.4.1, contract-profile, validation, diagnostics]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-639, task-640]
blocks: [test-335]
refs: [task-632, task-636, test-330]
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
cases: []
created: 2026-07-02
updated: 2026-07-02
---
# Overview

Validate the implemented contract-profile field and diagnostic behavior before
scaffold or release readiness is accepted.

# Target / Scope

- `task-639`
- `task-640`
- MANIFEST, WORK, WORK_ORDER, and RECEIPT fixtures

# Preconditions / Environment

- Generic validators accept selected optional fields.
- Profile validation CLI surfaces exist.

# Test Cases

- Valid generic optional fields pass.
- Malformed fields error.
- Unknown well-shaped profiles, receipt kinds, and redaction classes warn in
  generic mode.
- `--profile omni-room` escalates unknown or incompatible values according to
  the implemented allowlist.
- Bare `profile` is diagnosed as ambiguous and is not treated as an alias.
- Raw-content and runtime-only field diagnostics do not expose raw content.

# Results / Evidence

Pending.

# Notes / Follow-ups

- None yet.
