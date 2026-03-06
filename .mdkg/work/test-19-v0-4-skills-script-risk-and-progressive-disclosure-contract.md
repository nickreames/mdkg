---
id: test-19
type: test
title: v0.4 skills script risk and progressive disclosure contract
status: todo
priority: 1
epic: epic-4
tags: [v0_4, skills, security, packs]
owners: []
links: []
artifacts: []
relates: [prd-1, dec-8, dec-9, edd-5, task-36, task-48, task-49, epic-4]
blocked_by: []
blocks: []
refs: []
aliases: []
cases: [script-risk-guidance, approvals-and-logging-guidance, meta-vs-full-loading-guidance, omni-usage-pattern]
created: 2026-03-04
updated: 2026-03-04
---

# Overview

Validate the planning contract for skills script risk guidance and metadata-first/full-body loading strategy.

# Target / Scope

Covers docs-level safety guidance for `scripts/` skills and progressive disclosure behavior in pack-driven workflows.

# Preconditions / Environment

- `edd-5` and linked pack/memory docs are integrated
- runtime command/flag contracts for skills remain deferred

# Test Cases

- Verify script-bearing skills are documented as higher-risk with approval and logging guidance.
- Verify docs state mdkg does not execute scripts directly.
- Verify progressive disclosure guidance is explicit: metadata-first planning, full-body execution.
- Verify Omni usage pattern guidance is consistent with `edd-3` and pack policy docs.

# Results / Evidence

Capture `mdkg show edd-5 --body`, `mdkg show task-49 --body`, and linked task outputs.

# Notes / Follow-ups

- Add runtime policy enforcement tests if script-risk validation/flags are implemented later.
