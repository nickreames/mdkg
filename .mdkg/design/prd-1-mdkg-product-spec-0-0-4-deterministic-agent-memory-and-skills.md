---
id: prd-1
type: prd
title: mdkg product spec 0.0.4 deterministic agent memory and skills
tags: [v0_4, roadmap, agent-memory, skills]
owners: []
links: []
artifacts: []
relates: [dec-8, dec-9, dec-10, prd-2, epic-4, epic-5, edd-2, edd-3, edd-4, edd-5, edd-6, edd-7, edd-8]
refs: []
aliases: [0.0.4, deterministic-memory, agent-memory]
created: 2026-02-27
updated: 2026-03-06
---

# Problem

mdkg already provides deterministic semantic context packs, but the 0.0.4 target requires first-class procedural and episodic memory that can be consumed by humans and agents without relying on prior chat history.

# Goals

- Extend mdkg from semantic graph tooling into a three-layer memory substrate: semantic, episodic, and procedural.
- Keep all 0.0.4 features local-first, deterministic, and repo-native.
- Make 0.0.4 intent understandable from docs alone, while preserving source-truth accuracy for current CLI behavior.
- Define a concrete roadmap for `init --agent`, skills metadata indexing, optional pack skill inclusion, and episodic event logs.
- Define mdkg.dev/docs positioning so new users and agents can understand mdkg without tribal context.
- Define a concrete `init --agent` scaffold contract for SOUL/HUMAN/skills/events and core pin updates.

# Non-goals

- No vector search or embeddings in 0.0.4.
- No daemon or hosted service in 0.0.4.
- No agent runtime embedded in mdkg.
- No physical scaffolding changes in this pass for `.mdkg/skills` or `.mdkg/work/events`.
- No decision in this pass on exact new skills/events command names.

# Requirements

## Functional

- Document 0.0.4 as planned target state with explicit source-truth gap tracking.
- Plan `mdkg init --agent` as the bootstrap mode for agent-ready scaffolding.
- Plan deterministic local indexing of skill metadata from `.mdkg/skills/**/SKILL.md` into `.mdkg/index/skills.json`.
- Plan optional skill inclusion in packs while preserving deterministic ordering.
- Plan skills capabilities under existing mdkg command families (no new top-level skills namespace).
- Plan skills discovery filters for tags/stages (`--tags`, `--tags-mode`) with policy-driven stage gating guidance.
- Keep skill inclusion behavior policy-driven and require default inclusion of the latest checkpoint when available.
- Plan hybrid latest-checkpoint strategy: pack-time authoritative selection plus optional `latest_checkpoint_qid` index hint.
- Plan `.mdkg/core/SOUL.md` and `.mdkg/core/HUMAN.md` as strict mdkg nodes.
- Plan skill metadata using required `name` and `description`, optional generic `tags`, and flattened optional `ochatr_*` fields.
- Keep skill execution outside mdkg core; mdkg indexes/discovers skills but does not execute scripts.
- Plan episodic logs under `.mdkg/work/events/*.jsonl` with redaction-by-default guidance.
- Plan two-tier episodic memory guidance: JSONL event provenance plus checkpoint compression summaries.
- Plan docs-level redaction policy levels (`safe`, `strict`) with runtime implementation deferred.
- Avoid markdown docs/log files under `.mdkg/work/events/` to prevent strict-node parse conflicts.
- Document single-writer + batched memory-update guidance for external orchestrators.
- Plan minimal structured external orchestrator contracts for run/event/artifact interoperability.
- Plan manual docs alignment audits for 0.0.4.x in lieu of scripted parity checks.
- Keep `--llm` compatibility in the roadmap.

## Non-functional

- Deterministic behavior across machines and time remains mandatory.
- Any 0.0.4 addition must remain file-based and inspectable in git.
- Documentation must distinguish current behavior from planned behavior.
- Orchestrator safety rules are guidance contracts in docs until runtime features are implemented.
- Safety constraints remain mandatory: ignore cache/pack outputs and avoid publishing `.mdkg/`.

## Current Source Gap Matrix (as of 2026-03-05)

| Capability | 0.0.4 target | Current source behavior | Evidence |
| --- | --- | --- | --- |
| bootstrap agent bootstrap | `mdkg init --agent` | implemented: CLI flag scaffolds SOUL/HUMAN/skills/events and deterministic core pin updates | `src/commands/init.ts`, `src/cli.ts` |
| Skills indexing | root-owned deterministic metadata index at `.mdkg/index/skills.json` | implemented: `mdkg index` emits separate `skills.json` artifact from `.mdkg/skills/**/SKILL.md` | `src/commands/index.ts`, `src/graph/skills_indexer.ts`, `src/graph/skills_index_cache.ts` |
| Pack skill inclusion | optional skill content in packs | implemented: `mdkg pack` supports `--skills` and `--skills-depth` | `src/commands/pack.ts`, `src/pack/pack.ts`, `src/cli.ts` |
| Node skill references | optional `skills: [...]` on work-item nodes | implemented: parser/model support plus cross-validation of missing slugs | `src/graph/frontmatter.ts`, `src/graph/node.ts`, `src/commands/validate.ts` |
| Skills stage-tag filtering | tag-filtered skill query/discovery contracts | implemented: `mdkg skill list/search` support `--tags` + `--tags-mode any|all` and `--json`; `mdkg skill show <slug>` supported | `src/commands/skill.ts`, `src/util/filter.ts`, `src/cli.ts` |
| bootstrap agent core docs | `SOUL` and `HUMAN` core-node conventions | implemented: `SOUL.md`/`HUMAN.md` strict-node scaffolding with IDs `rule-soul`/`rule-human` | `src/commands/init.ts`, `src/graph/node.ts` |
| Skill script execution | mdkg indexes/discovers skills while runtimes govern execution | implemented: mdkg surfaces and validates skill files but does not execute scripts | `src/graph/skills_indexer.ts`, `src/commands/validate.ts`, `src/commands/show.ts` |
| Episodic event logs | `.mdkg/work/events/*.jsonl` conventions | implemented: validate-time JSONL contract checks when file exists; no dedicated events command surface | `src/commands/validate.ts`, `src/cli.ts` |
| Latest checkpoint hint | optional `latest_checkpoint_qid` optimization metadata | implemented: index hint emitted; pack-time resolver remains authoritative on mismatches | `src/graph/indexer.ts`, `src/pack/pack.ts` |
| Orchestrator commit policy | single-writer and batched commits as external guidance | no runtime enforcement in mdkg commands | `src/commands/pack.ts`, `src/commands/checkpoint.ts`, `src/commands/init.ts` |

# Acceptance Criteria

- A new user can read mdkg docs and distinguish 0.0.4 planned targets from current CLI behavior.
- 0.0.4 roadmap nodes are represented in the root mdkg graph and link to one another deterministically.
- Gap tracking is explicit and anchored to current source paths.
- The roadmap defines planned API/interface additions without claiming they exist today.

# Metrics / Success

- `mdkg validate` passes after doc integration.
- `mdkg search "agent"` and `mdkg search "skills"` return the relevant planning nodes.
- `mdkg list --type prd` returns `root:prd-1`.

# Risks

- Planned-state docs may drift if not continuously reconciled against source.
- Introducing skills/events without a strict contract could dilute determinism.
- Changing init safety defaults can surprise users if migration guidance is unclear.

# Open Questions

- None currently blocking 0.0.4 planning. Deterministic latest-checkpoint selection is defined in current source and docs as `updated` descending, then `created` descending, then `qid` descending.
