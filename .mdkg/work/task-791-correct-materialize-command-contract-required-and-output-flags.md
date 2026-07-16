---
id: task-791
type: task
title: correct materialize command contract required and output flags
status: done
priority: 1
parent: goal-66
prev: test-453
next: test-454
tags: [goal-66, cli-contract, generated-docs, materialization, 0.5.2]
owners: []
links: []
artifacts: []
relates: [task-750]
blocked_by: [test-453]
blocks: [test-454]
refs: [test-454, test-450, goal-67]
context_refs: [chk-530]
evidence_refs: [chk-530]
aliases: [materialize-command-contract-flag-fidelity]
skills: [build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-15
updated: 2026-07-15
---
# Overview

Fix the generated command-contract parser so the `git materialize` record
represents its live usage accurately. The partial security review found that
`--request` is recorded as optional and bracketed `--json` is omitted from
the generated flags array even though runtime behavior and usage text are
correct.

# Acceptance Criteria

- `git materialize` records `--request` with `required: true` and its
  value placeholder.
- Bracketed `--json` appears as an optional output flag without duplicating
  global output metadata.
- The generic help parser handles bracketed and required flags without
  regressing existing command records.
- Generated CLI reference and command-contract hash are refreshed.
- Publish readiness fails if either materialize flag drifts again.

# Files Affected

- `scripts/generate-command-contract.js`
- Focused generator/contract tests or assertions
- Generated command-contract and CLI-reference outputs
- `scripts/assert-publish-ready.js` when needed for durable drift detection

# Implementation Notes

- Derive requiredness from the usage grammar, not a materialize-only hardcoded
  exception, unless the existing generator architecture proves a generic
  parser change unsafe.
- Preserve deterministic ordering and stable hashing.

# Test Plan

- Complete `test-454`.
- Run `npm run cli:contract`, `npm run cli:check`, `npm run docs:check`,
  and `node scripts/assert-publish-ready.js`.
- Inspect the generated `git materialize` record directly.

# Implementation Evidence

- The generic flag parser now recognizes flags inside bracketed optional groups
  and computes requiredness from every usage alternative.
- Generated `git materialize` metadata records `--request <file|->` as required
  and bracketed `--json` as optional and discoverable.
- Publish readiness now asserts both fields so future drift fails closed.
- Contract hash after regeneration:
  `35e7a82190d09c19eb3c8823980d8f2b33b6a3aadfc4cf7f8c6f8249fadcdd71`.
- CLI contract/check, docs generation/check, publish-readiness assertion, and
  `git diff --check` passed on 2026-07-15.

# Links / Artifacts

- Partial review evidence: `chk-530`
