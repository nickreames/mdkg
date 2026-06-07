---
id: test-109
type: test
title: dogfood mdkg CLI SPEC appears in capability list kind spec
status: done
priority: 1
epic: epic-55
parent: goal-9
prev: test-108
next: test-110
tags: [spec, dogfood, capability-index]
owners: []
links: []
artifacts: []
relates: [goal-9, task-284, task-285]
blocked_by: [task-284, task-285]
blocks: []
refs: [edd-15]
aliases: [dogfood-spec-capability-list-validation]
skills: []
cases: [capability-list-kind-spec]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Prove the live mdkg repo has a concrete indexed SPEC record.

# Test Cases

- `node dist/cli.js capability list --kind spec --json` returns count greater than zero.
- The dogfood mdkg CLI SPEC has `spec_kind: cli_tool`.
- The record includes useful capability metadata.

# Evidence

Completed by `task-284` and `task-285` on 2026-06-06.

- Added `.mdkg/work/mdkg-cli/SPEC.md` with `id: spec.mdkg-cli` and
  `spec_kind: cli_tool`.
- Added `.mdkg/work/mdkg-cli/validate/WORK.md` so the SPEC has a strict
  validating `work_contracts` target.
- Updated `src/graph/capabilities_indexer.ts` so SPEC capability records expose
  `spec_kind`.
- `node dist/cli.js capability list --kind spec --json` returns count `1` and
  includes `root:spec.mdkg-cli`.
- The returned dogfood SPEC record includes `spec.spec_kind: cli_tool`,
  `requested_capabilities`, `work_contracts`, `skill_refs`, `tool_refs`,
  `resource_profile`, `update_policy`, links, refs, headings, visibility,
  source hash, and deterministic `indexed_at` metadata.
- `npm run test`: passed, 413 tests.
- `npm run smoke:capabilities`: passed.
- `node dist/cli.js validate --json`: passed with no warnings or errors.
