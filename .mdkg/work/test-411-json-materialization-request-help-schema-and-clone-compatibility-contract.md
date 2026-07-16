---
id: test-411
type: test
title: JSON materialization request help schema and clone compatibility contract
status: done
priority: 1
parent: goal-66
tags: [goal-66, test, json, compatibility]
owners: []
links: []
artifacts: []
relates: [task-746, task-747, task-750]
blocked_by: [task-750]
blocks: []
refs: [goal-66, dec-75]
context_refs: [edd-73, goal-52]
evidence_refs: []
aliases: [materialize-json-contract-test]
skills: []
cases: [file-input, stdin-input, unknown-fields, yaml-rejection, help-parity, clone-regression]
created: 2026-07-11
updated: 2026-07-15
---

# Overview

Prove strict JSON v1 input, source/package help parity, and unchanged low-level
clone behavior.

# Target / Scope

- Parser/schema, CLI dispatch/help, generated contract, existing Git tests.

# Preconditions / Environment

- `task-750` complete.

# Test Cases

- File/stdin canonical equivalence and request hash.
- Missing/unknown/wrong-type fields and YAML rejection.
- Exact v1 enum and schema identifier behavior.
- Existing inspect/clone/fetch receipts and help remain compatible.

# Results / Evidence

- Passed in `tests/commands/git_materialize.test.ts`: file and stdin requests
  produce the same canonical hash; malformed JSON, duplicate keys, YAML-like
  input, missing/unknown/wrong-type fields, invalid enums, credentials, partial
  refs, abbreviated ids, and unsafe destinations fail before Git executes.
- `node dist/cli.js help git materialize`, `npm run cli:check`, and
  `npm run cli:contract` pass with schema and usage parity.
- `npm run smoke:git-materialize` confirms the installed tarball retains
  existing `mdkg git clone` behavior from the same neutral Git fixture.

# Notes / Follow-ups

- YAML belongs to `task-752`.
