---
id: edd-7
type: edd
title: v0.4 agent skills standards alignment and research snapshot
tags: [architecture, v0_4, skills, standards, research]
owners: []
links: [https://docs.claude.com/en/docs/agents-and-tools/agent-skills, https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices, https://support.claude.com/en/articles/12512198-how-to-create-custom-skills, https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices, https://agentskills.io/specification]
artifacts: []
relates: [prd-1, dec-8, dec-9, dec-10, dec-12, edd-2, edd-3, edd-5, epic-4, epic-5, epic-9]
refs: []
aliases: [doc-9, skills-research, as_of_2026-03-05, stage:plan]
created: 2026-03-04
updated: 2026-03-08
---

# Overview

This document captures mdkg v0.4 alignment to external Agent Skills best-practice guidance.

Research snapshot as_of: `2026-03-05`.

Source-truth review input for this pass:
- [Anthropic agent skills overview](https://docs.claude.com/en/docs/agents-and-tools/agent-skills)
- [Anthropic skill authoring best practices](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices)
- [Anthropic custom skills help article](https://support.claude.com/en/articles/12512198-how-to-create-custom-skills)
- [Anthropic API skill best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)

Supplemental open-standard reference:
- [agentskills.io specification](https://agentskills.io/specification)

Adopted in v0.4 docs:
- metadata-first progressive disclosure
- required `name` and `description` in `SKILL.md`
- lowercase kebab-case skill names
- concise, single-purpose skills with explicit procedural sections
- deterministic, local skill discovery and explicit activation
- script-risk guidance and approval boundaries

Deferred or constrained in v0.4:
- no nested metadata map contract in mdkg docs (`ochatr_*` flattened policy retained)
- runtime script execution and policy enforcement remain out of scope for this pass

Current source delta as of `2026-03-08`:
- mdkg now implements a dedicated `mdkg skill` namespace for authoring and skill-specific discovery
- generated skills use the Anthropic-aligned minimum body shape from the built-in scaffold
- internal dogfood skills remain the source-truth exemplars for the generated template

# Architecture

Anthropic guidance emphasizes small skill units, explicit procedures, and metadata-driven discovery. mdkg alignment model:
- discover skill metadata locally from `.mdkg/skills/**/SKILL.md`
- search/select skills using deterministic metadata filters
- load full skill body only when policy + task context requires it

Stage-aware gating model in v0.4 docs:
- query-time filtering by tags (e.g., `stage:plan`, `stage:execute`)
- policy-time gating to restrict allowed skill classes by orchestrator stage

# Data model

Baseline `SKILL.md` fields adopted for v0.4 docs:
- required: `name`, `description`
- recommended: `tags`, `version`, `authors`, `links`

mdkg-specific compatibility constraint:
- optional routing/policy metadata is documented as flattened keys (for example `ochatr_tools`, `ochatr_policies`) to remain parser-compatible in current strict frontmatter model.

Stage-gating tag conventions (policy-level examples):
- `stage:plan`
- `stage:execute`
- `stage:review`
- `risk:high`

# APIs / interfaces

Public-interface posture after the current source delta:
- keep generic `list/show/search` skill compatibility
- provide focused `mdkg skill list/show/search` aliases for primary skill UX
- provide `mdkg skill new` and `mdkg skill validate` as first-class authoring commands
- keep tag-aware discovery filters (`--tags`, `--tags-mode any|all`) on both generic and skill-focused query surfaces

# Failure modes

- Over-broad skills degrade reliability and determinism.
- Always loading full skill bodies causes context bloat.
- Missing stage/risk conventions weakens policy gating behavior.
- Divergence from external standards without documented rationale increases interoperability risk.
- Large `SKILL.md` bodies or vague descriptions reduce invocation quality for agents and humans.

# Observability

- Track external standards snapshot date (`as_of`) in docs.
- Track which external publisher was treated as source-truth for each review cycle.
- Maintain explicit adopted vs deferred mapping per release family.
- Include source links in planning docs so refreshes are auditable.

Refresh cadence:
- review this snapshot at each `v0.4.x` release cut
- refresh again before v0.5 planning lock

# Security / privacy

- Treat script-bearing skills as elevated risk in docs guidance.
- Keep approvals/logging expectations explicit for orchestrators.
- Keep skills content secret-free and avoid embedding sensitive runtime outputs.

# Testing strategy

Docs integration checks:
- `mdkg show edd-7 --body` contains `as_of: 2026-03-05` and source links
- search coverage includes stage-tag policy markers (`stage:plan`)

Future implementation checks:
- skills query + stage filtering contracts (`test-20`)
- docs/source alignment refresh checks (`test-25`)

# Rollout plan

1. integrate this research snapshot into v0.4 design graph
2. align skill query/gating tasks/tests to this contract
3. refresh snapshot as part of each v0.4.x docs alignment audit
4. keep the `mdkg skill` scaffold and docs aligned to the source-truth dogfood skills for v0.5 work
