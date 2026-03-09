---
id: dec-11
type: dec
title: v0.4x generic oss pack first onboarding and skills dogfooding
status: accepted
tags: [v0_4x, product, onboarding, cli, skills]
owners: []
links: []
artifacts: []
relates: [dec-10, dec-12, prd-1, prd-2, edd-5, edd-9, epic-6, epic-7, epic-8, epic-9]
refs: []
aliases: [generic-oss, pack-first, skills-dogfooding]
created: 2026-03-05
updated: 2026-03-05
---

# Context

mdkg now has enough v0.4 capability to support agent memory and workflow guidance, but the product surface still reads as implementation-first rather than user-loop-first. The OSS CLI also needs to stay generic even while supporting Omni-oriented scaffolding.

# Decision

- `mdkg init --llm` remains supported and documented as the generic OSS bootstrap path.
- `mdkg init --omni` remains supported as an optional agent-ready scaffold, but does not replace the generic OSS story.
- `mdkg pack <id>` is the primary context handoff verb for both human-builder and agent workflows.
- Product simplification should reduce the visible/default command story before removing compatible commands.
- Skills dogfooding is required:
  - mdkg should eventually carry real internal skills that teach the simplified CLI workflow
  - those skills should explain pack-first execution, validation, and release discipline
- `SKILL.md` remains the canonical skill entry filename.
- Future compatibility should tolerate `SKILLS.md` on read with warning, while keeping `SKILL.md` as the canonical write/docs target.
- Reliability and near-full coverage hardening get a dedicated follow-up epic after manual behavior audits confirm the intended UX.

# Alternatives considered

- Make `--omni` the only documented init path (rejected): too product-specific for the OSS CLI.
- Keep treating `pack` as just one advanced command among many (rejected): it is the core interoperability surface.
- Support `SKILLS.md` and `SKILL.md` equally as canonical forms (rejected): encourages drift from the skills standard.
- Fold reliability/coverage into existing simplification work only (rejected): weakens explicit ownership and sequencing.

# Consequences

- The docs stack can separate generic OSS onboarding from optional agent-ready scaffolding without conflict.
- Future CLI simplification should focus on a shorter primary workflow centered on pack-first usage.
- Skills work must move from documented capability to real dogfooded usage.
- Manual behavior audits become the gate before formal coverage thresholds are raised.

# Links / references

- `dec-10`
- `prd-2`
- `edd-5`
- `edd-9`
- `epic-6`
- `epic-7`
- `epic-8`
