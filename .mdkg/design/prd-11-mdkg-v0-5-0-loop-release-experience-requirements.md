---
id: prd-11
type: prd
title: mdkg v0.5.0 loop release experience requirements
tags: [release, product, mdkg-dev, docs, loop]
owners: []
links: []
artifacts: []
relates: [goal-62, goal-63]
refs: [goal-61, goal-62, goal-63, edd-71, dec-68, dec-73]
aliases: [v0-5-0-loop-release-experience]
created: 2026-07-10
updated: 2026-07-10
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

## Non-functional

- Every capability claim is source-backed or explicitly evidence-labeled.
- Desktop/mobile layouts meet accepted accessibility and contrast criteria.
- Generated command reference remains authoritative for exact CLI syntax.
- Local preview can render the active release state while committed default
  remains dormant through Goal 3.
- Dormant production excludes release navigation, routes or route content,
  metadata, sitemap/LLM entries, indexing, and premature v0.5.0 version claims.

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

# Open Questions

- Which of the three announcement-section variants should be implemented?
- What exact source-backed headline, supporting copy, and secondary-link wording
  best express the accepted hierarchy?
- Which screenshot-audit findings are v0.5.0 blockers versus follow-up work?
