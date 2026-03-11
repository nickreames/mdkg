---
id: edd-2
type: edd
title: mdkg 0.0.4 architecture indexing validation packs skills
tags: [architecture, v0_4, indexing, validation, pack, skills]
owners: []
links: []
artifacts: []
relates: [edd-1, prd-1, prd-2, dec-8, dec-9, dec-10, epic-4, epic-5, edd-3, edd-4, edd-5, edd-6, edd-7, edd-8]
refs: []
aliases: [doc-2, 0.0.4-architecture, skills.json, human.md, events.jsonl]
created: 2026-02-27
updated: 2026-03-05
---

# Overview

This document is the canonical technical blueprint for mdkg 0.0.4 architecture.

For 0.0.4 agent memory behavior guidance (semantic/procedural/episodic usage model and external orchestrator commit cadence), see `edd-3`.
For init-omni scaffold and pin/update contract details, see `edd-4`.
For practical skills authoring/integration usage guidance, see `edd-5`.
For detailed episodic logging and checkpoint operational guidance, see `edd-6`.
For standards-alignment and research snapshot context, see `edd-7`.
For external orchestrator minimal contract details, see `edd-8`.

Scope:
- node and skill discovery/indexing
- schema and graph validation
- deterministic pack generation
- `init --omni` agent-ready scaffolding design
- episodic log + checkpoint scaffolding guidance

Current architecture baseline is **v0.0.3** (source-truth implementation), not a generalized `v0.3` line.

Non-goals:
- no vector DB
- no daemon
- no hosted indexing service
- no required git operations beyond user environment

Current baseline behaviors (v0.0.3):
- node indexing to `.mdkg/index/global.json`
- query operations (`show/list/search`) over node index
- deterministic pack generation with limits and truncation reporting
- strict frontmatter parsing with restricted value types (string, bool, flat lists)

## Current source gaps (2026-03-05)

| Capability | 0.0.4 target | current behavior | source anchor |
| --- | --- | --- | --- |
| Omni bootstrap flag | `mdkg init --omni` | implemented | `src/cli.ts`, `src/commands/init.ts` |
| Skill discovery/indexing | `.mdkg/skills/**/SKILL.md` -> `.mdkg/index/skills.json` | implemented | `src/graph/skills_indexer.ts`, `src/graph/skills_index_cache.ts`, `src/commands/index.ts` |
| Skill metadata schema | required skill frontmatter + optional flattened `ochatr_*` | implemented (flattened keys only) | `src/graph/skills_indexer.ts` |
| Node -> skill references | optional `skills: [...]` on work-item nodes | implemented + validated | `src/graph/node.ts`, `src/commands/validate.ts`, `src/graph/frontmatter.ts` |
| Skills query/display | skill-aware list/show/search capability | implemented under existing command family | `src/commands/list.ts`, `src/commands/show.ts`, `src/commands/search.ts` |
| Stage-tag query filtering | skills discovery by stage/risk tags | implemented (`--tags`, `--tags-mode`) | `src/commands/list.ts`, `src/commands/search.ts`, `src/util/filter.ts`, `src/cli.ts` |
| Pack skill inclusion | optional skill inclusion policy | implemented (`--skills`, `--skills-depth`) | `src/commands/pack.ts`, `src/cli.ts` |
| Core pin behavior | ID-only pin list semantics | implemented (unchanged canonical behavior) | `src/pack/verbose_core.ts`, `src/util/qid.ts` |
| Episodic logs | `.mdkg/work/events/events.jsonl` scaffold conventions | implemented validate-time JSONL schema checks | `src/commands/validate.ts` |
| Latest checkpoint index hint | optional `latest_checkpoint_qid` metadata hint | implemented with pack-time authoritative resolver | `src/graph/indexer.ts`, `src/pack/pack.ts` |

# Architecture

## 0.0.4 extension model

0.0.4 extends mdkg into deterministic semantic + procedural + episodic memory with file-first architecture.

Subsystem additions:
1. Node indexer (existing): `.mdkg/index/global.json`
2. Skill indexer (new): `.mdkg/index/skills.json`
3. Pack assembler extension (new): optional skill payload selection
4. Omni bootstrap extension (new): `init --omni` scaffolding contract
5. Episodic scaffold conventions (new): `events.jsonl` + checkpoints

## Indexing execution flow

Indexing remains deterministic and file-local.

Execution model (locked):
- sequential subpass A: node index build/update
- sequential subpass B: skill index build/update

No parallelized index jobs are required in 0.0.4.

## Node indexer

Inputs:
- `.mdkg/core/**/*.md`
- `.mdkg/design/**/*.md`
- `.mdkg/work/**/*.md`
- registered workspaces under existing config model

Output:
- `.mdkg/index/global.json`

Responsibilities:
- parse strict frontmatter
- produce node records and graph edges
- keep deterministic ordering/serialization
- preserve stale-index auto-rebuild semantics on query operations

## Skill indexer (new)

Inputs:
- root-owned `.mdkg/skills/**/SKILL.md`

Output:
- `.mdkg/index/skills.json` (separate from `global.json`)

Responsibilities:
- scan skill folders deterministically
- parse metadata from `SKILL.md` frontmatter
- capture folder slug and indexable fields
- include capability flags such as `has_scripts` and `has_references`
- include flattened optional `ochatr_*` metadata when present

Progressive disclosure rule:
- `skills.json` stores metadata only
- full SKILL.md body is loaded only for explicit detail inclusion paths

## Pack assembly target behavior

Deterministic order target for 0.0.4:
1. pack header metadata
2. root node
3. pinned core docs (ID order from `core.md` as resolved)
4. related nodes by traversal/order rules
5. skills payload (if included by policy)
6. footer/stats references

Truncation priority target:
- preserve core constraints and root context first
- truncate related nodes before core constraints
- include skills last unless explicitly requested

## Omni bootstrap target behavior

Command signature target:
- `mdkg init --omni [--llm] [--update-gitignore] [--update-npmignore]`

Scaffold target (if missing):
- `.mdkg/core/SOUL.md` (strict node)
- `.mdkg/core/HUMAN.md` (strict node)
- `.mdkg/skills/` scaffold with one standards-compliant sample mdkg skill
- `.mdkg/work/events/events.jsonl` with first valid init event line

Core pin semantics remain ID-only:
- `core.md` should pin node IDs, not filenames/paths

# Data model

## Node model (baseline)

Node model remains unchanged at core:
- required: `id`, `type`, `title`, `created`, `updated`
- optional work fields: `status`, `priority`
- optional graph fields: `epic`, `parent`, `relates`, `blocked_by`, `blocks`, `prev`, `next`
- metadata fields: `links`, `artifacts`, `refs`, `aliases`

## Node extension target: skill references

0.0.4 target adds an optional work-item field:
- `skills: [<skill-slug>, ...]`

Semantics:
- declares procedural memory dependencies for executing the node
- consumed by validation and optional pack inclusion policy

Illustrative node frontmatter extension (non-implemented target):

```md
---
id: task-99
type: task
title: example task with procedural context
status: todo
priority: 1
skills: [persist-memory, mdkg-core]
created: 2026-02-27
updated: 2026-02-27
---
```

## Skill model (indexed artifact)

Skill path model:
- `.mdkg/skills/<skill-slug>/SKILL.md`

Required SKILL frontmatter fields:
- `name`
- `description`

Optional fields:
- `tags`, `version`, `authors`, `links`
- flattened optional routing/policy keys (e.g., `ochatr_tools`, `ochatr_policies`)

Canonical SKILL frontmatter example:

```md
---
name: mdkg core workflow
description: deterministic mdkg workflow for planning and documentation updates
tags: [mdkg, persist-memory, workflow]
version: 0.1.0
authors: [mdkg-maintainers]
links: [https://github.com/nickreames/mdkg]
ochatr_tools: [mdkg, git, node]
ochatr_policies: [no-secrets, deterministic-first]
---
```

Canonical `skills.json` example:

```json
{
  "meta": {
    "tool": "mdkg",
    "schema_version": 1,
    "generated_at": "2026-02-27T00:00:00.000Z",
    "root": "/repo"
  },
  "skills": [
    {
      "slug": "mdkg-core",
      "name": "mdkg core workflow",
      "description": "deterministic mdkg workflow for planning and documentation updates",
      "tags": ["mdkg", "persist-memory", "workflow"],
      "version": "0.1.0",
      "path": ".mdkg/skills/mdkg-core/SKILL.md",
      "has_scripts": true,
      "has_references": true,
      "ochatr_tools": ["mdkg", "git", "node"],
      "ochatr_policies": ["no-secrets", "deterministic-first"]
    }
  ]
}
```

Canonical seeded `events.jsonl` first line example:

```json
{"ts":"2026-03-04T00:00:00.000Z","run_id":"init-20260304-000000","workspace":"root","agent":"mdkg","kind":"RUN_STARTED","status":"ok","refs":["edd-4"],"artifacts":[],"notes":"init omni scaffold target initialized","redacted":true}
```

# APIs / interfaces

## Capability contracts (0.0.4 target)

Indexing capabilities:
- produce deterministic `global.json` and `skills.json`
- preserve stale-index rebuild semantics

Validation capabilities:
- node validation (existing)
- skill validation pass (new)
- node->skill cross-reference validation (new)

Query capabilities:
- discover skills in list/search/show workflows
- allow metadata-only and full skill body views
- support planned tag-filter capability for skills discovery (`--tags`, `--tags-mode`)

Pack capabilities:
- optional skill inclusion policies
- metadata-only or full skill inclusion depth
- deterministic ordering and truncation behavior
- default inclusion of the most recent checkpoint when available
- optional `latest_checkpoint_qid` hint as optimization with pack-time authoritative resolution

Init capabilities:
- omni scaffolding target with SOUL/HUMAN core nodes, skills scaffold (no required default sample skill file), and seeded events line

Operational model:
- single-writer and batching guidance is documentation for external orchestrators in 0.0.4, not runtime enforcement inside mdkg

## CLI naming policy in this EDD

- Exact skills/events CLI names remain deferred.
- Any command/flag examples in 0.0.4 docs are non-normative illustrations.
- `init --omni` remains the explicit planned flag name.

Non-normative examples:
- `mdkg skill list --tags stage:plan --tags-mode all`
- `mdkg skill show <slug>`
- `mdkg skill search "checkpoint" --tags stage:review --json`
- `mdkg pack <id> --skills auto --skills-depth meta`

# Failure modes

- Frontmatter parser rejects nested maps; non-flattened optional metadata would fail strict parsing.
- Adding `skills` node field without template/schema alignment will fail validation/indexing.
- Treating `core.md` pins as file paths instead of IDs breaks current resolution semantics.
- Skills included too early in pack assembly can crowd out core constraints.
- Missing skill slugs in node `skills` references create dangling procedural dependencies.
- Ambiguous query resolution for skills/nodes must remain deterministic and explicit.

# Observability

- Deterministic index outputs for identical repo state.
- Deterministic pack contents/order for identical root+flags.
- Validation output explicitly distinguishes hard errors from warnings.
- Staleness/rebuild behavior remains inspectable through existing CLI messaging.

# Security / privacy

- `.mdkg/index/` and `.mdkg/pack/` remain non-source cache/artifact areas.
- `.mdkg/` content should not be shipped in runtime build artifacts or npm tarballs.
- Skills and event logs may contain sensitive operational detail; docs must continue to enforce no-secrets guidance.
- Episodic event defaults should be redacted-safe from first scaffolded line.

# Testing strategy

- Keep `mdkg validate` as main quality gate for documentation graph correctness.
- Add 0.0.4-target coverage for skill indexing and cross-validation contracts.
- Add pack determinism checks with/without skill inclusion.
- Add omni scaffold acceptance checks for SOUL/HUMAN/skills scaffold/seeded events format.
- Ensure CLI help remains unchanged in this docs-only pass.

# Rollout plan

Implementation sequence for 0.0.4 architecture work:
1. Extend index architecture to produce `skills.json` in a deterministic sequential subpass.
2. Extend validation with skill schema checks and node->skill cross-validation.
3. Extend query/display capabilities for skill discovery and inspection.
4. Extend pack engine with optional skill inclusion policy and deterministic ordering.
5. Extend `init --omni` scaffolding (SOUL/HUMAN core nodes, skills scaffold, seeded events).
6. Keep docs/rules/roadmap nodes aligned to source-truth during rollout.
7. Add stage-tag filtering + policy gating contract coverage (`task-50`, `task-51`, `test-20`).
8. Add hybrid checkpoint hint coverage (`task-52`, `test-21`, `test-22`).

Roadmap linkage:
- existing: `task-33` through `task-40`, `test-9` through `test-11`
- added gap coverage: `task-41`, `task-42`, `test-12`, `test-13`
- memory-model orchestration guidance coverage: `task-43`, `test-14` (see `edd-3`)
