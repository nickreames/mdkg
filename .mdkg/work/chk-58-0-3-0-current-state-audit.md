---
id: chk-58
type: checkpoint
title: 0.3.0 current state audit
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-280]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-280]
created: 2026-06-06
updated: 2026-06-06
---
# Summary

Completed the read-only current-state audit before 0.3.0 source mutation.
The repo is still on package/CLI version `0.2.0`; the graph validates after
index refresh; `capability list --kind spec` and `--kind work` both return zero
concrete records; current work helpers and public DB queue commands exist; and
the 0.3.0 implementation gaps are now recorded on `task-280`.

# Scope Covered

- `task-280`: package version, git state, validation/index state, SPEC and WORK
  capability index state, work command surface, DB queue command surface, docs,
  templates, tests, and blockers before source mutation.

# Decisions Captured

- No external blocker was found.
- Source mutation should begin only after `task-281` locks the final 0.3.0
  acceptance matrix and non-publish release boundary.
- `capability list --kind spec` returning zero records is expected current
  state, not success for goal-9.

# Implementation Summary

- Graph evidence only. No `src/**`, `scripts/**`, package metadata, docs,
  templates, or generated init assets were changed as part of the audit.

# Verification / Testing

- `node dist/cli.js --version`: `0.2.0`.
- `node dist/cli.js capability list --kind spec --json`: `count: 0`.
- `node dist/cli.js work --help`: existing semantic mirror helpers only.
- `node dist/cli.js index`: refreshed JSON and SQLite indexes.
- `node dist/cli.js validate --json`: `ok: true`, no warnings, no errors.
- `git diff --check`: passed.

# Known Issues / Follow-ups

- `goal next` still warns that design/decision docs in `goal-9` scope are
  non-actionable selector inputs; this should be cleaned in the recursive loop
  contract work.
- 0.3.0 implementation work remains open: `spec_kind`, misuse diagnostics,
  dogfood mdkg CLI SPEC/WORK records, `mdkg spec ...`, deterministic work
  trigger/order/receipt helpers, queue bridge, docs/templates/init/upgrade
  updates, package bump, and dry-run publish proof.

# Links / Artifacts

- `task-280`
- `goal-9`
- `.mdkg/pack/pack_standard_task-280_20260606-104013678.md`
- dashboards
