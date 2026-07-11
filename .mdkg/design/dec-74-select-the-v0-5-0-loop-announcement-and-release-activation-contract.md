---
id: dec-74
type: dec
title: Select the v0.5.0 loop announcement and release activation contract
status: accepted
tags: [release, product-design, activation, loops]
owners: []
links: []
artifacts: [.mdkg/artifacts/goal-62/announcement-directions/01-process-rail.png, .mdkg/artifacts/goal-62/announcement-directions/02-readiness-ledger.png, .mdkg/artifacts/goal-62/announcement-directions/03-template-catalog.png]
relates: [goal-62, goal-63, goal-64, task-713, task-714, test-385, test-386]
refs: [dec-73, prop-7, prop-8, task-710, task-711, task-712]
aliases: []
created: 2026-07-10
updated: 2026-07-11
---
# Context

The release capability ledger, value story, current-site audit, and exactly three
incremental announcement directions are complete. The operator selected the
recommended Process Rail composition on 2026-07-11 and accepted the runtime
boundary from the Readiness Ledger. `prop-8` provides the compatible information
architecture, security walkthrough, accessibility, SEO, and shared activation
contract.

# Decision

**Accepted.**

Use Direction 1, `01-process-rail.png`, as the implementation base. Incorporate
Direction 2's explicit statement that mdkg preserves process state while an
external coding-agent harness executes agents and tools. Use Direction 3's
catalog treatment only on the Templates and forks documentation page.

The accepted homepage announcement contract is:

- Placement: immediately after the existing generic quickstart, without
  changing the hero, quickstart, navigation, or broader homepage structure.
- Eyebrow: `New in v0.5.0 · Pre-v1 public alpha`
- Headline: `Reusable loops for work that spans more than one goal.`
- Body: `Fork a read-only audit template, answer readiness questions, route the
  next authorized work, and keep decisions and evidence in your mdkg graph.
  mdkg preserves the process; your coding-agent harness executes agents and
  tools.`
- Primary CTA: `Run a security audit loop`, linking to
  `/loops/security-audit/`.
- Secondary text link: `Learn how loops work`, linking to `/loops/`.
- Proof: one ordered four-stage process rail labeled `Fork a template`,
  `Resolve readiness`, `Route authorized work`, and
  `Inspect evidence and closeout`.
- Supported command anchors: `mdkg loop fork security-audit --scope . --dry-run`,
  `mdkg loop plan LOOP_ID`, `mdkg loop next LOOP_ID`, and
  `mdkg loop runs LOOP_ID`.

At 900px and below, source order and visual order are copy, full-width primary
CTA, secondary text link, then four compact proof rows. Each row contains at
most one command; command text may scroll within its own container, while the
page must not overflow. The section remains approximately 1.5 390x844
viewports or less.

Accept `prop-8` in full as the implementation contract for:

1. The top-level Loops documentation routes and security-first walkthrough.
2. The shared root `release/public-release.json` manifest and strict
   draft/published/preview projection.
3. Dormant route, navigation, metadata, sitemap, Pagefind, LLM, robots, and
   version-claim suppression.
4. WCAG AA, keyboard, focus, reflow, theme, SEO, link, and no-secret criteria.
5. Purpose-built examples that use placeholders and generated CLI truth.
6. Goal 63's implementation and verification blueprint.

The generated bitmap is visual direction only. Goal 63 must not copy its
unsupported `mdkg note add` command or any other illustrative syntax that is
absent from the generated CLI contract.

# Alternatives considered

- Direction 1: process rail. Accepted because it teaches category and workflow
  in one scan, after removing unsupported illustrative syntax.
- Direction 2: readiness ledger. Rejected as the base because readiness is too
  abstract before the category is understood; its runtime boundary is retained.
- Direction 3: template catalog. Rejected as the base because it overloads the
  announcement; its catalog treatment moves to documentation.
- Hero redesign or dedicated release page. Already rejected by `dec-73`.

# Consequences

`task-713` and `test-385` can close. Goal 62 may finalize the contract and seed
Goal 63 without reopening visual, copy, route, release-state, or information-
architecture choices. Goal 63 must implement locally with the manifest still
`draft`; Goal 64 alone may publish and activate it.

# Links / references

- `dec-73`
- `prop-7`
- `prop-8`
- `task-713`
- `task-714`
- `test-385`
- `test-386`
- `goal-63`
- `goal-64`
