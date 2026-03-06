---
id: prd-2
type: prd
title: mdkg dev website and documentation plan v0.4
tags: [v0_4, mdkg-dev, docs, seo]
owners: []
links: []
artifacts: []
relates: [prd-1, dec-8, dec-9, edd-2, edd-3, edd-4, edd-5, edd-6, epic-4]
refs: []
aliases: [doc-5, mdkg.dev, llms-txt, llms.txt, docs-plan]
created: 2026-03-04
updated: 2026-03-04
---

# Problem

mdkg v0.4 planning is strong internally, but discoverability and onboarding remain underpowered without a clear mdkg.dev docs surface. New users and LLMs need a stable, source-aligned way to understand mdkg quickly without chat history.

# Goals

- Launch a minimal, high-signal mdkg.dev information architecture for discoverability.
- Define docs that teach both humans and LLMs how to use mdkg correctly.
- Keep command/reference content aligned to source-truth CLI behavior.
- Establish SEO pillars that target high-intent mdkg use cases.
- Provide examples that reduce docs burden and improve adoption speed.

# Non-goals

- No hosted mdkg runtime platform in this pass.
- No full enterprise docs portal in v0.4 planning.
- No attempt to rank for broad low-intent keyword sets.
- No runtime CLI implementation changes in this documentation pass.

# Requirements

## Functional

- Define mdkg.dev IA with top-level nav: Home, Docs, Examples, CLI, Blog, GitHub/npm.
- Define home page sections and messaging for deterministic memory, 3-layer model, and quickstart.
- Define minimal versioned docs structure: Start Here, CLI reference, Agent docs, migration notes.
- Include episodic-memory docs coverage (events + checkpoints) as first-class agent guidance.
- Define LLM-readable strategy: top-level `llms.txt`, agent prompt snippet, sample pack shapes.
- Define SEO content roadmap with first priority posts (Pillar 1 and Pillar 3 first).
- Define examples strategy (demo repo + realistic repo + skill examples + SOUL/HUMAN examples).
- Define conversion paths for humans and agent builders.
- Keep all planned website/docs claims labeled as target-state when not implemented.

## Non-functional

- Source code remains truth for current command behavior and flag surface.
- Documentation must remain concise, high-signal, and maintainable.
- Website/docs strategy must preserve mdkg deterministic/local-first positioning.
- Safety messaging must remain explicit: no secrets in mdkg docs, ignore cache/pack artifacts, strict publish boundaries.

## Current Source Gap Matrix (as of 2026-03-04)

| Capability | v0.4 target | Current source behavior | Evidence |
| --- | --- | --- | --- |
| Public docs site IA | mdkg.dev with Home/Docs/Examples/CLI/Blog | repo has README only; no website IA artifacts in source | `README.md` |
| LLM-readable index file | root `llms.txt` with mdkg basics and pack workflow | no `llms.txt` file in repo root | repository root tree |
| CLI reference anti-drift workflow | generated or tightly maintained CLI docs contract | CLI help text and README are independently maintained today | `src/cli.ts`, `README.md` |
| Agent prompt snippet artifact | canonical copy-paste snippet page | no dedicated snippet artifact in repo docs | `README.md`, `.mdkg/design/` |
| Example pack artifacts in docs | task/edd/skills-included pack examples | no committed docs examples for those pack classes | `README.md`, `.mdkg/work/` |
| SEO content backlog | 6 pillar posts with staged rollout | only planning tasks exist for two mdkg.dev themes | `.mdkg/work/task-39-*.md`, `.mdkg/work/task-40-*.md` |
| Analytics plan | simple pageview + CTA tracking contract | no docs analytics plan artifact exists | `README.md`, repository root |

# Acceptance Criteria

- `prd-2` is discoverable in mdkg graph and cross-linked to v0.4 design/decision docs.
- mdkg.dev strategy is documented with clear current-vs-planned boundaries.
- LLM readability artifacts (`llms.txt`, prompt snippet, sample packs) are specified as actionable deliverables.
- CLI reference strategy explicitly guards against drift from `mdkg --help`.
- Existing mdkg.dev work nodes are updated or expanded to cover IA, examples, and versioning.

# Metrics / Success

- `mdkg validate` passes with `prd-2` and linked work nodes.
- `mdkg search "mdkg.dev"` and `mdkg search "llms.txt"` return planning nodes.
- Roadmap nodes cover IA, docs, examples, SEO content, and LLM readability artifacts.

# Risks

- Website/docs messaging may drift from runtime behavior if CLI docs are not continuously reconciled.
- Overly broad SEO scope can dilute focus and delay launch.
- LLM-focused docs can become stale if not tied to deterministic examples and versioned references.

# Open Questions

- Which hosting stack and docs build approach should power mdkg.dev for v0.4 launch?
- Should CLI reference be generated from `mdkg --help` output or manually curated with a drift check?
- Should example packs live in this repo or a dedicated examples repository?
