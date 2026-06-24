---
id: prd-7
type: prd
title: mdkg.dev pass 2 public-alpha polish requirements
tags: [mdkg-dev, public-alpha, preview-polish, product-design]
owners: []
links: [https://mdkg-dev.vercel.app/, https://mdkg-docs.vercel.app/]
artifacts: [mdkg_preview_polish_pass2, mdkg_preview_polish_pass2_docs.zip]
relates: []
refs: [archive://archive.mdkg-dev-preview-polish-pass-2-2026-06-24]
aliases: [mdkg-dev-pass-2-prd]
created: 2026-06-23
updated: 2026-06-23
---
# Problem

The mdkg.dev and docs previews are live, but the pass-2 feedback shows remaining public-alpha trust gaps: command blocks are still too fragile, public pages expose too much implementation/scaffold language, the docs IA needs to feel like user documentation, and the product story needs a sharper first-run path.

# Goals

- Make the first public impression crisp: `mdkg` wordmark, concise nav, trustworthy command blocks, and no internal project-planning copy.
- Center the public promise on "Git-native project memory for AI coding agents."
- Replace "golden loop" with "Plan -> Work -> Evidence" everywhere public.
- Make first-run setup distinct from the operating loop.
- Make Starlight docs useful as a standalone public-alpha docs surface.
- Strengthen local-first, low-dependency, and supply-chain-safe posture without overclaiming.
- Validate responsive behavior, accessibility basics, code-block readability, metadata, links, and no-secret posture before push.

# Story Taxonomy

## P0

`P0-001` through `P0-009` are launch blockers: command block rendering, `llms.txt`, wordmark, nav, `/docs` behavior, removal of scaffold/meta copy, claims matrix exposure, renderer mentions, and preview noindex/canonical policy.

## P1

`P1-010` through `P1-026` are public-alpha credibility work: Plan -> Work -> Evidence copy, first-run separation, hero sharpening, work node explanations, local-first security posture, docs home, work-node pages, install/quickstart/repository layout, command reference, roadmap, trust, and alpha contract.

## P2

`P2-027` through `P2-035` are included in Goal 32: CSS/HTML diagram, SEO/social review, README/npm copy consistency, analytics/CTA plan without activation, docs nav, footer links, supply-chain guidance, external-link accessibility, and responsive/code-block validation.

## P3

`P3-036` through `P3-040` are also included in Goal 32 as documentation expansion: generated CLI reference, demo repo docs, read-only MCP guide, subgraphs/bundles/graph movement docs, and follow-up visual/video asset planning.

# Requirements

- Public examples use durable placeholders like `WORK_ID`, not malformed `<id>` snippets.
- Public pages avoid claims of hosted execution, hosted memory, comprehensive secret scanning, arbitrary SQL, production runtime maturity, or universal agent compatibility.
- `mdkg.dev/docs` is removed now; future redirect to `docs.mdkg.dev` is separate.
- Preview noindex applies to Vercel preview URLs only.
- Product Design review is recorded in mdkg checkpoints, not separate artifact folders for this pass.

# Acceptance Criteria

- Goal 32 has complete P0/P1/P2/P3 scope, checks, and checkpoints.
- All feedback stories are traceable from source bundle to implementation nodes.
- The future implementation can run without deciding positioning, IA, validation, push, or Vercel boundaries.

# Links / References

- `goal-31`
- `goal-32`
- `prd-6`
- `edd-34`
- `edd-35`
- `dec-36`

# Non-goals

- No DNS cutover, production promotion, npm publish, git tag, analytics activation, public launch, or Vercel/GitHub settings mutation in Goal 31.

# Metrics / Success

- Local and hosted previews communicate mdkg clearly within the first screen and first five minutes.
- Command examples are readable on desktop and mobile.
- Docs navigation provides a credible public-alpha learning path.

# Risks

# Open Questions
