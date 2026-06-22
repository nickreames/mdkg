---
tags: [mdkg-dev, design-system, visual-design, diagrams]
owners: []
links: [https://docs.astro.build/en/guides/framework-components/]
artifacts: [mdkg_planning_docs.zip]
relates: [edd-24, edd-27]
refs: [archive://archive.mdkg-dev-planning-docs-2026-06-22]
aliases: [mdkg-dev-design-system-contract]
created: 2026-06-22
updated: 2026-06-22
id: edd-28
type: edd
title: mdkg.dev visual design system tokens components and diagram contract
---
# Overview

mdkg.dev needs a restrained OSS developer-tool design system before implementation starts so the site can be built quickly without drifting into generic AI marketing visuals.

# Architecture

- Source design doctrine lives in `mdkg-dev/DESIGN.md`.
- Runtime design tokens live in the mdkg-dev site source and mirror this document.
- Static pages use Astro HTML first; React islands are allowed only for genuinely useful interaction.
- Diagrams should be hand-authored SVG or HTML/CSS unless a generated bitmap materially improves clarity.

# Data model

- Design tokens define colors, typography, spacing, radii, borders, and component states.
- Component contracts define reusable site primitives and route-level composition.
- Diagram contracts define maintainable explanatory visuals and alt-text requirements.

# APIs / interfaces

- `mdkg-dev/DESIGN.md` is the human-readable design contract.
- Site CSS variables are the implementation interface for tokens.
- Astro components are the implementation interface for reusable UI.

# Token Contract

- Use Inter for body, headings, and UI where practical; use JetBrains Mono for commands, IDs, frontmatter, and code.
- Start from white/zinc surfaces with blue, sky, and teal accents.
- Use the Ocean Flow gradient sparingly for primary CTAs, selected states, and diagram highlights.
- Avoid broad gradient backgrounds, AI glow, cartoon mascots, crypto/Web3 visual language, and dense enterprise SaaS clutter.

# Component Contract

Minimum components:

- Button
- Card
- CodeBlock
- TerminalBlock
- FeatureCard
- SectionHeader
- CTAGroup
- Badge
- NavBar
- Footer
- DiagramCard
- ClaimEvidenceCard or equivalent claim/evidence display

# Diagram Contract

Required diagrams or equivalent maintainable visuals:

- Hero architecture: `.mdkg/` Markdown plus Git source of truth, mdkg CLI, packs, handoffs, humans, and AI agents.
- Golden loop: initialize, select work, pack context, execute, checkpoint, validate.
- Work/context/evidence triad: `scope_refs`, `context_refs`, and `evidence_refs`.
- Repo layout: `.mdkg/core`, `.mdkg/design`, `.mdkg/work`, `.mdkg/skills`, `.mdkg/archive`, `.mdkg/index`, `.mdkg/db`, and skill mirrors.
- Handoff flow: graph context, goal/work state, checkpoints, boundaries, required checks, raw-marker warnings.
- Trust boundary: local repo and local mdkg CLI, no hosted index, no daemon, read-only MCP boundary.

# Failure Modes

- Decorative visuals obscure CLI value.
- Design tokens become disconnected from implementation CSS.
- Generated images introduce unreadable text or unreviewable claims.
- Code blocks overflow on mobile.

# Observability

- Static render smokes should report route inventory, component coverage, and any mobile/code-block failures.
- Visual review checkpoints should record screenshots or explicit manual review notes when browser proof is used.

# Security / privacy

- Design assets must not include private repo details, raw prompts, tokens, provider payloads, or local absolute paths.
- Diagrams must clarify trust boundaries without implying comprehensive secret scanning or hosted execution.

# Testing Strategy

- Static render smoke checks that required pages include design tokens and core components.
- Mobile viewport smoke checks that hero, CTA, and code blocks do not overflow.
- Link/metadata smoke confirms diagrams have useful alt text or explicit decorative handling.

# Rollout plan

- Start with token and component foundations.
- Add route content and diagrams after the static shell builds.
- Defer dark mode and generated bitmap production unless they materially improve clarity.

# Links / references

- goal-25
- task-446
- task-449
- test-200
- archive://archive.mdkg-dev-planning-docs-2026-06-22
