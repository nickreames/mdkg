---
id: task-639
type: task
title: implement contract-profile validators and stable diagnostics
status: done
priority: 1
parent: goal-49
tags: [0.4.1, contract-profile, validation, diagnostics]
owners: []
links: []
artifacts: [src/graph/agent_file_types.ts, src/graph/node.ts, src/commands/validate.ts, src/commands/work.ts, tests/commands/agent_file_types.test.ts]
relates: []
blocked_by: [task-637]
blocks: [task-640, test-333]
refs: [task-632, task-636, test-330]
context_refs: []
evidence_refs: []
aliases: []
skills: [build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-02
updated: 2026-07-03
---
# Overview

Implement the optional contract-profile fields and stable diagnostics before
any scaffold, helper, docs, or default asset starts emitting the new fields.

# Acceptance Criteria

- MANIFEST, WORK, WORK_ORDER, and RECEIPT accept optional `contract_profile`.
- MANIFEST, WORK_ORDER, and RECEIPT accept optional `validation_policy_ref` and
  `evidence_policy_ref`.
- RECEIPT accepts optional `receipt_kind` and `redaction_class`.
- Bare `profile` is diagnosed as ambiguous and is not implemented as an alias.
- Generic mode validates field shape, preserves current required-ref/hash
  errors, warns for unknown well-shaped profile/kind/class values, and warns
  when `redaction_class` appears without `redaction_policy`.
- Diagnostics use stable ids from `task-636` and never print raw secret,
  prompt, token, provider payload, queue payload, or bulky runtime content.

# Files Affected

- Validator and diagnostic source.
- Focused validator fixtures/tests.

# Implementation Notes

- Preserve `resource_profile`, WORK `kind`, WORK_ORDER `artifact_policy`, and
  RECEIPT `redaction_policy` semantics.
- Keep Omni Room room lifecycle, queue execution, sandbox/vault provider
  semantics, billing/ledger state, and final receipt authority out of generic
  mdkg validators.

# Test Plan

- focused fixture/unit tests for accepted fields and rejected bare `profile`
- focused tests for malformed field errors, unknown value warnings,
  `redaction_class`/`redaction_policy` compatibility, raw-content warnings, and
  runtime-only fields
- `npm run build`
- `npm run test`
- `node dist/cli.js validate --changed-only --json`

# Links / Artifacts

- `task-632`
- `task-636`
- `test-330`
