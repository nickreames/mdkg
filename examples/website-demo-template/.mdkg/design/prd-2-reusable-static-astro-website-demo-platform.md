---
id: prd-2
type: prd
title: Reusable static Astro website demo platform
tags: [website-demo, static-astro, source-template]
owners: []
links: []
artifacts: [README.md, DESIGN.md, WEBSITE_DEMO_TEMPLATE_BRIEF.md, DEMO_HANDOFF_PROMPT.md]
relates: []
refs: [goal-1, epic-1, edd-1, dec-1, dec-2]
aliases: [reusable-website-demo-platform]
created: 2026-07-26
updated: 2026-07-26
---
# Problem

AI coding agents can generate visually interesting landing pages, but a reusable
demo needs more than a prompt. It needs a stable product contract that carries
requirements, authority boundaries, test expectations, and public-safe evidence
into each specialized run without dictating the final composition.

The primary user is a coding agent executing a forked demo goal. The reviewer is
the human or caller deciding whether a locally accepted candidate should be
discarded, reworked, or considered for separately authorized integration.

# Goals

- Start every run from one packable `goal-1` and route deterministically to
  `spike-1`.
- Preserve a static Astro, semantic HTML, CSS, and zero-client-JavaScript
  implementation boundary.
- Keep Ocean Flow constraints fixed while allowing each run to choose audience,
  offer, structure, visual metaphor, imagery, and bounded marketing copy.
- Make Plan -> Work -> Evidence inspectable through the goal, work chain,
  validation, and checkpoint.
- Return a validated local candidate plus a caller-owned integration
  recommendation.

# Non-goals

- Selecting one permanent visual composition for every run.
- Teaching graph-fork mechanics in the generated marketing page.
- Committing, pushing, deploying, changing DNS, activating analytics,
  publishing packages, or mutating providers from the source template.
- Retaining raw prompts, credentials, tokens, cookies, provider payloads,
  unrelated private context, or bulky runtime traces.

# Requirements

## Functional

- `goal-1` scopes the deterministic `spike-1 -> task-1 -> test-1` chain.
- `spike-1` records audience, offer, section plan, creative direction,
  source-backed content facts, asset plan, risks, and explicit non-goals.
- `task-1` produces a complete local static Astro website candidate.
- `test-1` records build, route, accessibility, claims, public-safety,
  zero-JavaScript, and asset-budget evidence.
- Closeout records discard, rework, or caller-owned integration as the next
  decision.
- A fresh-agent concise and standard pack contains this PRD, the EDD, accepted
  decisions, predecessor checkpoint, complete work chain, and required skills.

## Non-functional

- Static semantic HTML and CSS only; no `client:*` directives, hydration
  metadata, generated client JavaScript, runtime scripts, remote fonts,
  analytics, forms, trackers, or third-party runtime assets.
- Ocean Flow palette, keyboard accessibility, visible focus, reduced-motion
  support, and WCAG AA contrast.
- Maximum 500 KiB initial page transfer and 250 KiB per raster asset.
- Local-first and public-safe by default, with every Git or provider side effect
  assigned to a separate caller-owned authority gate.

# Acceptance Criteria

- `mdkg validate --json` passes with zero warnings or errors.
- `mdkg goal next goal-1 --json` selects `spike-1` without warnings.
- Context-complete concise and standard packs contain `prd-2`, `edd-1`,
  `dec-1`, `dec-2`, `chk-2`, the full work chain, and required skills.
- A specialized run can change positioning and visual execution without
  weakening fixed stack, safety, accessibility, budget, or authority
  requirements.
- A locally accepted run includes inspectable completion evidence and a clear
  next decision.

# Metrics / Success

- Fresh-agent startup succeeds from `goal-1` without hidden chat context.
- Required pack QIDs and skill mirrors are deterministic across repeat
  bootstrap verification.
- Local validation records zero missing routes, unexpected client JavaScript,
  unsafe fields, or unmeasured acceptance cases.

# Risks

- Creative output becomes generic because constraints are mistaken for a fixed
  layout.
- Marketing copy overstates mdkg capabilities or implies that mdkg executes
  coding work.
- A caller accidentally treats a local checkpoint as publication authority.
- Evidence leaks raw execution context instead of retaining compact,
  public-safe receipts.

# Open Questions

- Which audience, offer, composition, and proof metaphor should this run choose?
- Should an accepted local candidate be discarded, reworked, or returned for a
  separately authorized integration decision?
