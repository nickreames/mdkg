---
id: chk-48
type: checkpoint
title: SPEC example fixture coverage contract
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: [.mdkg/work/task-270-define-spec-example-fixture-coverage.md, tests/fixtures]
relates: [task-270]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-270]
created: 2026-06-06
updated: 2026-06-06
---
# Summary

`task-270` defined the future SPEC example fixture coverage contract for
goal-8. The plan follows the existing `tests/fixtures` convention and covers
positive and negative fixtures for the initial SPEC template taxonomy.

# Scope Covered

- Future fixture locations.
- Positive fixture families for project, agent, runtime-agent, API,
  capability, tool, model, runtime image, and integration SPECs.
- Negative fixture families for required sections, conditional sections,
  frontmatter, naming, unsafe content, and kind-specific omissions.
- Generic naming, URI, and publish-safety rules.
- Future validation coverage expectations.

# Decisions Captured

- New SPEC fixtures should add focused coverage under `tests/fixtures/specs`
  instead of replacing the existing `tests/fixtures/agent` workflow corpus.
- Compatibility fixtures may cover the current minimal `SPEC.md` scaffold as a
  warning path until a migration task changes the scaffold contract.
- Fixture failures should be single-purpose where possible so diagnostics can
  assert stable severity and repair hints.

# Implementation Summary

Only mdkg graph/design state changed. `task-270` now carries the future fixture
matrix, and `edd-14` gained the `spec-example-fixtures` discovery alias.

# Verification / Testing

- `node dist/cli.js index`
- `node dist/cli.js validate`
- `node dist/cli.js capability search "SPEC example fixtures" --json`
- `node dist/cli.js capability search "SPEC template taxonomy" --json`
- Product-name grep over `.mdkg/templates/specs`, `task-269`, and `task-270`
- `git diff --check`

# Known Issues / Follow-ups

- `task-271` must define validation diagnostics and command surface.
- `test-100` remains the template and example coverage validation node.
- No fixture files were added in this planning node.

# Links / Artifacts

- `goal-8`
- `task-270`
- `epic-47`
- `tests/fixtures`
