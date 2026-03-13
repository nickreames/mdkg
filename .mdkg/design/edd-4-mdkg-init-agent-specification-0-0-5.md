---
id: edd-4
type: edd
title: mdkg init agent specification 0.0.5
tags: [architecture, 0_0_5, init, agent, bootstrap]
owners: []
links: []
artifacts: [src/commands/init.ts, src/commands/skill_mirror.ts, AGENT_START.md, assets/init/AGENT_START.md]
relates: [prd-1, prd-2, dec-16, dec-17, dec-18, edd-2, edd-3, edd-5, edd-6, epic-14]
refs: []
aliases: [doc-6, init-agent-spec, agent-bootstrap]
created: 2026-03-04
updated: 2026-03-10
---

# Overview

This document defines the current `mdkg init --agent` contract as the minimal, generic AI-agent bootstrap for mdkg.

For episodic logging operational guidance beyond scaffold semantics, see `edd-6`.

Scope:
- command contract for `init --agent`
- scaffolded files/directories for SOUL/HUMAN/skills/events
- shared startup guidance and wrapper docs
- safe product-specific skill mirror behavior
- core pin update behavior (ID-only)
- ignore/safety defaults and post-init expectations

Non-goals:
- no `.mdkg/twin/` contract
- no `agents/openai.yaml` generation in this wave
- no markdown readme under `.mdkg/work/events/`

## Current source status (2026-03-10)

| Capability | 0.0.5 target | Current source behavior | Source anchor |
| --- | --- | --- | --- |
| Agent init flag | `mdkg init --agent` | implemented in CLI parsing/help and init command | `src/cli.ts`, `src/commands/init.ts` |
| Removed Omni flag | `mdkg init --omni` removed | implemented with explicit migration error to `--agent` | `src/cli.ts` |
| Shared startup artifact | `AGENT_START.md` plus wrapper docs | implemented in root docs and init assets | `src/commands/init.ts`, `assets/init/AGENT_START.md` |
| Core agent scaffold outputs | SOUL/HUMAN core nodes, skills scaffold, events path | implemented with create-if-missing semantics and force-aware overwrite behavior | `src/commands/init.ts` |
| Skill mirrors | `.agents/skills/` and `.claude/skills/` materialized from canonical skills | implemented with append-focused sync and validate-time drift warnings | `src/commands/skill_mirror.ts`, `src/commands/skill.ts`, `src/commands/validate.ts` |
| Core pin update logic | ensure SOUL/HUMAN IDs in `.mdkg/core/core.md` without duplicates | implemented as deterministic ID-only insertion with stable remaining order | `src/commands/init.ts`, `src/pack/verbose_core.ts` |
| Seeded default skills | seed three canonical mdkg usage skills into `.mdkg/skills/` on `init --agent` | implemented via init asset copy + registry refresh + mirror sync | `src/commands/init.ts`, `dist/init/skills/default`, `src/commands/skill_support.ts` |
| Events default guidance | create committed-by-default `events.jsonl` and leave `.gitignore` unchanged | implemented in current init + event enable behavior | `src/commands/init.ts`, `src/commands/event.ts`, `src/commands/event_support.ts` |

# Architecture

## Command interface

Primary command:
- `mdkg init --agent`

Compatible flags:
- `--llm`
- `--update-gitignore`
- `--update-npmignore`
- `--update-dockerignore`
- `--force`

Behavior constraints:
- safe by default (no overwrite without `--force`)
- deterministic output structure
- minimal scaffold footprint
- `--agent` remains independent from `--llm`

## Scaffold contract

If missing, init creates:
- `.mdkg/skills/`
- `.mdkg/work/events/`
- `.agents/skills/`
- `.claude/skills/`

If missing, init creates strict node docs:
- `.mdkg/core/SOUL.md`
- `.mdkg/core/HUMAN.md`

If requested or missing under the relevant bootstrap path, init creates docs/supporting artifacts:
- `AGENT_START.md`
- `AGENTS.md`
- `CLAUDE.md`
- `llms.txt`
- `CLI_COMMAND_MATRIX.md`
- `.mdkg/skills/registry.md`

Event-log guidance location:
- do not create `.mdkg/work/events/*.md` guidance files
- keep event-log usage guidance in root docs and core docs instead

## Startup guidance contract

`AGENT_START.md` is the canonical instant-start artifact.

It must reference:
- `.mdkg/core/SOUL.md`
- `.mdkg/core/HUMAN.md`
- `.mdkg/README.md`
- `CLI_COMMAND_MATRIX.md`
- `select-work-and-ground-context`

`AGENTS.md`, `CLAUDE.md`, and `llms.txt` are thin wrappers that point agents to `AGENT_START.md`.

## Skill mirror contract

Canonical source:
- `.mdkg/skills/`

Mirrors:
- `.agents/skills/`
- `.claude/skills/`

Behavior:
- mirrors contain materialized copies, not symlinks
- create roots only if missing
- preserve unrelated existing files/folders
- manage only mdkg-owned mirrored skill slugs
- fail on same-slug unmanaged collisions unless explicit `--force` is used through `mdkg skill sync`
- `mdkg validate` warns on drift; it does not auto-repair silently

# Data model

## SOUL and HUMAN strict-node contract

`SOUL.md` and `HUMAN.md` are markdown nodes with strict frontmatter.

Pinned IDs:
- `rule-soul`
- `rule-human`

## Shared startup doc contract

`AGENT_START.md` is a repo-level startup contract, not a strict mdkg node. It exists to shorten the time from agent entry to correct first action.

## Skill mirror payload contract

Mirrored skill trees include only:
- `SKILL.md`
- `references/`
- `assets/`
- `scripts/` when present

# APIs / interfaces

Implemented init capability contract:
- `mdkg init --agent [--llm] [--no-update-ignores] [--update-gitignore] [--update-npmignore] [--force]`

Implemented mirror capability contract:
- `mdkg skill sync [--force]`

Safety/ignore contract:
- default init behavior updates `.gitignore` with `.mdkg/index/` and `.mdkg/pack/`
- `--no-update-ignores` disables default ignore updates
- explicit update flags force writes even with global opt-out
- `events.jsonl` is created and committed by default for `--agent` repos
- `mdkg event enable` recreates the file if missing and does not edit ignore files

# Failure modes

- Creating HUMAN outside `.mdkg/core/` violates the current canonical path.
- Pinning file paths instead of IDs breaks `core.md` semantics.
- Writing markdown docs under `.mdkg/work/events/` creates parse failures.
- Treating mirrored skill folders as canonical edit locations creates drift.
- Auto-deleting unknown mirror folders would be destructive and violates the append-focused sync contract.

# Observability

- init reports created vs skipped files deterministically
- mirror drift is visible through `mdkg validate`
- mirror rebuild is explicit through `mdkg skill sync`
- startup and command surfaces are auditable through `npm run cli:snapshot` and `npm run cli:check`

# Security / privacy

- keep event logs redacted by default and committed unless a repo chooses to ignore them manually
- keep `.mdkg/index/` and `.mdkg/pack/` ignored
- avoid secrets in SOUL/HUMAN/skills/startup docs
- preserve package publishing boundaries to prevent accidental `.mdkg` shipment

# Testing strategy

Current implementation checks:
- init agent scaffold + safety behavior (`test-51`)
- startup wrapper parity (`test-52`)
- skill mirror bootstrap/sync (`test-53`)
- validate drift warning guidance (`test-54`)
- first-step startup guidance (`test-55`)

# Rollout plan

1. ship generic `--agent` bootstrap
2. ship shared startup artifact and wrapper docs
3. ship safe product-specific skill mirrors
4. follow with guided work-memory lifecycle design under `epic-15`
