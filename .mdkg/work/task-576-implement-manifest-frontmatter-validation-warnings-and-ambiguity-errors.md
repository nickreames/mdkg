---
id: task-576
type: task
title: implement manifest frontmatter validation warnings and ambiguity errors
status: done
priority: 1
epic: epic-195
parent: goal-37
tags: [manifest, validation, diagnostics, compatibility]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [edd-54, dec-26, task-276]
context_refs: []
evidence_refs: []
aliases: [manifest-frontmatter-validation, spec-legacy-warning, manifest-spec-ambiguity-error]
skills: [select-work-and-ground-context]
created: 2026-06-25
updated: 2026-06-26
---
# Overview

Update validation so canonical manifests enforce the existing reusable
capability/runtime contract, legacy specs warn without breaking existing repos,
and duplicate canonical/legacy files fail explicitly.

# Acceptance Criteria

- `MANIFEST.md` with `type: manifest` validates with the same substantive
  requirements currently enforced for valid `SPEC.md`.
- `SPEC.md` with `type: spec` remains valid legacy input and emits the policy
  warning from `task-574`.
- Transitional `MANIFEST.md` with `type: spec` follows the chosen policy from
  `task-574`.
- Duplicate `MANIFEST.md` and `SPEC.md` in the same logical unit fail with a
  deterministic ambiguity error.
- Validation of work contracts, subagent refs, ownership, dependency refs, and
  no-secret warnings is not weakened.

# Files Affected

- `src/graph/agent_file_types.ts`
- `src/graph/validate_graph.ts`
- `tests/commands/agent_file_types.test.ts`
- `tests/fixtures/agent/**`

# Implementation Notes

- Error messages should prefer `MANIFEST.md` and mention `SPEC.md` only as
  legacy support.
- Keep warning codes stable enough for docs/tests to assert meaningful text.

# Implementation Evidence

- Added canonical/legacy basename constants for `MANIFEST.md` and `SPEC.md`.
- Added duplicate sibling detection for any logical Omni unit containing both
  `MANIFEST.md` and `SPEC.md`; validation reports a deterministic ambiguity
  error, and strict indexing fails before trusting one file silently.
- Preserved the task-574 transitional bridge: `MANIFEST.md` with legacy
  `type: spec` validates during the compatibility release and emits
  `manifest.compat.type_spec`.
- Legacy `SPEC.md` with `type: spec` remains valid and emits
  `manifest.compat.spec_legacy` with the exact policy text from task-574.
- Validation warning diagnostics now classify manifest compatibility warnings
  under `category: manifest-compatibility`.
- `work validate` now preserves the same manifest compatibility warning code
  in its typed diagnostics.

# Verification Evidence

- `npm run build`: pass.
- `npm run build:test`: pass.
- `node --test dist/tests/commands/agent_file_types.test.js`: 38 pass.
- `node --test dist/tests/commands/validate.test.js`: 10 pass.
- `node --test dist/tests/commands/spec.test.js`: 3 pass.
- `node --test dist/tests/graph/capabilities_indexer.test.js`: 4 pass.
- `node dist/cli.js validate --json`: `ok: true`, `error_count: 0`,
  `warning_count: 1` for the intentional dogfood legacy
  `.mdkg/work/mdkg-cli/SPEC.md` warning.
- `node dist/cli.js validate --changed-only --json`: `ok: true`,
  `warning_count: 0`, `error_count: 0`.
- `node dist/cli.js work validate --type spec --json`: `ok: true`,
  `warning_count: 1`, diagnostic code `manifest.compat.spec_legacy`.
- `git diff --check`: clean.

# Test Plan

- `test-289`
- `test-290`
- `test-291`
- Existing invalid SPEC fixture tests still fail for the same substantive
  reasons.

# Links / Artifacts

- `edd-54`
- `dec-50`
- `task-574`
