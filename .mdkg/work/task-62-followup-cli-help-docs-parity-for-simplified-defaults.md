---
id: task-62
type: task
title: followup cli help docs parity for simplified defaults
status: done
priority: 1
epic: epic-7
tags: [v0_5, cli, docs, parity]
owners: []
links: []
artifacts: []
relates: [task-61, test-28, test-29, epic-7]
blocked_by: []
blocks: [test-28, test-29]
refs: []
aliases: []
created: 2026-03-05
updated: 2026-03-05
---

# Overview

Apply command/help/readme parity updates after CLI simplification decisions are implemented.

# Acceptance Criteria

- `mdkg --help` and README command matrix remain synchronized.
- Migration notes cover changed defaults and deprecated flags.

# Files Affected

- src/cli.ts
- README.md
- .mdkg/core/rule-3-cli-contract.md

# Implementation Notes

- Follow-up work; not a v0.0.4 release blocker.

# Test Plan

- Manual parity audit plus regression checks.

# Links / Artifacts

- epic-7
