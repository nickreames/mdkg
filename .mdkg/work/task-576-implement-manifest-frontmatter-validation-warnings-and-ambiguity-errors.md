---
id: task-576
type: task
title: implement manifest frontmatter validation warnings and ambiguity errors
status: todo
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
updated: 2026-06-25
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
