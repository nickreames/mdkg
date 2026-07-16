---
id: test-454
type: test
title: generated materialize command contract matches runtime requirements
status: done
priority: 1
parent: goal-66
prev: task-791
next: test-450
tags: [goal-66, test, cli-contract, generated-docs, materialization, 0.5.2]
owners: []
links: []
artifacts: []
relates: [task-791, task-750]
blocked_by: [task-791]
blocks: [test-450]
refs: [task-791, test-450, goal-67]
context_refs: [chk-530]
evidence_refs: [chk-530]
aliases: [materialize-command-contract-flags-test]
skills: [verify-close-and-checkpoint]
cases: [request-required, json-optional, usage-parity, generated-reference, drift-assertion, no-regressions]
created: 2026-07-15
updated: 2026-07-15
---
# Overview

Prove the generated machine-readable command record expresses the same required
and optional flags as live `mdkg git materialize` help and runtime dispatch.

# Target / Scope

- `task-791`
- Command-contract generation, docs projection, and publish-readiness checks.

# Preconditions / Environment

- Build the current CLI before generation.
- Compare generated output to live help and focused expected records.

# Test Cases

- `--request` is present and required with the correct value shape.
- `--json` is present and optional.
- Usage, flags, output formats, safety metadata, and receipt schema agree.
- Generated docs carry the corrected record.
- Existing command records and the deterministic contract hash remain valid.

# Results / Evidence

- Direct contract inspection showed `--request` with `value: <file|->` and
  `required: true`.
- Direct contract inspection showed `--json` with `value: null` and
  `required: false`.
- The regenerated CLI reference and summary carry contract hash
  `35e7a82190d09c19eb3c8823980d8f2b33b6a3aadfc4cf7f8c6f8249fadcdd71`.
- `npm run cli:contract`, `npm run cli:check`, `npm run docs:check`,
  `node scripts/assert-publish-ready.js`, and `git diff --check` passed.

# Notes / Follow-ups

- Any generated/runtime mismatch keeps `test-450` blocked.
