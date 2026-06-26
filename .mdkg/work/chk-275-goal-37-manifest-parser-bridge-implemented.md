---
id: chk-275
type: checkpoint
title: goal-37 manifest parser bridge implemented
checkpoint_kind: implementation
status: backlog
priority: 9
tags: [goal-37, manifest, parser, compatibility]
owners: []
links: []
artifacts: []
relates: [task-575]
blocked_by: []
blocks: []
refs: [goal-37, edd-54, dec-50, task-575]
context_refs: []
evidence_refs: []
aliases: [goal-37-manifest-parser-bridge, manifest-semantic-kind-checkpoint]
skills: []
scope: [task-575]
created: 2026-06-26
updated: 2026-06-26
---
# Summary

Completed `task-575`, the first source implementation boundary for goal-37.
mdkg now recognizes `MANIFEST.md` / `type: manifest` as a first-class agent
workflow file type while retaining legacy `SPEC.md` / `type: spec`.

What is now true:

- `manifest` is an agent workflow file type with basename `MANIFEST.md`.
- `spec` remains an agent workflow file type with basename `SPEC.md`.
- Validation, capability indexing, and work trigger/contract relationship code
  use a shared manifest-semantic predicate for `manifest` and legacy `spec`.
- Existing compatibility JSON remains intact: manifest nodes project through
  `kind: "spec"` capability records while exposing `node_type: "manifest"` and
  preserving source path identity.

# Scope Covered

- `task-575`
- `test-289`
- `test-290`

## Changed Surfaces

- `src/graph/agent_file_types.ts`
- `src/graph/template_schema.ts`
- `src/graph/validate_graph.ts`
- `src/graph/capabilities_indexer.ts`
- `src/commands/work.ts`
- `src/cli.ts`
- `CLI_COMMAND_MATRIX.md`
- `tests/commands/agent_file_types.test.ts`
- `tests/commands/cli.test.ts`
- `tests/commands/spec.test.ts`
- `.mdkg/work/task-575-implement-manifest-semantic-kind-and-basename-recognition.md`
- `.mdkg/work/chk-275-goal-37-manifest-parser-bridge-implemented.md`
- `.mdkg/index/mdkg.sqlite`

## Boundaries

- in scope: parser/file-kind recognition, normalized semantic predicate,
  immediate validation/index/work-trigger consumers, focused tests, command
  matrix line needed for CLI check.
- out of scope: deprecation warnings, duplicate `MANIFEST.md` plus `SPEC.md`
  ambiguity errors, new `mdkg manifest ...` command family, scaffold/template
  rename, broad docs rewrite, package release.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded:
  yes.

# Decisions Captured

- `dec-50`: `MANIFEST.md` is canonical; `SPEC.md` remains a legacy alias for
  one compatibility release.

# Implementation Summary

The implementation added a canonical manifest file type and avoided a display
only rename. Code paths that need the logical capability family now use
`isManifestSemanticType(...)`, while capability records stay compatible for
existing `kind: spec` consumers.

# Implementation Details

- Code or graph surfaces changed: parser constants, template schema aliasing,
  graph validation, capability indexing, work trigger/contract relationship
  logic, CLI help, command matrix, and focused tests.
- Architecture or data-shape notes: `type: manifest` reuses the existing
  `spec` template schema until canonical manifest templates are introduced by a
  later task.
- Compatibility notes: legacy `SPEC.md` remains parseable and existing spec
  capability JSON consumers still see `kind: "spec"`.

# Verification / Testing

## Command Evidence

- `npm run build`: pass.
- `npm run build:test`: pass.
- `node --test dist/tests/commands/agent_file_types.test.js`: 35 pass.
- `node --test dist/tests/graph/capabilities_indexer.test.js`: 4 pass.
- `node --test dist/tests/commands/spec.test.js`: 3 pass.
- `node --test dist/tests/commands/cli.test.js`: 15 pass.
- `npm run cli:check`: pass.
- `npm run cli:contract`: pass.
- `node dist/cli.js validate --json`: `ok: true`, zero warnings, zero errors.
- `node dist/cli.js validate --changed-only --json`: `ok: true`, zero
  warnings, zero errors.
- `node dist/cli.js work validate --type manifest --json`: `ok: true`.
- `git diff --check`: clean.

## Pass / Fail Status

- status: pass for `task-575`.

## Known Warnings

- none from the final validation receipts.

# Known Issues / Follow-ups

- `task-576` still needs to add deprecation warnings, transitional
  `MANIFEST.md` with `type: spec`, and duplicate sibling ambiguity errors.
- `task-578` still needs the canonical `mdkg manifest ...` command family and
  manifest-first capability output.

## Follow-up Refs

- `task-576`
- `task-578`
- `test-289`
- `test-290`
- `test-291`

# Links / Artifacts

- `goal-37`
- `task-575`
- `dec-50`
- `edd-54`

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw secrets, raw prompts, raw payloads, or bulky execution traces.
