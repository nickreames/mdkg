---
id: edd-9
type: edd
title: v0.4x product simplification and onboarding for humans and agents
tags: [architecture, v0_4x, product, onboarding, cli, ux]
owners: []
links: []
artifacts: []
relates: [prd-1, prd-2, dec-10, dec-11, edd-5, epic-6, epic-7, epic-8]
refs: []
aliases: [simplification-edd, onboarding-edd, pack-first]
created: 2026-03-05
updated: 2026-03-06
---

# Overview

This document defines the post-v0.4 product simplification direction for mdkg so the tool is easier to adopt for two primary audiences:

- human builders working with AI agents
- AI agents that need deterministic project memory and execution context

Core stance:
- mdkg remains a generic OSS CLI
- `pack <id>` is the central agent/human handoff primitive
- docs and help should teach a short primary workflow before exposing advanced commands

# Current source state

| Capability | Desired product shape | Current source behavior | Source anchor |
| --- | --- | --- | --- |
| Generic bootstrap story | `init --llm` remains generic/default docs path | implemented in README, `llms.txt`, and prompt snippet; `init --omni` stays optional | `README.md`, `llms.txt`, `AGENT_PROMPT_SNIPPET.md` |
| Command visibility | short primary workflow, advanced tools de-emphasized | implemented via primary vs advanced help grouping and simplified command help surfaces | `src/cli.ts` |
| Pack-first mental model | `pack <id>` centered in docs and agent guidance | implemented in root onboarding docs and help examples | `README.md`, `PACK_EXAMPLES.md`, `src/cli.ts`, `src/commands/pack.ts` |
| Skills standard compatibility | canonical `SKILL.md`, tolerant compatibility for `SKILLS.md` later | implemented: canonical `SKILL.md`, tolerant `SKILLS.md`, conflict invalid | `src/graph/skills_indexer.ts`, `src/commands/validate.ts` |
| Skills dogfooding | mdkg repo uses real internal skills to teach mdkg itself | implemented with three committed internal skills and root registry | `.mdkg/skills/`, `README.md` |
| Coverage hardening loop | manual behavior audit first, then near-full coverage push | manual audit and coverage script are implemented; coverage thresholds remain unmet and hardening stays in progress | `package.json`, `MANUAL_BEHAVIOR_AUDIT.md`, `COVERAGE_HARDENING_MATRIX.md`, `tests/` |

# Architecture

## Product objectives

- Make first-use onboarding legible in under 2 minutes.
- Make LLM onboarding legible without prior chat history.
- Reduce visible CLI complexity without breaking existing compatibility.
- Make skills feel real and necessary through dogfooded examples, not just docs.
- Raise trust through explicit manual behavior audits followed by stronger coverage hardening.

## Manual audit conclusions (2026-03-06)

The phase-one manual audit is now captured in the root artifact `MANUAL_BEHAVIOR_AUDIT.md`.

Observed friction in baseline behavior:
- `init` taught `index` instead of the intended pack-first loop.
- `show <id>` returned metadata only for nodes, while skills already showed full body content.
- global help presented primary and advanced commands as one flat list.
- empty-state skills discovery produced silent success.

Actions implemented from that audit:
- `init` next-step guidance now teaches `new/search/show/next/pack/validate`.
- `show <id>` now renders full body content by default, with `--meta` as the compact view.
- global help now separates primary commands from advanced / maintenance commands.
- `list --type skill` now emits an empty-state note when no skills are indexed.
- root onboarding artifacts now exist outside `.mdkg` for humans and LLMs.
- internal skills now dogfood the simplified mdkg workflow directly inside the repo.

# Data model

## Primary users

## Human builders

Humans need:
- fast setup
- simple task capture
- deterministic retrieval of current truth
- easy agent handoff

## AI agents

Agents need:
- stable bootstrap instructions
- pack-first context assembly
- explicit rules over inferred memory
- procedural skills for repeatable work

## Human + agent pair

The product should optimize for a pair workflow:
- human defines or selects work
- agent consumes deterministic context via packs
- human reviews and steers
- both rely on the same mdkg graph

## Simplified workflow

Primary workflow to teach first:

1. `mdkg init --llm`
2. `mdkg new task "..."`
3. `mdkg search` or `mdkg show`
4. `mdkg next`
5. `mdkg pack <id>`
6. `mdkg validate`

Optional agent-ready branch:
- `mdkg init --omni` when the repo needs SOUL/HUMAN/skills/events scaffolding

Command visibility policy:
- primary commands should be taught in README, `llms.txt`, prompt snippets, and future docs landing pages
- advanced commands should remain available, but move out of the first-run story

# APIs / interfaces

Recommended primary commands:
- `init`
- `new`
- `search`
- `show`
- `next`
- `pack`
- `validate`

Recommended advanced commands:
- `index`
- `checkpoint`
- `format`
- `doctor`
- `workspace`

Rationale:
- `index` is useful, but auto-reindex reduces first-run necessity
- `pack` is the core differentiator and should feel central
- `checkpoint` matters, but is milestone-level rather than first-use

## Skills product policy

Skills should become a first-class teaching surface for mdkg itself.

Dogfooding direction:
- add real internal skills that explain the simplified mdkg workflow
- keep those skills procedural and pack-first
- use them to teach agents how to operate safely in mdkg repos

Filename policy:
- `SKILL.md` remains canonical
- current source now tolerates `SKILLS.md` on read with warning
- if both files exist in one skill directory, treat that as invalid

## Documentation architecture

Audience separation target:

- `README.md`
  - product positioning
  - short human quickstart
  - generic CLI story
- `llms.txt`
  - strict agent bootstrap
  - pack-first rule
  - directory and command essentials
- CLI help
  - exact reference
- internal mdkg graph docs
  - design rationale, contracts, and roadmap

The README should not try to fully replace `llms.txt` or the CLI reference.

# Failure modes

- Flat command help makes the tool feel larger than it needs to be.
- Teaching `--omni` as the only story makes the OSS tool feel product-specific.
- Treating `pack` as optional leads agents back to ad-hoc file reading.
- Skills that are not dogfooded remain theoretical and weaken trust.
- Forcing strict `SKILL.md` only with poor feedback creates unnecessary onboarding friction.

## Observability

Manual behavior audit targets:
- first-run human loop
- first-run agent pack loop
- empty-state skills discovery experience
- help/readme parity for the primary workflow

Coverage hardening targets after audit:
- CLI dispatch/help paths
- `show`, `new`, `format`, `workspace`, `qid`
- remaining pack/export unhappy paths

## Security / privacy

- Generic OSS onboarding should remain free of product-specific hosted assumptions.
- Skills docs should keep approval, risk, and secret-handling rules explicit.
- Pack-first guidance should continue to prioritize pinned rules and boundary docs.

# Testing strategy

Manual behavior audit contract:
- verify the simplified primary loop in a real repo
- record empty-state, failure-state, and confusing-state UX notes
- turn those notes into concrete coverage priorities

Coverage hardening contract:
- prioritize user-facing commands and resolution paths first
- add thresholds only after the intended behavior is stable

# Rollout plan

1. clarify simplified product decisions (`dec-11`)
2. update docs artifacts and onboarding plans (`epic-6`)
3. update CLI simplification plans around primary vs advanced commands (`epic-7`)
4. run manual behavior audits
5. create and execute dedicated reliability/coverage hardening work (`epic-8`)
