---
id: chk-274
type: checkpoint
title: goal-37 SPEC surface audit complete
checkpoint_kind: implementation
status: backlog
priority: 9
tags: [goal-37, manifest, spec, audit]
owners: []
links: []
artifacts: []
relates: [task-573]
blocked_by: []
blocks: []
refs: [goal-37, edd-54, dec-50]
context_refs: []
evidence_refs: []
aliases: [goal-37-spec-surface-audit, manifest-rename-audit-checkpoint]
skills: []
scope: [task-573]
created: 2026-06-25
updated: 2026-06-25
---
# Summary

Completed `task-573`, the read-only audit of current `SPEC.md` implementation,
documentation, templates, fixtures, example graphs, skills, and generated
surfaces before any MANIFEST rename source work begins.

What is now true:

- The current repo validates cleanly with zero warnings and zero errors.
- The live repo has one spec capability, `root:spec.mdkg-cli`, at
  `.mdkg/work/mdkg-cli/SPEC.md`.
- Current behavior is pinned: `SPEC.md` is the only accepted filename for
  `type: spec`; `MANIFEST.md` with `type: spec` currently fails with
  `spec files must be named SPEC.md`.
- No source code, docs, package files, templates, or fixtures were changed in
  this phase; only mdkg graph/audit state and regenerated index state changed.

# Scope Covered

- `task-573`
- `goal-37`
- `dec-50`
- `edd-54`

## Changed Surfaces

- `.mdkg/work/task-573-audit-current-spec-implementation-docs-templates-fixtures-and-generated-surfaces.md`
- `.mdkg/work/chk-274-goal-37-spec-surface-audit-complete.md`
- `.mdkg/work/goal-37-rename-spec-md-to-manifest-md-with-legacy-alias.md`
- `.mdkg/index/mdkg.sqlite`

## Boundaries

- in scope: audit evidence, current behavior baseline, surface matrix, legacy
  compatibility test tags, mdkg task status/checkpoint/index state.
- out of scope: source implementation, docs rewrite, template rename, fixture
  rename, package payload changes, remote push.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded:
  yes.

# Decisions Captured

- `dec-50`: accepted bridge policy. `MANIFEST.md` becomes canonical;
  `SPEC.md` remains a legacy alias for one compatibility release;
  `MANIFEST.md` with transitional `type: spec` warns and normalizes; sibling
  `MANIFEST.md` plus `SPEC.md` is a validation error.

# Implementation Summary

This was a graph-only audit closeout. The audit found that current behavior is
driven by node type `spec`, while the filename gate is hard-coded to `SPEC.md`.
The implementation path should preserve internal capability semantics while
widening filename acceptance and emitting compatibility diagnostics.

# Implementation Details

- Code or graph surfaces changed: mdkg task/checkpoint/goal state only.
- Architecture or data-shape notes: `src/graph/workspace_files.ts` reads all
  markdown under mdkg work roots, `src/graph/node.ts` dispatches by `type`, and
  `src/graph/agent_file_types.ts` owns the current `SPEC.md` basename check.
- Compatibility notes: tests should tag `legacy-spec-filename`,
  `manifest-canonical-filename`, `manifest-type-spec-bridge`,
  `duplicate-manifest-spec`, `legacy-spec-diagnostics`, and
  `legacy-work-trigger`.

# Verification / Testing

## Command Evidence

- `git status --short --branch`: repo ahead of `origin/main` with only related
  goal execution dirt before narrative edits.
- Required `rg` coverage for `SPEC.md`, `MANIFEST.md`, `type: spec`,
  `type: manifest`, `OmniFileKind`, `WORK.md`, `WORK_ORDER.md`, and broad
  `spec` / `manifest` terms completed.
- `node dist/cli.js validate --json`: `ok: true`, zero warnings, zero errors.
- `node dist/cli.js validate --changed-only --json`: `ok: true`, changed paths
  limited to goal-37/task-573/index state at that point.
- `node dist/cli.js capability list --kind spec --json`: one spec capability,
  `root:spec.mdkg-cli`.
- `node dist/cli.js spec list --json`: one spec capability,
  `root:spec.mdkg-cli`.
- `node dist/cli.js work validate --type spec --json`: one checked node, zero
  diagnostics.
- Scratch no-SPEC repo: validation succeeded; spec capability count was zero.
- Scratch invalid `SPEC.md` fixture: validation failed as expected on the
  typed role enum diagnostic.
- Scratch `MANIFEST.md` containing `type: spec`: validation failed as expected
  with `spec files must be named SPEC.md`.
- `node dist/cli.js index`: refreshed mdkg JSON and SQLite indexes.
- `node dist/cli.js pack task-573 --profile concise --dry-run --stats`:
  succeeded without writing files.
- `node dist/cli.js capability search "MANIFEST.md legacy SPEC.md" --json`:
  returned `root:dec-50` and `root:edd-54`.

## Pass / Fail Status

- status: pass for `task-573`.

## Known Warnings

- Scratch repos created before `mdkg index` emitted the expected generated
  SQLite cache warning. The live repo validation emitted no warnings.

# Known Issues / Follow-ups

- `goal-37` is not complete. Source implementation still needs to add
  canonical `MANIFEST.md` support, legacy `SPEC.md` alias behavior, duplicate
  sibling validation, docs/template/fixture updates, and full release gates.
- `task-574` is the next graph-planning bridge node before behavior changes
  begin.

## Follow-up Refs

- `task-574`
- `task-575`
- `test-289`
- `test-290`

# Links / Artifacts

- `task-573`
- `goal-37`
- `dec-50`
- `edd-54`

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw secrets, raw prompts, raw payloads, or bulky execution traces.
