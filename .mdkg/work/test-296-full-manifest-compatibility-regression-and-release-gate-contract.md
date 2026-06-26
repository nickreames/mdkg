---
id: test-296
type: test
title: full MANIFEST compatibility regression and release gate contract
status: done
priority: 1
epic: epic-198
parent: goal-37
tags: [manifest, regression, release-gates, prepublish, compatibility]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [edd-54, task-582, task-583, task-584]
context_refs: []
evidence_refs: []
aliases: [manifest-full-regression-contract, manifest-release-gate-contract]
skills: []
cases: [focused-unit-tests, smoke-capabilities, smoke-archive-work, smoke-bundle, smoke-subgraph, docs-check, prepublish-dry-run]
created: 2026-06-25
updated: 2026-06-26
---
# Overview

Prove the completed manifest rename is locally release-ready and does not
weaken existing mdkg validation or workflow mirror behavior.

# Target / Scope

- `task-582`
- `task-583`
- `task-584`

# Preconditions / Environment

All implementation tasks are complete and generated docs/indexes are refreshed.

# Test Cases

- Focused parser, validation, capability, pack, work trigger, scaffold, docs,
  and fixture tests pass.
- `npm run build`, `npm run test`, `npm run cli:check`, and
  `npm run cli:contract` pass.
- `npm run smoke:capabilities`, `npm run smoke:archive-work`,
  `npm run smoke:bundle`, `npm run smoke:subgraph`, and `npm run docs:check`
  pass.
- `node dist/cli.js validate --json` passes under the repo's warning policy.
- `git diff --check` passes.
- Closeout checkpoint and downstream handoff exist before local commit.

# Results / Evidence

- PASS: focused parser, validation, capability, pack, work trigger, scaffold,
  docs, and fixture tests passed as part of `npm run test`.
- PASS: `npm run build`, `npm run test` (518/518), `npm run cli:check`, and
  `npm run cli:contract`.
- PASS: `npm run smoke:capabilities`, `npm run smoke:archive-work`,
  `npm run smoke:bundle`, `npm run smoke:subgraph`, and `npm run docs:check`.
- PASS: `node dist/cli.js validate --json` returned `ok: true` with the one
  accepted dogfood legacy `SPEC.md` compatibility warning.
- PASS: `git diff --check`.
- PASS: closeout checkpoint `root:chk-277` and downstream handoff checkpoint
  `root:chk-278` exist.

# Notes / Follow-ups

- This test does not include npm publish, tag, push, or downstream repo edits.
