---
id: test-107
type: test
title: repo with no SPEC.md still validates
status: done
priority: 1
epic: epic-54
parent: goal-9
prev: test-106
next: test-108
tags: [spec, validation, compatibility]
owners: []
links: []
artifacts: []
relates: [goal-9, task-283]
blocked_by: [task-283]
blocks: []
refs: [dec-26]
aliases: [no-spec-repo-validation]
skills: []
cases: [no-spec-validates]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Prove that SPEC adoption is optional.

# Test Cases

- A temp repo initialized without SPEC files passes `mdkg validate`.
- `capability list --kind spec` returns zero records without an error.
- Upgrade/init behavior does not force SPEC creation.

# Evidence

Completed by `task-283` on 2026-06-06.

- Added command-level coverage in `tests/commands/agent_file_types.test.ts`:
  `validate accepts repos with no SPEC files and capability list reports zero
  specs`.
- The test creates a temp workspace with no `SPEC.md` files, runs validation,
  confirms the built graph contains zero `type: spec` nodes, and confirms
  `runCapabilityListCommand({ kind: "spec", json: true })` returns count `0`.
- `npm run test`: passed, 413 tests.
- `node dist/cli.js validate --json`: passed with no warnings or errors.
