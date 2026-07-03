---
id: task-641
type: task
title: add contract-profile scaffold and work helper flags
status: done
priority: 1
parent: goal-49
tags: [0.4.1, contract-profile, cli, scaffold, work-helpers]
owners: []
links: []
artifacts: [src/commands/new.ts, src/commands/work.ts, src/cli.ts, src/graph/frontmatter.ts, CLI_COMMAND_MATRIX.md, tests/commands/agent_file_types.test.ts]
relates: []
blocked_by: [task-639, task-640]
blocks: [task-642, task-643, test-334]
refs: [task-631, task-634]
context_refs: []
evidence_refs: []
aliases: []
skills: [build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-02
updated: 2026-07-03
---
# Overview

Expose accepted fields through `mdkg new` scaffolds and `mdkg work` helper
flags after validators and profile CLI behavior are proven.

# Acceptance Criteria

- `mdkg new manifest` supports optional `--contract-profile`,
  `--validation-policy-ref`, and `--evidence-policy-ref`.
- `mdkg new work` supports optional `--contract-profile` without changing WORK
  `kind` semantics.
- `mdkg new work_order` supports optional `--contract-profile`,
  `--validation-policy-ref`, and `--evidence-policy-ref`.
- `mdkg new receipt` supports optional `--contract-profile`,
  `--receipt-kind`, `--redaction-class`, `--validation-policy-ref`, and
  `--evidence-policy-ref`.
- Relevant `mdkg work contract|order|receipt` helpers accept matching optional
  flags and JSON receipts, without claiming runtime execution.

# Files Affected

- New/scaffold command source.
- Work helper command source.
- CLI help, command contracts, and command docs inputs.
- Scaffold/helper tests.

# Implementation Notes

- Helper-created files must validate under generic mode and under the intended
  profile mode when a profile is supplied.
- `mdkg work trigger` must remain a semantic mirror helper and keep
  `executed: false`.

# Test Plan

- focused `mdkg new manifest|work|work_order|receipt` probes
- focused `mdkg work contract|order|receipt` probes
- `npm run smoke:archive-work`
- `npm run smoke:work-invocation`
- `npm run cli:check`
- `npm run cli:contract`

# Links / Artifacts

- `task-631`
- `task-634`
