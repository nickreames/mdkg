---
id: task-573
type: task
title: audit current SPEC implementation docs templates fixtures and generated surfaces
status: done
priority: 1
epic: epic-194
parent: goal-37
next: task-574
tags: [manifest, spec, audit, source-map]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [edd-54, edd-14, dec-26, task-276]
context_refs: []
evidence_refs: []
aliases: [manifest-rename-source-audit, spec-surface-inventory]
skills: [select-work-and-ground-context]
created: 2026-06-25
updated: 2026-06-25
---
# Overview

Inventory every current `SPEC.md` and `spec` implementation surface before the
rename begins. This task is intentionally read-only except for recording audit
evidence in the task/checkpoint.

# Acceptance Criteria

- `git status --short --branch` is captured and unrelated dirty files are
  identified.
- Fast search covers `SPEC.md`, `MANIFEST.md`, `type: spec`, `type: manifest`,
  `Spec`, `spec`, `OmniFileKind`, `WORK.md`, and `WORK_ORDER.md`.
- Audit matrix lists source modules, CLI/help/docs, generated docs, templates,
  fixtures, example graphs, skills, and package scripts touched by the rename.
- Current behavior is summarized before implementation, including existing
  warnings/errors for no-SPEC repos and invalid SPEC fixtures.
- Any code path that must remain legacy-compatible is tagged for tests.

# Files Affected

- `src/graph/agent_file_types.ts`
- `src/graph/validate_graph.ts`
- `src/graph/capabilities_indexer.ts`
- `src/commands/spec.ts`
- `src/commands/work.ts`
- `src/cli.ts`
- `tests/commands/agent_file_types.test.ts`
- `tests/graph/capabilities_indexer.test.ts`
- `tests/fixtures/agent/**`
- `.mdkg/templates/default/spec.md`
- `.mdkg/templates/specs/*.SPEC.md`
- `docs/**`, `README.md`, `CLI_COMMAND_MATRIX.md`, generated docs, skills, and
  example graph indexes

# Implementation Notes

- Start with search and source reading only. Do not rename files in this task.
- Treat generated indexes and docs as derived surfaces; identify them, but
  update them only after behavior changes land.
- Preserve one compatibility lane for existing `SPEC.md` fixtures.

# Audit Evidence

- Baseline status before narrative edits: `## main...origin/main [ahead 3]`
  with related goal execution dirt only: `.mdkg/index/mdkg.sqlite`, `goal-37`,
  and `task-573`. No unrelated dirty files were present.
- Required search ran with:
  `rg -n "SPEC\\.md|MANIFEST\\.md|type: spec|type: manifest|OmniFileKind|WORK_ORDER\\.md|WORK\\.md|manifest" src tests docs .mdkg README.md CLI_COMMAND_MATRIX.md`.
- Expanded search also covered `Spec`, broad `spec`, `MANIFEST`, `manifest`,
  `WORK_ORDER`, and `WORK.md` across `src`, `tests`, `scripts`, `docs`,
  `.mdkg`, `README.md`, `CLI_COMMAND_MATRIX.md`, and `examples`.
- File inventory found current canonical `SPEC.md` fixtures, invalid fixture
  directories, `.mdkg/templates/default/spec.md`, `.mdkg/templates/specs/*.SPEC.md`,
  example graph copies of those templates, `.mdkg/work/mdkg-cli/SPEC.md`, and
  `WORK.md` / `WORK_ORDER.md` agent workflow fixtures.
- `node dist/cli.js validate --json`: `ok: true`, `warning_count: 0`,
  `error_count: 0` in this repo.
- `node dist/cli.js capability list --kind spec --json`: one spec capability,
  `root:spec.mdkg-cli` at `.mdkg/work/mdkg-cli/SPEC.md`.
- `node dist/cli.js spec list --json`: one spec capability,
  `root:spec.mdkg-cli`.
- `node dist/cli.js work validate --type spec --json`: one checked node,
  zero warnings, zero errors.

# Current Behavior Baseline

- `SPEC.md` is the only accepted filename for `type: spec` today.
  `MANIFEST.md` containing `type: spec` is read as a graph markdown file but
  fails validation with `spec files must be named SPEC.md`.
- Repos with no `SPEC.md` files remain valid. A fresh scratch agent repo
  validated with `ok: true`; `capability list --kind spec --json` and
  `spec list --json` both returned `count: 0`. The scratch repo emitted only
  the unrelated generated-cache warning before `mdkg index`.
- Existing invalid `SPEC.md` fixtures fail typed schema validation. The
  `invalid-role/SPEC.md` fixture reports `role must be one of orchestrator,
  subagent, standalone_agent, tool_service, remote_agent`.
- The live repo currently has one dogfood spec capability,
  `root:spec.mdkg-cli`, linked to `root:work.mdkg-cli.validate` and
  `root:order.goal-9-dogfood-trigger-task-291`.

# Audit Matrix

- Source discovery and parsing:
  `src/graph/workspace_files.ts` recursively includes every `.md` under
  mdkg `core`, `design`, and `work`, so future `MANIFEST.md` and duplicate
  sibling checks must account for both files entering the parser.
  `src/graph/node.ts` allows agent file types through `AGENT_FILE_TYPES`; node
  semantics are currently driven by `type: spec`, and `type: manifest` is not
  an allowed type.
- Agent file semantics:
  `src/graph/agent_file_types.ts` owns `AGENT_FILE_TYPES`,
  `AGENT_FILE_BASENAMES.spec = "SPEC.md"`, `validateAgentFileName`,
  `validateAgentFrontmatter`, spec attribute extraction, and diagnostics such
  as documentation-only `spec_kind` guidance. This is the primary bridge point
  for accepting `MANIFEST.md` while normalizing to spec/manifest semantics.
- Graph validation:
  `src/graph/validate_graph.ts` validates `work_contracts`, `agent_id`,
  subagent refs, work-order refs, receipt refs, disputes, proposals, and owner
  consistency using `node.type === "spec"` and `node.type === "work"`.
  Diagnostics currently say `SPEC.md` for missing subagent refs and related
  errors.
- Capability projection:
  `src/graph/capabilities_indexer.ts` emits `kind: "spec"` records with the
  `record.spec` payload and linkage to work contracts, orders, and receipts.
  `src/graph/capabilities_index_cache.ts`, `src/commands/capability.ts`, and
  `src/commands/spec.ts` consume that projection.
- CLI commands and help:
  `src/commands/spec.ts` prints `SPEC.md capabilities`, `SPEC not found`, and
  `SPEC reference is ambiguous`. `src/commands/work.ts` lets
  `work trigger` accept either a `WORK.md` ref or a `SPEC.md` capability ref.
  `src/commands/new.ts` scaffolds new spec files through
  `AGENT_FILE_BASENAMES`. `src/cli.ts` contains the user-facing help strings.
- Docs and generated docs:
  `README.md`, `CLI_COMMAND_MATRIX.md`, `docs/agent-runtime-0.0.9-handoff.md`,
  `docs/_generated/cli-reference.md`, and
  `docs/_generated/command-contract-summary.json` all contain SPEC-facing CLI
  or workflow text that must move to canonical MANIFEST language with legacy
  SPEC compatibility called out.
- Templates and examples:
  `.mdkg/templates/default/spec.md`, `.mdkg/templates/specs/*.SPEC.md`,
  `.mdkg/init-manifest.json`, and mirrored template copies under
  `examples/demo-agentic-coding` and `examples/template-mdkg-dev` are rename
  surfaces. Generated or bundled `dist/init/` assets must be refreshed by the
  build after source template changes.
- Fixtures and tests:
  `tests/commands/agent_file_types.test.ts`, `tests/commands/spec.test.ts`,
  `tests/graph/capabilities_indexer.test.ts`, `tests/pack/pack.test.ts`,
  `tests/helpers/templates.ts`, and `tests/fixtures/agent/**` cover no-SPEC
  repos, valid SPEC fixtures, invalid SPEC diagnostics, scaffolded filenames,
  capability records, and pack behavior.
- Skills and dogfood graph:
  `.mdkg/skills/author-mdkg-skill/SKILL.md`, mirrored `.agents`/`.claude`
  skill copies, `AGENT_START.md`, and `.mdkg/work/mdkg-cli/SPEC.md` mention
  `SPEC.md` as the capability surface. These need compatibility-aware wording,
  not behavior changes in this audit task.
- Package and release gates:
  `package.json` already has the relevant gates: `build`, `test`,
  `cli:check`, `cli:contract`, `smoke:capabilities`, `smoke:archive-work`,
  `smoke:bundle`, `smoke:subgraph`, and `docs:check`. No package script rename
  is required for the audit, but these gates must run after implementation.

# Legacy Compatibility Test Tags

- `legacy-spec-filename`: existing `SPEC.md` files and fixtures must still
  parse, index, validate, pack, and appear in capability results for one
  compatibility release.
- `manifest-canonical-filename`: new `MANIFEST.md` files should be accepted as
  the canonical filename and should normalize to the same internal capability
  semantics currently carried by `type: spec`.
- `manifest-type-spec-bridge`: `MANIFEST.md` with transitional `type: spec`
  should warn and normalize for one compatibility release.
- `duplicate-manifest-spec`: a logical unit containing both `MANIFEST.md` and a
  sibling `SPEC.md` must be a validation error.
- `legacy-spec-diagnostics`: schema and graph diagnostics for existing
  `SPEC.md` fixtures must remain actionable while wording moves toward
  canonical MANIFEST plus legacy SPEC alias language.
- `legacy-work-trigger`: `work trigger` must continue to resolve legacy SPEC
  capability refs with exactly one resolvable `WORK.md` contract.

# Test Plan

- `rg -n "SPEC\\.md|MANIFEST\\.md|type: spec|type: manifest|OmniFileKind|WORK_ORDER\\.md|WORK\\.md|manifest" src tests docs .mdkg README.md CLI_COMMAND_MATRIX.md`
- `node dist/cli.js validate --json`
- `node dist/cli.js capability list --kind spec --json`

# Links / Artifacts

- `goal-37`
- `edd-54`
- `dec-50`
