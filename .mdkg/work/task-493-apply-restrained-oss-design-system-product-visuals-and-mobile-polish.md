---
id: task-493
type: task
title: apply restrained OSS design system product visuals and mobile polish
status: done
priority: 1
tags: [mdkg-dev, design, mobile, product-design]
owners: []
links: []
artifacts: []
relates: [test-231]
blocked_by: [task-492]
blocks: [task-494]
refs: [archive://archive.mdkg-dev-feedback-user-stories-2026-06-23]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-23
updated: 2026-06-23
---
# Overview

Apply the restrained OSS visual system and add concrete product proof visuals without drifting into generic AI marketing.

# Acceptance Criteria

- `mdkg-dev/DESIGN.md` and CSS/components agree on white/zinc surfaces with blue/sky/teal accents.
- Homepage includes a product architecture/core-loop visual and believable terminal or context-pack proof.
- Code blocks are readable and mobile-safe.
- CTA/footer/mobile layouts are polished and tap-friendly.
- Accessibility basics are checked: focus states, headings, contrast, alt text, reduced motion where relevant.

# Test Plan

- Browser desktop/mobile screenshots.
- Product Design QA.
- `test-231`

# Files Affected

- `mdkg-dev/src/styles/global.css`
- `mdkg-dev/src/components/ButtonLink.astro`
- `mdkg-dev/src/components/CTAGroup.astro`
- `mdkg-dev/src/components/FeatureCard.astro`
- `mdkg-dev/src/components/TerminalBlock.astro`
- `mdkg-dev/src/components/DiagramCard.astro`
- `mdkg-dev/src/pages/index.astro`

# Implementation Notes

- Preserved the existing restrained OSS design direction: white/zinc surfaces with blue/sky/teal accents, static-first Astro output, and no generic AI-hype visuals.
- Added a concrete homepage product-proof section showing command flow plus example `scope_refs`, `context_refs`, and `evidence_refs`.
- Hardened mobile/tap behavior for CTA buttons and button groups.
- Improved terminal and inline command/code wrapping so code blocks remain readable on mobile.
- Added reduced-motion handling and responsive heading sizing in global CSS.
- Improved diagram and card resilience with stronger surfaces and overflow-safe labels.

# Links / Artifacts

- `npm --prefix mdkg-dev run build` passed.
- `npm run smoke:mdkg-dev` passed.
- `npm run smoke:mdkg-dev-seo` passed.
- Browser QA passed for `/`, `/quickstart/`, `/trust/`, and `/docs/` at `1440x900` and `390x844`: no horizontal overflow, no code-block overflow, no narrow CTA buttons, and no console errors.
- Product Design brief used: restrained OSS developer-tool site, existing white/zinc plus blue/sky/teal system, static-first pages, mostly static interactivity, no generic AI hype.
- Screenshot evidence saved locally:
  - `/private/tmp/mdkg-goal30-task493-home-desktop.png`
  - `/private/tmp/mdkg-goal30-task493-home-mobile.png`
