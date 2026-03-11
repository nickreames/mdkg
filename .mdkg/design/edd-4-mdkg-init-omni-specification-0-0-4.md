---
id: edd-4
type: edd
title: mdkg init omni specification 0.0.4
tags: [architecture, v0_4, init, omni, bootstrap]
owners: []
links: []
artifacts: []
relates: [prd-1, prd-2, dec-8, dec-9, edd-2, edd-3, edd-5, edd-6, epic-4]
refs: []
aliases: [doc-6, init-omni-spec, omni-bootstrap]
created: 2026-03-04
updated: 2026-03-05
---

# Overview

This document defines the 0.0.4 `mdkg init --omni` contract as an opinionated, minimal bootstrap that makes a repo agent-ready while preserving mdkg determinism and source-truth policy.

For episodic logging operational guidance beyond scaffold semantics, see `edd-6`.

Scope:
- command contract for `init --omni`
- scaffolded files/directories for SOUL/HUMAN/skills/events
- core pin update behavior (ID-only)
- ignore/safety defaults and post-init expectations

Non-goals:
- no `.mdkg/twin/` contract in 0.0.4 (canonical HUMAN is under `.mdkg/core/`)
- no markdown readme under `.mdkg/work/events/` due strict-node parsing implications

## Current source status (2026-03-05)

| Capability | 0.0.4 target | Current source behavior | Source anchor |
| --- | --- | --- | --- |
| Omni init flag | `mdkg init --omni` | implemented in CLI parsing/help and init command | `src/cli.ts`, `src/commands/init.ts` |
| Omni scaffold outputs | SOUL/HUMAN core nodes, skills scaffold, events path | implemented with create-if-missing semantics and force-aware overwrite behavior | `src/commands/init.ts` |
| Core pin update logic | ensure SOUL/HUMAN IDs in `.mdkg/core/core.md` without duplicates | implemented as deterministic ID-only insertion with stable remaining order | `src/commands/init.ts`, `src/pack/verbose_core.ts` |
| Events ignore guidance | include `.mdkg/work/events/*.jsonl` in gitignore updates | implemented in default init ignore updates | `src/commands/init.ts` |
| Example skill scaffold | optional example SKILL package (not required by default) | optional-only remains allowed; default scaffold does not require example skill file | `src/commands/init.ts`, `src/graph/workspace_files.ts` |
| Event docs placement safety | event guidance available without strict-node parse failures | any markdown file under `.mdkg/work/**` is treated as node input | `src/graph/workspace_files.ts`, `src/commands/validate.ts` |

# Architecture

## Command interface (target)

Primary command:
- `mdkg init --omni`

Compatible flags:
- `--llm` (existing compatibility)
- `--update-gitignore` (existing)
- `--update-npmignore` (existing)
- `--force` (existing overwrite behavior)

Deferred/non-goal for 0.0.4:
- no new example-skill toggle is required in 0.0.4 contract docs.

Behavior constraints:
- safe by default (no overwrite without `--force`)
- deterministic output structure
- minimal scaffold footprint

## Scaffold contract (target)

If missing, init creates:
- `.mdkg/skills/`
- `.mdkg/work/events/`

If missing, init creates strict node docs:
- `.mdkg/core/SOUL.md`
- `.mdkg/core/HUMAN.md`

If missing, init creates docs/supporting artifacts:
- `.mdkg/skills/registry.md` (human-readable skills index guidance)
- optional example skill creation is allowed but not required by default

Event-log guidance location:
- do not create `.mdkg/work/events/*.md` guidance files
- place event-log usage guidance in root `README.md` and/or core docs to avoid strict-node parsing failures under `.mdkg/work/`

## Core pin behavior

Core pin list remains ID-only (`.mdkg/core/core.md`).

`init --omni` must:
- ensure SOUL/HUMAN node IDs are present in `core.md`
- avoid duplicate pin entries
- place SOUL/HUMAN pin IDs near the top of list for deterministic constraint-first loading
- avoid path-style entries in pin list

Pack implications (target-state):
- verbose/core inclusion resolves by node ID
- SOUL/HUMAN should be loaded before most work-item context

# Data model

## SOUL and HUMAN strict-node contract

`SOUL.md` and `HUMAN.md` are markdown nodes with strict frontmatter:
- schema-compliant `id`, `type`, `title`, `created`, `updated`
- additional keys must remain valid for selected template/type schema

`SOUL.md` template sections should include:
- Identity
- Purpose
- Constraints / never-do
- Approval policy
- Memory contract
- Tool usage contract
- Commit contract

`HUMAN.md` template sections should include:
- Who I am
- Current goals
- Preferences
- Boundaries
- Expertise map
- Working cadence (optional)

First-run question prompts should be embedded in HUMAN content:
- top 3 goals
- never-do without confirmation
- preferred code/review style
- expected environment and test commands

## Skills scaffold contract

Required scaffold:
- `.mdkg/skills/` directory
- `.mdkg/skills/registry.md` guidance file

Optional example skill:
- may be created by implementation, but is not a required default artifact in 0.0.4 docs
- if created, it should be standards-compliant and indexable (`name`, `description`)

## Events scaffold contract

Event log path:
- `.mdkg/work/events/events.jsonl`

Seeded first-line target (if seeded):
- valid JSONL object with redacted-safe defaults
- event type indicating omni init bootstrap

# APIs / interfaces

Implemented init capability contract:
- `mdkg init --omni [--llm] [--no-update-ignores] [--update-gitignore] [--update-npmignore] [--force]`

Safety/ignore contract (target):
- default init behavior updates `.gitignore` with `.mdkg/index/`, `.mdkg/pack/`, and `.mdkg/work/events/*.jsonl`
- `--no-update-ignores` disables default ignore updates
- explicit `--update-gitignore`/`--update-npmignore`/`--update-dockerignore` flags force writes
- `--update-npmignore` remains aligned with publish safety (exclude `.mdkg/` content)
- publish docs continue to prefer strict `package.json.files` allowlist

Post-init behavior expectations:
- `mdkg index` succeeds
- `mdkg validate` succeeds
- `mdkg pack <id> --verbose` includes pinned SOUL/HUMAN IDs once present

CLI naming policy:
- no new skills/events command names are introduced here
- examples for non-implemented behavior remain non-normative

# Failure modes

- Creating HUMAN under `.mdkg/twin/` would violate locked canonical path and fragment docs.
- Pinning file paths instead of IDs would break current `core.md` semantics.
- Writing markdown docs under `.mdkg/work/events/` would be parsed as strict nodes and fail validation.
- Missing/invalid SOUL/HUMAN frontmatter would break index/validate.
- Optional example skill (when present) not being standards-compliant would fail future skill discovery/validation contracts.
- Overwriting user-edited SOUL/HUMAN without `--force` would violate safety guarantees.

# Observability

- init output should report created vs skipped files deterministically.
- post-init checks should produce stable, inspectable results via existing commands (`index`, `validate`, `pack --verbose`).
- core pin list updates should be auditable through git diffs and deterministic ordering.

# Security / privacy

- keep event logs redacted by default and typically gitignored
- keep `.mdkg/index/` and `.mdkg/pack/` ignored
- avoid secrets in SOUL/HUMAN/skills templates
- preserve package publishing boundaries to prevent accidental `.mdkg` shipment

# Testing strategy

Docs integration checks:
- `mdkg validate` passes with `edd-4` and linked roadmap nodes
- `mdkg list --type edd` includes `edd-4`
- `mdkg show edd-4 --body` reflects canonical HUMAN path + ID-only core pins

Future implementation checks:
- init omni scaffold + safety behavior (`test-9`)
- scaffold/pin contract + event-doc placement safety (`test-17`)
- ignore defaults including events JSONL (`task-34`, `test-9`)

# Rollout plan

For this pass:
- documentation/work-node integration only
- no runtime code changes

Recommended implementation sequence:
1. add `--omni` flag and help wiring
2. add scaffold generation for SOUL/HUMAN/skills/events with safe overwrite behavior
3. implement deterministic core pin ID insertion/update logic
4. implement ignore update additions including events JSONL pattern
5. add acceptance tests for scaffold contract, pins, and post-init validation

Doc tracking:
- this document is `edd-4` for init omni specification
- practical skills usage guide is captured in `edd-5`
