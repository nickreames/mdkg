---
id: edd-37
type: edd
title: mdkg.dev pass 2 responsive accessibility and code-block QA contract
tags: [mdkg-dev, accessibility, responsive, code-blocks, product-design]
owners: []
links: [https://mdkg-dev.vercel.app/, https://mdkg-docs.vercel.app/]
artifacts: [mdkg_preview_polish_pass2]
relates: []
refs: [archive://archive.mdkg-dev-preview-polish-pass-2-2026-06-24]
aliases: [mdkg-dev-pass-2-qa-contract]
created: 2026-06-23
updated: 2026-06-23
---
# Overview

Pass 2 treats responsive behavior, command readability, and accessibility basics as product trust requirements.

# Architecture

Browser/Chrome validation must cover marketing and docs routes at:

- Desktop `1440x900`.
- Mobile `390x844`.
- One tablet-ish width.

# Data Model

Evidence is recorded in mdkg checkpoints only for this pass. Screenshots may be referenced in ephemeral receipts, but the durable closeout should summarize observations, commands, pass/fail state, and follow-up refs.

# APIs / Interfaces

- Code and terminal blocks must preserve newlines, remain readable on mobile, and avoid horizontal page overflow.
- External links must use new tabs with safe `noopener noreferrer` behavior where applicable.
- Focus states, contrast, and target sizes should be reviewed through Product Design and Browser QA.

# Failure Modes

- Command blocks collapse into unreadable prose.
- Mobile nav or code blocks overflow.
- Public copy hides CTAs below confused first-screen hierarchy.
- Product Design review produces subjective notes without actionable checkpoint evidence.

# Testing Strategy

- Local Browser and Chrome route sweeps.
- Console-error review.
- Responsive screenshots/checkpoint summaries.
- Automated smoke for command block line breaks and public page markers where practical.

# Links / References

- `goal-32`
- `task-515`
- `test-244`
- `prd-7`

# Observability

# Security / privacy

# Rollout plan
