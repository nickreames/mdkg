---
id: edd-5
type: edd
title: mdkg skills integration guide v0.4 agent skills standard and packs
tags: [architecture, v0_4, skills, guide, packs]
owners: []
links: []
artifacts: []
relates: [prd-1, prd-2, dec-8, dec-9, dec-10, dec-11, edd-2, edd-3, edd-4, edd-6, edd-7, edd-8, edd-9, epic-4, epic-5, epic-7]
refs: []
aliases: [doc-7, skills-guide, agent-skills]
created: 2026-03-04
updated: 2026-03-06
---

# Overview

This document defines how mdkg integrates Agent Skills in v0.4 as deterministic procedural memory alongside semantic nodes and context packs.

Scope:
- skill folder/metadata contract
- indexing/discovery behavior
- node-to-skill linking
- pack inclusion guidance
- authoring and security practices for skills with/without scripts

Non-goals:
- no nested metadata map contracts (`ochatr:` blocks) in v0.4 docs
- no new top-level `mdkg skills ...` namespace in v0.4
- no finalized events command names in this pass

## Current source state (2026-03-06)

| Capability | v0.4 target | Current source behavior | Source anchor |
| --- | --- | --- | --- |
| Skills directory scan | discover `.mdkg/skills/**/SKILL.md` | implemented deterministic scan rooted at `.mdkg/skills/<slug>/` with metadata-only indexing | `src/graph/skills_indexer.ts`, `src/commands/index.ts` |
| Skill metadata index | emit `.mdkg/index/skills.json` | implemented separate skills index artifact | `src/graph/skills_index_cache.ts`, `src/commands/index.ts` |
| Skill schema validation | require `name` + `description` in SKILL frontmatter | implemented hard-fail validation for missing skill file/required fields | `src/commands/validate.ts`, `src/graph/skills_indexer.ts` |
| Node skill references | validate `skills: [...]` references against known slugs | implemented parser/model support and cross-validation | `src/graph/frontmatter.ts`, `src/graph/node.ts`, `src/commands/validate.ts` |
| Skill-aware query flows | list/show/search for skill metadata/bodies | implemented under existing command families | `src/commands/list.ts`, `src/commands/show.ts`, `src/commands/search.ts`, `src/cli.ts` |
| Pack skill inclusion | include meta/full skill data by policy | implemented with `--skills` and `--skills-depth` | `src/commands/pack.ts`, `src/pack/pack.ts`, `src/cli.ts` |
| Script-risk surfaced in index | detect and expose `has_scripts`/risk posture | implemented `has_scripts` / `has_references`; enforcement remains docs-level | `src/graph/skills_indexer.ts`, `src/commands/validate.ts` |
| Filename compatibility tolerance | keep `SKILL.md` canonical while tolerating `SKILLS.md` | implemented read-compat for `SKILLS.md`, with warning and hard-fail if both files exist | `src/graph/skills_indexer.ts`, `src/commands/validate.ts` |
| Internal skills dogfooding | mdkg repo carries real skills for mdkg itself | implemented three internal skills that teach the simplified workflow, writer roles, and pack-first handoff rules | `.mdkg/skills/`, `README.md` |

# Architecture

mdkg skill integration principles in v0.4:

1. Skills are procedural memory, not semantic node replacements.
2. Skill metadata is indexed locally; full bodies are loaded progressively.
3. Skill usage in packs is policy-driven and bounded.
4. Skill metadata extensions remain portable and non-breaking.
5. mdkg indexes and discovers skills, but does not execute skill scripts.

Skill location convention:
- `.mdkg/skills/<skill-slug>/SKILL.md`
- optional siblings: `scripts/`, `references/`, `assets/`

Compatibility direction:
- `SKILL.md` remains canonical
- current source tolerates `SKILLS.md` on read with warning
- validation fails if both `SKILL.md` and `SKILLS.md` exist in one skill directory
- docs/templates should continue writing `SKILL.md`

Slug convention:
- folder slug is stable identifier
- kebab-case recommended
- referenced via node `skills: [slug, ...]`

# Data model

## SKILL frontmatter contract

Required:
- `name` (string)
- `description` (string)

Recommended:
- `tags` (string list)
- `version` (string)
- `authors` (string list)
- `links` (string list)

Optional integration metadata (locked v0.4 form):
- flattened `ochatr_*` keys, for example:
  - `ochatr_tools: [wasm.deploy_v1, http.github_api]`
  - `ochatr_policies: [approval-required, risk-high]`
  - `ochatr_max_parallel: 3`

Nested `ochatr:` map blocks are not part of the v0.4 parser-compatible contract.

Portable SKILL frontmatter example:

```md
---
name: deterministic mdkg pack execution
description: generate and apply deterministic mdkg context packs for work execution
tags: [mdkg, packs, workflow]
version: 0.1.0
authors: [mdkg-maintainers]
links: [https://github.com/nickreames/mdkg]
ochatr_tools: [mdkg, git]
ochatr_policies: [approval-required, no-secrets]
---
```

## Node reference contract

v0.4 target schema includes optional work-item field:
- `skills: [<skill-slug>, ...]`

Guidance:
- use `skills` primarily on actionable work nodes (`task`, `feat`, `bug`, `epic`, `test`, `checkpoint`)
- validate each referenced slug exists under `.mdkg/skills/<slug>/SKILL.md`

## Authoring structure guidance

Recommended SKILL body sections:
- `# Goal`
- `## When To Use`
- `## Inputs`
- `## Preconditions`
- `## Steps`
- `## Outputs`
- `## Safety`
- `## Failure Handling`
- `## Examples`

Authoring guidance:
- keep each skill single-purpose and tightly scoped
- prefer explicit step-by-step procedures over prose-heavy background
- keep runtime-specific routing metadata optional and secondary to the markdown instructions
- keep the body concise enough for pack inclusion and direct agent consumption
- for mdkg internal skills, encode writer role and memory-update boundaries in the body, not in heavy metadata

Good examples:
- `deploy-go-service-staged-rollout`
- `build-pack-and-execute-task`
- `verify-close-and-checkpoint`

Bad examples:
- `everything-about-deployments`
- `all-repo-operations`
- `general-engineering-advice`

# APIs / interfaces

Indexing/discovery target:
- `mdkg index` builds node index + skills metadata index
- agent discovery flow: metadata search -> select skill -> load full SKILL body only when needed
- planned stage-aware discovery filters include `--tags` with `--tags-mode any|all` under existing query command families

Pack inclusion target (non-normative examples only):
- `--skills none|auto|<list>`
- `--skills-depth meta|full`

Usage guidance:
- planning/discovery stages prefer metadata-only skills
- execution stages load full skill bodies for selected procedures
- recommended orchestrator loop is: select work -> build pack -> discover skills by metadata/tags -> load full selected skills -> execute -> update task/artifacts/checkpoint
- stage gating is hybrid: query-time filter + policy-time orchestrator constraints
- mdkg dogfood skills should make writer roles explicit in their tags and bodies:
  - `writer:read-only`
  - `writer:patch-only`
  - `writer:orchestrator`

CLI naming policy:
- skills stay in existing command families (`list/show/search/pack`) and current flag names are binding for v0.4 implementation
- examples for future events-specific commands remain non-normative

# Failure modes

- Nested metadata maps (`ochatr:`) fail strict frontmatter parsing expectations.
- Rigid `SKILL.md`-only behavior without migration guidance creates avoidable onboarding friction.
- Overly broad skills cause procedural ambiguity and weak execution quality.
- Always including full skill bodies bloats packs and hurts precision.
- Scripts without approval/risk guidance increase unsafe execution risk.
- Missing skill slugs in node frontmatter create deterministic validation failures.
- Non-portable skills tied to one runtime/tool reduce interoperability.
- Missing stage/risk tag conventions can weaken policy gating outcomes.

# Observability

- skills index should expose deterministic metadata ordering and stable slug identity.
- validation should report missing required fields and dangling skill references deterministically.
- pack diagnostics should indicate when skill metadata or full bodies were included.
- script-bearing skills should be clearly discoverable (planned metadata flags).

# Security / privacy

- mdkg does not execute skill scripts; runtimes and orchestrators decide whether to execute them.
- treat `scripts/` skills as high-risk by default in orchestrator policy.
- require explicit approval before executing skill scripts or tool wrappers derived from them.
- log each skill-script execution in runtime observability layers when available.
- constrain command and path scope when executing skills with scripts.
- keep scripts small, auditable, and optional when plain instructions are sufficient.
- avoid secrets in SKILL docs, references, and assets.

# Testing strategy

Docs integration checks:
- `mdkg validate` passes with `edd-5` and linked roadmap nodes
- `mdkg list --type edd` includes `edd-5`
- `mdkg show edd-5 --body` reflects flattened metadata policy and progressive disclosure guidance

Future implementation checks:
- skills index/discovery contracts (`test-10`, `test-12`)
- node skill-reference validation (`test-13`)
- authoring/security guidance contracts (`test-18`, `test-19`)
- tag-filter and stage-policy gating contracts (`test-20`)

# Rollout plan

For this pass:
- documentation/work-node integration only
- no runtime implementation changes

Implemented sequence to date:
1. skills index artifact and discovery surfaces
2. node `skills` schema + cross-validation
3. pack skills inclusion policies (`meta` vs `full`)
4. internal dogfooded skills that teach the simplified mdkg workflow
5. tolerant `SKILLS.md` compatibility while keeping `SKILL.md` canonical
6. script-risk surfacing in metadata, with policy enforcement still deferred to runtimes/docs

Doc tracking:
- this document is Doc 7 (`edd-5`) for skills integration usage/spec guidance
- episodic guide is integrated as Doc 8 (`edd-6`)
