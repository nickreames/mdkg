---
id: edd-3
type: edd
title: mdkg agent memory model deterministic memory skills events
tags: [architecture, v0_4, memory-model, agents]
owners: []
links: []
artifacts: []
relates: [edd-2, prd-1, prd-2, dec-8, dec-9, dec-10, epic-4, epic-5, edd-4, edd-5, edd-6, edd-7, edd-8]
refs: []
aliases: [doc-3, agent-memory-model, deterministic-memory, single-writer, human.md, skills.json, events.jsonl]
created: 2026-02-27
updated: 2026-03-05
---

# Overview

This document defines the canonical v0.4 memory model for mdkg as a deterministic, file-based substrate for agents and humans.

Core thesis:
- semantic memory stores stable truth
- procedural memory stores repeatable workflows
- episodic memory stores what happened and when

This model targets lower cost, higher debuggability, and reproducibility compared with vector-first memory approaches.

Scope:
- deterministic retrieval strategy for agents
- procedural memory via skills
- episodic memory via events + checkpoints
- safe memory update guidance for orchestrators

Non-goals:
- no vector DB requirement in v0.4
- no daemon/background state
- no hosted mdkg services
- no mdkg-managed agent runtime

Current architecture baseline is v0.0.3. Existing source now supports most v0.4 skills and episodic capabilities, with runtime commit-policy enforcement still pending.

## Current source gaps (2026-03-05)

| Capability | v0.4 memory-model target | Current source behavior | Source anchor |
| --- | --- | --- | --- |
| Procedural memory index | skills metadata index at `.mdkg/index/skills.json` | implemented via separate deterministic skills index artifact | `src/commands/index.ts`, `src/graph/skills_indexer.ts`, `src/graph/skills_index_cache.ts` |
| Skill-aware retrieval | skills discoverable via list/show/search capabilities | implemented via existing command family (`list/show/search`) | `src/commands/list.ts`, `src/commands/show.ts`, `src/commands/search.ts`, `src/cli.ts` |
| Node -> skill references | optional `skills: [...]` on work items | implemented in parser/model/new command with cross-validation | `src/graph/frontmatter.ts`, `src/graph/node.ts`, `src/commands/new.ts`, `src/commands/validate.ts` |
| Pack procedural layer | policy-driven optional skill payload inclusion | implemented via `--skills` and `--skills-depth` pack flags | `src/commands/pack.ts`, `src/pack/pack.ts`, `src/cli.ts` |
| Omni scaffold for core memory anchors | `init --omni` target with SOUL/HUMAN/skills scaffold/events seed | implemented in init with strict-node SOUL/HUMAN and seeded events JSONL | `src/commands/init.ts`, `src/cli.ts` |
| Episodic event logs | append-only `.mdkg/work/events/events.jsonl` conventions | implemented validate-time JSONL schema checks; dedicated events command surface still absent | `src/commands/validate.ts`, `src/cli.ts` |
| Checkpoint linkage to runs/events | checkpoint guidance referencing run/event ranges | checkpoint command creates nodes but no events coupling contract | `src/commands/checkpoint.ts`, `src/commands/validate.ts` |
| Latest checkpoint hybrid strategy | pack-time authoritative selection with optional index hint | implemented resolver + `latest_checkpoint_qid` hint emission | `src/graph/indexer.ts`, `src/pack/pack.ts`, `src/commands/pack.ts` |
| Single-writer/batching policy | explicit external orchestrator guidance | no runtime enforcement in mdkg CLI (documentation policy only) | `src/commands/init.ts`, `src/commands/pack.ts`, `src/commands/checkpoint.ts` |

# Architecture

mdkg v0.4 memory model is a deterministic three-layer stack:

1. Semantic memory (stable truth)
- markdown nodes in `.mdkg/core`, `.mdkg/design`, `.mdkg/work`
- explicit graph edges and strict frontmatter
- deterministic retrieval via pack/show/search

2. Procedural memory (how to act)
- skill packages at `.mdkg/skills/<slug>/SKILL.md`
- metadata indexed locally (skills index), full skill bodies loaded on demand
- work-item `skills` references select relevant procedures
- stage-aware skill routing uses hybrid gating guidance (query-time tags + policy-time orchestrator controls)

3. Episodic memory (what happened)
- append-only JSONL events (usually gitignored)
- committed checkpoint nodes as compressed summaries

Retrieval policy:
- always anchor on semantic constraints first
- include procedural skills by policy (not always by default)
- include the most recent checkpoint by default when available

Update policy:
- single-writer and commit-cadence rules are guidance for external orchestrators (human or platform runtime), not mdkg runtime enforcement in v0.4.

Recommended external orchestrator flow:
1. retrieve deterministic semantic context (`pack` + pinned core docs)
2. load required procedural skills
3. execute work and collect artifacts
4. append episodic events (if enabled)
5. update node/checkpoint memory
6. batch and commit once per run or milestone

# Data model

## Semantic layer model (nodes)

Node model stays strict:
- required: `id`, `type`, `title`, `created`, `updated`
- graph fields: `epic`, `parent`, `relates`, `blocked_by`, `blocks`, `prev`, `next`
- work fields: `status`, `priority`

Planned extension for work items:

```md
---
id: task-17
type: task
title: stabilize release checklist
status: todo
priority: 1
skills: [review-pr, run-tests]
created: 2026-02-27
updated: 2026-02-27
---
```

## Procedural layer model (skills)

Skill package path:
- `.mdkg/skills/<slug>/SKILL.md`

Required frontmatter:
- `name`
- `description`

Optional frontmatter:
- `tags`, `version`, `authors`, `links`
- flattened optional `ochatr_*` policy/routing keys

Canonical SKILL frontmatter:

```md
---
name: review pull requests
description: deterministic review workflow for mdkg changes
tags: [review, quality, mdkg]
version: 0.1.0
authors: [mdkg-maintainers]
links: [https://github.com/nickreames/mdkg]
ochatr_tools: [git, mdkg]
ochatr_policies: [no-secrets, deterministic-first]
---
```

Canonical `skills.json` record shape:

```json
{
  "slug": "review-pr",
  "name": "review pull requests",
  "description": "deterministic review workflow for mdkg changes",
  "tags": ["review", "quality", "mdkg"],
  "version": "0.1.0",
  "path": ".mdkg/skills/review-pr/SKILL.md",
  "has_scripts": false,
  "has_references": false,
  "ochatr_tools": ["git", "mdkg"],
  "ochatr_policies": ["no-secrets", "deterministic-first"]
}
```

## Episodic layer model (events + checkpoints)

Event log path target:
- `.mdkg/work/events/events.jsonl`

Canonical seeded first line (init target):

```json
{"ts":"2026-03-04T00:00:00.000Z","run_id":"init-20260304-000000","workspace":"root","agent":"mdkg","kind":"RUN_STARTED","status":"ok","refs":["edd-4"],"artifacts":[],"notes":"init omni scaffold target initialized","redacted":true}
```

Checkpoint nodes remain semantic records of episodic compression. They should summarize event ranges/run IDs through references rather than embedding raw logs.

# APIs / interfaces

Capability contracts for v0.4:
- semantic retrieval remains deterministic (`pack`, `show`, `search`)
- procedural memory discovery and inclusion are policy-driven
- episodic memory uses JSONL events + checkpoint summaries
- update safety guidance is documented for external orchestrators
- skills capabilities remain on existing command families; no new top-level skills namespace in v0.4 docs

Normative policy points:
- exact new skills/events command names stay deferred
- command examples are non-binding illustrations
- `init --omni` is implemented; `--llm` compatibility is retained

Non-normative examples:
- `mdkg pack task-17 --verbose`
- `mdkg list --type skill --tags stage:plan --tags-mode all`
- `mdkg pack task-17 --skills auto --skills-depth full`
- `mdkg show skill:review-pr`

Pack inclusion policy expectations:
- root context first
- pinned core docs second
- related nodes third
- skills after related nodes unless explicitly elevated by policy
- include the most recent checkpoint by default (if a checkpoint exists)
- pack-time resolver remains authoritative for latest checkpoint selection; optional `latest_checkpoint_qid` index hint is optimization only

# Failure modes

- Procedural mismatch: node references missing skills (`skills` slug not found).
- Context bloat: over-including full skills/logs makes packs expensive.
- Memory drift: agents rely on chat memory instead of semantic anchors.
- Commit spam: committing on every tool action reduces signal and trust.
- Multi-writer conflicts: concurrent memory edits clobber state.
- Secret leakage: raw event logs or skill artifacts include sensitive text.
- Schema incompatibility: nested metadata maps break strict parser expectations.

# Observability

- Deterministic outputs from index and pack for identical repo state + flags.
- Validation diagnostics should identify missing skill references and malformed artifacts deterministically.
- Event log consumers should emit stable fields (`ts`, `event`, `run_id`, `status`, `redacted`).
- Checkpoints should explicitly reference covered scope/run IDs for provenance.
- If checkpoint hint metadata exists, observability should report hint-vs-resolver agreement for debugging.

# Security / privacy

- Keep `.mdkg/index/` and `.mdkg/pack/` ignored by default.
- Treat event logs as redacted-by-default operational traces.
- Keep skills and docs free of secrets.
- Keep mdkg memory artifacts out of production package outputs.
- Preserve explicit boundaries: committed semantic/checkpoint memory vs optional gitignored episodic logs.

# Testing strategy

Documentation integration checks:
- `mdkg validate` passes with `edd-3` and linked node updates
- `mdkg list --type edd` includes `edd-3`
- `mdkg show edd-3 --body` includes canonical schema examples and source gap mapping

Future implementation checks:
- skill metadata indexing and discovery contracts (`test-10`, `test-12`)
- node->skill cross-validation (`test-13`)
- init omni + seeded event behavior (`test-9`, `test-11`)
- pack determinism with policy-driven skill inclusion (`test-10`)
- stage-tag filtering and policy gating contracts (`test-20`)
- hybrid checkpoint hint consistency contracts (`test-21`, `test-22`)
- external orchestrator run/event/artifact contract (`test-24`)

# Rollout plan

Implementation status in current source:
1. skill metadata index + deterministic query surfaces implemented
2. node `skills` schema and cross-validation implemented
3. policy-driven pack skill inclusion implemented
4. `init --omni` scaffolding implemented (SOUL/HUMAN/skills scaffold/events seed)
5. episodic validation/guardrails implemented at validate-time (events command surface still deferred)
6. stage-tag skill discovery filters implemented
7. hybrid latest-checkpoint resolver + optional hint metadata path implemented

Doc tracking:
- this document is `edd-3` for v0.4 memory model
- decision philosophy rollup is captured in `dec-9`
- skills integration usage guidance is captured in `edd-5`
