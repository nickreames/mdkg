---
id: task-640
type: task
title: add profile validation CLI flags and profile fixtures
status: done
priority: 1
parent: goal-49
tags: [0.4.1, contract-profile, cli, profile, fixtures]
owners: []
links: []
artifacts: [src/commands/validate.ts, src/commands/work.ts, src/cli.ts, CLI_COMMAND_MATRIX.md, scripts/assert-publish-ready.js, tests/commands/agent_file_types.test.ts, tests/commands/cli.test.ts, tests/commands/cli_help_matrix.test.ts]
relates: []
blocked_by: [task-639]
blocks: [task-641, test-333]
refs: [task-632, task-636]
context_refs: []
evidence_refs: []
aliases: []
skills: [build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-02
updated: 2026-07-03
---
# Overview

Add explicit profile validation surfaces after generic contract-profile
validation exists.

# Acceptance Criteria

- `mdkg validate --profile <name>` is documented and implemented.
- `mdkg work validate --profile <name>` is documented and implemented.
- Profile fixtures exercise validation behavior without making any
  product-specific profile name a public mdkg primitive; runtime execution
  semantics remain downstream-owned.
- Profile mode escalates unknown or incompatible profile, receipt-kind, and
  redaction-class values according to the implemented allowlist.
- Generic validation remains compatible for repos that do not opt into
  `--profile`.

# Files Affected

- CLI dispatch/help.
- Validate and work-validate command surfaces.
- Command contract/snapshot fixtures.
- Profile-focused validation fixtures.

# Implementation Notes

- `--profile` here means validation profile, not pack body profile. Help text
  must disambiguate this from `mdkg pack --profile`.
- Do not require `contract_profile` in generic workflow files.

# Test Plan

- `mdkg validate --profile <fixture-profile> --json` fixture probe
- `mdkg work validate --profile <fixture-profile> --json` fixture probe
- `npm run cli:check`
- `npm run cli:contract`
- `npm run test`

# Links / Artifacts

- `task-632`
- `task-636`
