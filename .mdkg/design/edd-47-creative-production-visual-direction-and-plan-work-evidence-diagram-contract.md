---
id: edd-47
type: edd
title: Creative Production visual direction and Plan Work Evidence diagram contract
tags: [mdkg-dev, creative-production, visual-design]
owners: []
links: []
artifacts: []
relates: [goal-34, task-546, test-267]
refs: [archive://archive.mdkg-dev-preview-audit-pass-4-2026-06-24, edd-28]
aliases: []
created: 2026-06-24
updated: 2026-06-24
---
# Overview

The audit recommends one polished static diagram for Plan -> Work -> Evidence and a more professional homepage feel. Pass-4 uses Creative Production as a visual direction lens without turning this into an asset-generation project.

# Architecture

- Treat Plan -> Work -> Evidence as the single public operating model.
- Implement the diagram CSS/HTML first for accessibility, crawlability, and performance.
- Use Creative Production to critique visual hierarchy, diagram direction, CTA density, and launch-quality creative polish.
- Defer generated image/video assets to follow-up unless explicitly rescoped.

# Data model

Creative QA record: reviewed routes, visual hierarchy notes, diagram critique, copy-direction notes, accepted changes, and deferred asset candidates.

# APIs / interfaces

No new mdkg CLI surface. Evidence is recorded in checkpoints and possibly future mdkg design nodes.

# Failure modes

- Diagram becomes decorative rather than explanatory.
- Generated asset work distracts from concrete launch-quality polish.
- Visual critique lacks route/screenshots; require evidence-backed review.

# Observability

Checkpoint links screenshots or Browser/Chrome captures used for the review.

# Security / privacy

Creative review must not leak private prompt content, tokens, provider payloads, or unpublished user data.

# Testing strategy

Product Design and Creative Production reviews both need checkpoint evidence. Browser/Chrome must confirm diagram responsiveness and reduced-motion safety.

# Rollout plan

Apply visual and copy polish after command/docs structural fixes, so review evaluates near-final content.
