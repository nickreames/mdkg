---
id: prd-11
type: prd
title: mdkg v0.5.0 loop release experience requirements
tags: [release, product, mdkg-dev, docs, loop]
owners: []
links: []
artifacts: []
relates: [goal-62, goal-63]
refs: [goal-61, goal-62, goal-63, edd-71, dec-68, dec-73, dec-74, prop-7, prop-8]
aliases: [v0-5-0-loop-release-experience]
created: 2026-07-10
updated: 2026-07-11
---
# Problem

AI coding teams and agent-harness engineers need to understand what mdkg loops
add beyond goals, how to try them safely, and which behaviors are actually
available in `v0.5.0`. Existing public surfaces do not yet teach the complete
loop lifecycle or package-first release story.

# Goals

- Explain loops, goals, templates, forks, readiness, continuation, provenance,
  evidence, and closeout with verified examples.
- Give users a short path from install to listing, forking, planning, routing,
  and inspecting a read-only audit loop.
- Align mdkg.dev positioning and docs.mdkg.dev reference/procedural content.
- Meet responsive, accessible, SEO, no-secret, and public-alpha quality bars.

# Non-goals

- Do not market mdkg as an agent runtime, model router, sandbox, or approval
  execution system.
- Do not claim ROI, adoption, or competitive outcomes without evidence.
- Do not activate or deploy public release content from the planning or local
  implementation goals.

# Requirements

## Functional

- Homepage provides a concise v0.5.0 loop capability signal and path to docs.
- The homepage signal is an incremental announcement immediately after the
  existing quickstart; it does not replace the hero or generic quickstart.
- The announcement CTA is `Run a security audit loop`, with a secondary link to
  the loop overview.
- The announcement implements the Process Rail selected in `dec-74` with this
  exact public contract:
  - eyebrow: `New in v0.5.0 · Pre-v1 public alpha`;
  - headline: `Reusable loops for work that spans more than one goal.`;
  - body: `Fork a read-only audit template, answer readiness questions, route
    the next authorized work, and keep decisions and evidence in your mdkg
    graph. mdkg preserves the process; your coding-agent harness executes agents
    and tools.`;
  - proof stages: Fork a template, Resolve readiness, Route authorized work,
    and Inspect evidence and closeout.
- Docs add a top-level Loops group containing overview, templates/forks,
  readiness/routing/evidence/closeout, and a purpose-built security walkthrough.
- Existing install/upgrade surfaces own upgrade guidance; changelog/release
  notes own version facts; generated CLI reference owns exact command syntax.
- Copy distinguishes goal outcomes from loop processes and explains blocker
  recovery without promising autonomous runtime execution.
- `Read-only audit` means no functional source edits while allowing durable mdkg
  findings, follow-up work, decisions, checkpoints, receipts, and evidence.
- A shared release manifest controls both sites and keeps draft release routes
  unavailable and non-indexable.
- Goal 2 captures exactly three announcement-section directions and an operator
  selection, not three full homepage designs.
- Public examples use only supported generated CLI syntax and placeholders;
  `mdkg note add` and other illustrative nonexistent commands are prohibited.

## Non-functional

- Every capability claim is source-backed or explicitly evidence-labeled.
- Desktop/mobile layouts meet accepted accessibility and contrast criteria.
- Generated command reference remains authoritative for exact CLI syntax.
- Local preview can render the active release state while committed default
  remains dormant through Goal 3.
- Dormant production excludes release navigation, routes or route content,
  metadata, sitemap/LLM entries, indexing, and premature v0.5.0 version claims.
- At 900px and below, the announcement stacks copy/actions before four compact
  proof rows; at 560px and below the CTA is full width. The page must reflow at
  320px and 200% zoom with contained code overflow and no horizontal page
  overflow.
- WCAG AA contrast, visible keyboard focus, semantic section/list structure,
  44px intended pointer targets, reduced motion, forced colors, and Starlight
  light/dark/auto behavior require automated and browser evidence.

# Acceptance Criteria

- Accepted EDD/DEC/PRD and design artifacts fully seed `goal-63`.
- Goal 3 includes exact copy, route, asset, responsive, accessibility, build,
  and browser test work.
- Goal 4 can activate release promotion through one deterministic change after
  npm verification.

# Metrics / Success

Planning succeeds when claim provenance is complete, the operator accepts a
visual/content direction, Goal 3 packs deterministically, and no implementation
or production side effects occurred.

# Risks

- Site copy can outrun package truth if activation is not gated.
- Visual exploration can widen scope beyond the loop release.
- Generated CLI and hand-written examples can drift.
- Internal provider/release evidence can leak into public positioning.

# Accepted Direction

- Preserve the current hero and quickstart; add the announcement directly below.
- Use security as the primary walkthrough and backend/API/CLI bloat as secondary.
- Use purpose-built examples rather than copied dogfood output.
- Add a top-level Loops docs group.
- Retain `Pre-v1 public alpha` and keep dormant content unavailable/noindex.
- Do not add a dedicated marketing release page.
- Treat Product Design audit blockers B1 through B5 as v0.5.0 requirements and
  recommendations R1 through R6 as accepted implementation guidance.
- Leave mobile marketing navigation redesign, broad docs-sidebar cleanup, hero
  redesign, and customer-outcome measurement as post-v0.5.0 follow-ups.

# Resolved Decisions

- Process Rail is the implementation base; Readiness Ledger contributes only the
  runtime-boundary language; Template Catalog informs the Templates and forks
  docs page.
- Exact copy, actions, proof labels, supported command anchors, mobile behavior,
  routes, release-state projection, and acceptance criteria are locked in
  `dec-74` and accepted `prop-8`.
- Audit B1-B5 are release blockers; F1-F4 remain explicit follow-up work.

# Open Questions

None. Any implementation discovery that would change copy, routes, activation,
runtime ownership, or release scope must return through a new proposal/decision
rather than being inferred inside Goal 63.
