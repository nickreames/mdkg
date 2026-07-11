---
id: task-712
type: task
title: Capture current site screenshots and run Product Design audit
status: done
priority: 1
epic: epic-230
prev: task-711
next: task-713
tags: [release, product-design, audit, screenshots]
owners: []
links: []
artifacts: [.mdkg/artifacts/goal-62/product-design-audit-2026-07-10]
relates: [goal-62, test-385]
blocked_by: [task-711]
blocks: [task-713]
refs: [test-385]
context_refs: [goal-62, epic-230, edd-71, dec-68, dec-73, prd-11, task-711]
evidence_refs: []
aliases: []
skills: []
created: 2026-07-10
updated: 2026-07-10
---
# Overview

Capture fresh desktop and mobile screenshots of mdkg.dev and docs.mdkg.dev and
run Product Design Audit before proposing release changes.

# Acceptance Criteria

- Fresh desktop and mobile screenshots cover the mdkg.dev homepage hero,
  quickstart and exact post-quickstart insertion boundary, quickstart page,
  docs landing/navigation, install, agent workflow, generated CLI reference,
  and changelog.
- Audit reports UX, visual hierarchy, contrast, accessibility, consistency, and
  release-message opportunities tied to screenshot evidence.
- Findings are prioritized as release blocker, recommended, or follow-up.
- Audit evaluates incremental announcement placement and top-level Loops
  discoverability without proposing a broad hero or homepage redesign.

# Files Affected

List files/directories expected to change.

- Planning artifacts and screenshot evidence only
- No website/docs source edits

# Implementation Notes

- Use Product Design `audit` and in-app Browser.
- Do not create Figma unless the operator explicitly requests it.
- Screenshot findings may identify accessibility risks, but Goal 3 must perform
  keyboard, semantic, contrast, and responsive implementation checks.

# Capture Method And Limits

The current public sites were captured on 2026-07-10. Product Design `audit`
was run screenshot-first. The Codex in-app Browser loaded and exposed the
correct live DOM but repeatedly timed out while capturing screenshots, including
from a fresh tab. Per the Product Design browser policy, capture moved to the
Chrome fallback. Every accepted Chrome screenshot was saved locally and
reopened for inspection.

- Desktop evidence uses the normal Chrome viewport at approximately 1728x900.
- Mobile evidence uses a 390x844 emulated viewport, reset after each capture.
- Static screenshots can identify visible hierarchy, layout, and likely
  contrast/touch-target risks. They cannot prove keyboard flow, accessible-name
  correctness, focus visibility, reduced-motion behavior, or WCAG conformance.
- No source, public route, navigation, metadata, or deployment was changed.

# Screenshot Index

All paths are under
`.mdkg/artifacts/goal-62/product-design-audit-2026-07-10/`.

| Step | Surface | Desktop | Mobile | Health |
| --- | --- | --- | --- | --- |
| 1 | mdkg.dev homepage hero | `01-homepage-desktop.png` | `02-homepage-mobile.png` | Healthy; strong product signal and intact hierarchy |
| 2 | Homepage quickstart and exact post-quickstart boundary | `03-homepage-quickstart-boundary-desktop.png` | `04-homepage-quickstart-boundary-mobile.png` | Healthy insertion point; mobile vertical cost needs restraint |
| 3 | mdkg.dev quickstart | `05-quickstart-desktop.png` | `06-quickstart-mobile.png` | Healthy and deterministic; preserve as primary path |
| 4 | docs landing and navigation | `07-docs-home-navigation-desktop.png` | `08-docs-home-navigation-mobile.png` | Healthy base; no first-class Loops destination yet |
| 5 | install guide | `09-install-desktop.png` | `10-install-mobile.png` | Healthy; clear version/runtime facts |
| 6 | agent workflow guide | `11-agent-workflow-desktop.png` | `12-agent-workflow-mobile.png` | Healthy; mobile inline commands wrap densely |
| 7 | generated CLI reference | `13-cli-reference-desktop.png` | `14-cli-reference-mobile.png` | Healthy reference shell; loop family absent from current 0.4.2 public state |
| 8 | changelog | `15-changelog-desktop.png` | `16-changelog-mobile.png` | Healthy release pattern; correctly advertises 0.4.2 only |

# Product Design Audit

## Overall Verdict

The current mdkg.dev and docs.mdkg.dev systems are visually coherent, readable,
and suitable for an incremental loop release. The homepage already gives the
generic operating model and quickstart the strongest hierarchy. The release
should add one distinct but restrained announcement band after quickstart,
without changing the hero, global navigation, or primary first-use CTA.

The docs use a conventional, dense Starlight information architecture that can
support a top-level Loops group. The new group should make loops discoverable
without overloading Start Here or scattering a first-class node type across
Concepts and Guides.

## Evidence-Tied Strengths

- **Homepage hierarchy:** `01` and `02` show a clear brand, literal value
  proposition, public-alpha qualifier, and three obvious primary actions. The
  hero-scale typography remains legible at 390px without clipping.
- **Insertion boundary:** `03` and `04` show a full-width transition after the
  generic quickstart. It can carry a release announcement as a peer section,
  not a card nested inside the quickstart.
- **Quickstart clarity:** `05` and `06` use concise command blocks and supporting
  constraints. This must remain the generic first-use path.
- **Documentation consistency:** `07` through `16` share predictable navigation,
  typography, code styling, and content widths. New loop pages should use these
  native Starlight patterns rather than a custom microsite treatment.
- **Version truth:** `09`, `10`, `15`, and `16` clearly expose current runtime
  and 0.4.2 release facts. They provide the pattern Goal 64 must update only
  after npm verification.

## Release Blockers

1. **B1 - Release state must gate all loop promotion.** The homepage section,
   Loops navigation, walkthrough routes, metadata, sitemap/LLM entries, and
   version facts must remain unavailable/non-indexable while the shared manifest
   is draft. This is not visible in current screenshots and needs explicit Goal
   3 browser/metadata tests.
2. **B2 - The announcement must not compete with quickstart.** In `03` and `04`,
   quickstart is already a substantial primary section. The new band must begin
   after it, use one primary CTA plus one secondary text link, and avoid a second
   install flow or hero-scale headline.
3. **B3 - Loops must be first-class in docs navigation.** `07` shows no Loops
   group. Published state must add one top-level group, visible on desktop and
   inside the mobile menu, with Overview, Templates and forks, Readiness/routing/
   evidence/closeout, and Security audit walkthrough.
4. **B4 - Responsive command content cannot overflow or become unreadable.**
   `12` and `14` show that inline code already wraps densely at 390px. The
   security walkthrough must use fenced command blocks for sequences, allow
   horizontal code scrolling where necessary, and avoid long inline command
   chains inside prose or numbered lists.
5. **B5 - Accessibility needs runtime proof.** Static captures cannot prove
   contrast, keyboard order, focus visibility, menu semantics, or target size.
   Goal 3 must verify WCAG AA text/interactive contrast, visible focus, keyboard
   access to both announcement links and mobile docs navigation, semantic
   headings/landmarks, and no reduced-motion or zoom regressions.

## Recommended For v0.5.0

1. **R1 - Reuse existing visual grammar.** Match the homepage's white/light-blue
   bands, black typography, blue eyebrow, restrained border, dark command panel,
   and existing blue-to-teal primary CTA. Do not introduce a new palette,
   illustration system, or decorative gradient background.
2. **R2 - Make the section explain one workflow.** Use a concise category signal,
   source-backed headline, two-sentence explanation, `Run a security audit loop`
   CTA, `Learn how loops work` text link, and one compact process/proof element.
3. **R3 - Preserve mobile momentum.** On mobile, stack narrative before proof,
   keep the primary CTA full width, keep the secondary link text-only, and make
   the proof element scannable within roughly one additional viewport.
4. **R4 - Place Loops after Concepts and before Guides.** This keeps first-class
   semantics near concepts while grouping the complete conceptual/procedural
   loop lifecycle in one discoverable section.
5. **R5 - Use purpose-built walkthrough output.** Show template discovery,
   observational fork preview, real fork, readiness, next, evidence, and
   closeout in small verified excerpts. Avoid internal ids, raw dogfood receipts,
   or claims that mdkg executes the audit.
6. **R6 - Keep version facts in existing surfaces.** Add upgrade guidance to
   Install, exact release facts to Changelog, and exact syntax to generated CLI
   reference; do not duplicate those contracts in the homepage section.

## Follow-Up, Not A v0.5.0 Blocker

- **F1:** The mdkg.dev mobile navigation in `02` wraps into a dense two-line row.
  It remains usable at 390px, but broader navigation redesign belongs in the
  separate site/CLI UX lane. Do not add a homepage `Loops` nav item in this pass.
- **F2:** The desktop docs sidebar in `07`, `09`, `11`, `13`, and `15` is dense.
  A broader information-architecture cleanup can follow after the top-level
  Loops group is dogfooded.
- **F3:** The homepage hero's scale and two-column composition can be revisited
  in future brand work, but neither blocks this incremental release.
- **F4:** Customer-language testing and outcome metrics are Missing. They are not
  required for a source-backed Pre-v1 public-alpha announcement.

# Ideation Brief Derived From Audit

Exactly three directions should explore the announcement section only:

- Preserve the page above and below the insertion boundary shown in `03`/`04`.
- Use the accepted value hierarchy and security CTA from `task-711`.
- Reuse current typography, spacing, border, command-panel, and button language.
- Vary only the section's information composition: process, readiness/evidence,
  or template catalog/proof emphasis.
- Each direction must include desktop and written mobile behavior, plus a clear
  mapping to the top-level Loops docs group.

# Test Plan

Review the screenshot set and audit findings with the operator before ideation.

# Results / Evidence

- Sixteen fresh screenshots cover all required surfaces and viewport classes.
- Every accepted file was saved and inspected; none is blank, loading, cropped
  to the wrong state, or a stale prior artifact.
- Findings are classified as release blocker, recommended, or follow-up and
  stay within the incremental announcement/top-level Loops scope.
- The audit is ready to ground exactly three visual directions in `task-713`.

# Links / Artifacts

- `edd-71`
- `dec-73`
- `prd-11`
