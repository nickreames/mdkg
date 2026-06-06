---
id: task-276
type: task
title: define SPEC parser index validation implementation sequence
status: done
priority: 1
epic: epic-51
parent: goal-8
tags: [spec, parser, index, validation, implementation-plan]
owners: []
links: []
artifacts: []
relates: [goal-8, epic-51, test-102]
blocked_by: [task-271, task-272, task-273, task-275]
blocks: [task-277, task-278]
refs: [edd-14]
aliases: [spec-implementation-sequence]
skills: [select-work-and-ground-context]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Define the source implementation sequence for SPEC parsing, indexing,
validation, and diagnostics.

# Current Source Anchors

Future implementation should start from the existing graph/index architecture
instead of adding a parallel parser stack:

- `src/graph/frontmatter.ts` and `src/graph/node.ts`: generic Markdown
  frontmatter parsing, template-schema validation, node attribute extraction,
  and base graph node validation.
- `src/graph/agent_file_types.ts`: existing strict validation for portable
  agent workflow `SPEC.md`, `WORK.md`, `WORK_ORDER.md`, `RECEIPT.md`,
  `FEEDBACK.md`, `DISPUTE.md`, and `PROPOSAL.md` files.
- `src/graph/validate_graph.ts`: cross-node graph validation and current agent
  workflow reference checks.
- `src/graph/indexer.ts`, `src/graph/index_cache.ts`, and
  `src/graph/sqlite_index.ts`: graph index construction and cache persistence.
- `src/graph/capabilities_indexer.ts` and
  `src/graph/capabilities_index_cache.ts`: read-only capability discovery,
  currently including `kind: spec` records with conservative frontmatter
  attributes.
- `src/commands/validate.ts`, `src/commands/capability.ts`, and `src/cli.ts`:
  CLI entry points and JSON receipt behavior that must remain compatible.
- `tests/commands/validate*.test.ts`, `tests/commands/capability.test.ts`,
  `tests/graph/*indexer*.test.ts`, and `tests/fixtures/agent/**`: current test
  surfaces for validation, capability discovery, and portable agent workflow
  documents.

# Implementation Order

## Phase 0: Audit And Fixture Baseline

Before adding parser behavior, create tests that describe current behavior and
known gaps:

- Inventory `.mdkg/templates/specs/*.SPEC.md`,
  `.mdkg/templates/default/spec.md`, current `SPEC.md` fixtures, and
  capability records generated from existing `spec` nodes.
- Add positive and negative fixture names that match the contracts from
  `task-267` through `task-275`.
- Assert current `mdkg validate --json` shape remains
  `{ action, ok, warning_count, error_count, warnings, errors }`.
- Assert current `mdkg capability list/search/show --kind spec --json`
  behavior before extending returned records.
- Preserve existing agent workflow fixture behavior; the generic SPEC validator
  should augment it, not loosen it accidentally.

Exit gate:

- Unit tests cover current parser/index/validation behavior before source
  changes.
- No public CLI surface changes yet.

## Phase 1: Internal SPEC Parser Model

Add an internal parser module that normalizes a SPEC without changing CLI
behavior. The parser should consume existing Markdown/frontmatter primitives
and produce a stable typed record:

- identity and canonical source path.
- template kind and `extends` chain when present.
- role/runtime-specific attributes when present.
- required, conditional, optional, and unknown frontmatter keys.
- required, conditional, optional, and unknown body sections.
- body section ranges/headings for diagnostics.
- normalized source hash.
- visibility and projection metadata hints when present.

The first parser should be deterministic, read-only, and tolerant enough to
return partial records for repairable documents. It should not generate files,
write projections, or mutate templates.

Exit gate:

- Parser unit tests cover valid base, agent, runtime-agent, tool, API,
  integration, model, runtime-image, capability, and project SPEC examples.
- Negative parser tests cover missing sections, invalid role/authority fields,
  unknown keys, product-specific example names, and unsafe projection fields.

## Phase 2: Diagnostics Engine

Implement diagnostics from `task-271` as a stable internal data shape before
adding a public command:

- severity: error, warning, repair, or info.
- code.
- path.
- heading or line when available.
- message.
- repair suggestion.
- source rule family.
- gated-by context, such as strict mode, compatibility mode, projection mode,
  or future exporter mode.

Rule families should map to the design contracts:

- section semantics from `task-267`.
- frontmatter and compatibility rules from `task-268`.
- template taxonomy from `task-269`.
- fixture coverage from `task-270`.
- capability-index expectations from `task-272`.
- projection drift and no-secret rules from `task-273`.
- agent-role, queue/event, and receipt rules from `task-274` and `task-275`.

Exit gate:

- Diagnostic tests prove class, code, path, and repair output for each rule
  family.
- Existing `mdkg validate --json` remains compatible until a dedicated SPEC
  command is introduced.

## Phase 3: Capability Index Integration

Extend `kind: spec` capability records only after parser and diagnostics are
stable:

- keep source hash, headings, refs, aliases, links, artifacts, and visibility.
- add conservative parser-derived fields such as template kind, role,
  authority boundary presence, projection target presence, lifecycle presence,
  and diagnostic summary.
- keep capability commands read-only and non-validating.
- preserve imported subgraph records as read-only source projections.

Exit gate:

- Capability index tests verify `list`, `search`, `show`, and `resolve` for
  SPEC records.
- Stale-cache and `--no-reindex` behavior remains compatible.
- Invalid but parseable SPECs remain discoverable enough to repair.

## Phase 4: Validation Integration

Wire SPEC diagnostics into `mdkg validate` after parser and capability tests
are green:

- `mdkg validate` remains the repository trust gate.
- Existing top-level JSON receipt shape remains compatible.
- Strict SPEC diagnostics can appear in `errors` or `warnings` according to the
  compatibility policy from `task-277`.
- Repair suggestions should be human-readable today and machine-readable in a
  future dedicated SPEC command.

Exit gate:

- `tests/commands/validate.test.ts` and related tests prove graph validation,
  skill validation, archive validation, and event validation still work.
- New SPEC diagnostics fail or warn deterministically.
- Existing seeded templates validate or produce only intentionally planned
  compatibility warnings.

## Phase 5: Focused SPEC Command

Only after `mdkg validate` integration is stable, add a focused authoring
command if still desired:

```text
mdkg spec validate [path] [--json] [--strict] [--compat]
mdkg spec validate --fixtures [--json]
```

This command should reuse the same parser and diagnostics engine as
`mdkg validate`. It should not become a separate source of truth.

Exit gate:

- CLI dispatch, help snapshot, command matrix, JSON receipt, and fixture tests
  cover the new command.
- `mdkg validate` still remains the graph-wide trust gate.

## Phase 6: Template Promotion And Upgrade Path

Promote richer templates only after parser, diagnostics, and compatibility
tests prove the behavior:

- update `.mdkg/templates/specs/*.SPEC.md` and
  `.mdkg/templates/default/spec.md` together.
- update dist init assets and upgrade fixtures.
- keep downstream product-specific extensions intact.
- require dry-run upgrade evidence before apply behavior changes.

Exit gate:

- `smoke:upgrade`, `smoke:init`, template tests, and capability smoke pass.
- A migration/backcompat plan from `task-277` is complete.

## Phase 7: Projection Checks Only, Exporter Deferred

Projection drift and no-secret policy can be validated after parser support
exists, but exporter writes remain deferred:

- detect missing source metadata.
- detect source/projection drift when metadata exists.
- fail closed on secret-like projection content.
- create repair diagnostics for projection-only durable behavior.

Exit gate:

- Projection validation tests pass without writing projection files.
- No `.codex/agents` exporter, runtime manifest exporter, package exporter, or
  hosted runtime integration is added in this slice.

# Future Source Goal Handoff

Recommended future umbrella goal:

`Implement SPEC parser index validation foundation`

Suggested ordered implementation slices:

1. Audit existing SPEC parsing, agent workflow validation, capability records,
   and template fixtures.
2. Add internal SPEC parser and normalized record model.
3. Add positive/negative SPEC fixture suites.
4. Add diagnostics engine and rule-code tests.
5. Extend `kind: spec` capability records and search tests.
6. Wire SPEC diagnostics into `mdkg validate` under compatibility policy.
7. Add focused `mdkg spec validate` command only after shared diagnostics are
   stable.
8. Update template/init/upgrade assets with dry-run migration evidence.
9. Add projection drift/no-secret validation checks without exporter writes.
10. Run package gates up to dry-run publish; do not publish unless a separate
    release goal requests it.

Required future checks:

- `npm run build`
- `npm run test`
- `npm run cli:check`
- `node dist/cli.js validate`
- `npm run smoke:capabilities`
- `npm run smoke:init`
- `npm run smoke:upgrade`
- `npm run smoke:visibility`
- `node scripts/assert-publish-ready.js`
- `npm pack --dry-run --json`
- `npm publish --dry-run`
- `git diff --check`

# Deferral Boundary

This sequencing task does not implement parser, index, validation, command,
template, upgrade, or exporter changes. It only records the order and gates for
a later source implementation goal.

# Acceptance Criteria

- Implementation begins with parser/index audit and tests.
- Validation diagnostics follow the design contract.
- Capability discovery changes are tested before release.
- Exporter work remains deferred.

# Test Plan

- Future source goal handoff exists with ordered implementation slices.
- `mdkg capability search "spec implementation sequence" --json`
- `mdkg capability search "SPEC validation diagnostics" --json`
- `mdkg capability search "runtime agent manifest" --json`

# Files Affected

- mdkg planning nodes only.

# Implementation Notes

- This task creates source-work sequencing, not source changes.

# Links / Artifacts

- `goal-8`
- `epic-51`
