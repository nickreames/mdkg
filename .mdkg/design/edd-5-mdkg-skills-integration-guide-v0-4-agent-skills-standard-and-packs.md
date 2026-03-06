---
id: edd-5
type: edd
title: mdkg skills integration guide v0.4 agent skills standard and packs
tags: [architecture, v0_4, skills, guide, packs]
owners: []
links: []
artifacts: []
relates: [prd-1, prd-2, dec-8, dec-9, dec-10, edd-2, edd-3, edd-4, edd-6, edd-7, edd-8, epic-4, epic-5]
refs: []
aliases: [doc-7, skills-guide, agent-skills]
created: 2026-03-04
updated: 2026-03-05
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

## Current source gaps (2026-03-05)

| Capability | v0.4 target | Current source behavior | Source anchor |
| --- | --- | --- | --- |
| Skills directory scan | discover `.mdkg/skills/**/SKILL.md` | implemented deterministic scan for skill frontmatter index | `src/graph/skills_indexer.ts`, `src/commands/index.ts` |
| Skill metadata index | emit `.mdkg/index/skills.json` | implemented separate skills index artifact | `src/graph/skills_index_cache.ts`, `src/commands/index.ts` |
| Skill schema validation | require `name` + `description` in SKILL frontmatter | implemented hard-fail validation for missing `SKILL.md`/required fields | `src/commands/validate.ts`, `src/graph/skills_indexer.ts` |
| Node skill references | validate `skills: [...]` references against known slugs | implemented parser/model support and cross-validation | `src/graph/frontmatter.ts`, `src/graph/node.ts`, `src/commands/validate.ts` |
| Skill-aware query flows | list/show/search for skill metadata/bodies | implemented under existing command families | `src/commands/list.ts`, `src/commands/show.ts`, `src/commands/search.ts`, `src/cli.ts` |
| Pack skill inclusion | include meta/full skill data by policy | implemented with `--skills` and `--skills-depth` | `src/commands/pack.ts`, `src/pack/pack.ts`, `src/cli.ts` |
| Script-risk surfaced in index | detect and expose `has_scripts`/risk posture | partially implemented: `has_scripts` is indexed; policy enforcement remains docs-level | `src/graph/skills_indexer.ts`, `src/commands/validate.ts` |

# Architecture

mdkg skill integration principles in v0.4:

1. Skills are procedural memory, not semantic node replacements.
2. Skill metadata is indexed locally; full bodies are loaded progressively.
3. Skill usage in packs is policy-driven and bounded.
4. Skill metadata extensions remain portable and non-breaking.

Skill location convention:
- `.mdkg/skills/<skill-slug>/SKILL.md`
- optional siblings: `scripts/`, `references/`, `assets/`

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
- stage gating is hybrid: query-time filter + policy-time orchestrator constraints

CLI naming policy:
- skills stay in existing command families (`list/show/search/pack`) and current flag names are binding for v0.4 implementation
- examples for future events-specific commands remain non-normative

# Failure modes

- Nested metadata maps (`ochatr:`) fail strict frontmatter parsing expectations.
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

- mdkg does not execute skill scripts; runtimes decide execution.
- treat `scripts/` skills as high-risk by default in orchestrator policy.
- require explicit approvals for risky operations in runtime/tooling layers.
- constrain path/command scope when executing skills with scripts.
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

Recommended implementation sequence:
1. implement skills index artifact and discovery surfaces
2. implement node `skills` schema + cross-validation
3. implement pack skills inclusion policies (`meta` vs `full`)
4. add script-risk surfacing/validation rules (strict-mode policy path)
5. publish usage guidance and examples aligned to source-truth behavior

Doc tracking:
- this document is Doc 7 (`edd-5`) for skills integration usage/spec guidance
- episodic guide is integrated as Doc 8 (`edd-6`)
