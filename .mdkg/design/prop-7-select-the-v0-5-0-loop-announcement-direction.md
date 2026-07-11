---
id: prop-7
type: prop
title: Select the v0.5.0 loop announcement direction
tags: [release, product-design, loops, selection]
owners: []
links: []
artifacts: [.mdkg/artifacts/goal-62/announcement-directions/01-process-rail.png, .mdkg/artifacts/goal-62/announcement-directions/02-readiness-ledger.png, .mdkg/artifacts/goal-62/announcement-directions/03-template-catalog.png]
relates: [goal-62, task-713, test-385]
refs: [dec-73, dec-74, task-711, task-712]
aliases: []
created: 2026-07-10
updated: 2026-07-11
---
# Summary

Select one of exactly three screenshot-grounded directions for the incremental
v0.5.0 announcement immediately after the existing mdkg.dev quickstart. The
selection changes only the new section's information hierarchy; the hero,
quickstart, global navigation, design system, and generic first-use path remain
unchanged.

# Motivation

The announcement must explain a first-class process node without making mdkg
look like an agent runtime or turning the homepage into a feature catalog. A
visual direction is needed before exact copy, responsive behavior, accessibility
criteria, and Goal 63 implementation work can be locked.

# Proposal

## Direction 1: Process Rail

Artifact: `01-process-rail.png`

- Leads with the core category: reusable loops for work spanning more than one
  goal.
- Uses one dark, grouped four-stage rail for fork, readiness, next-work routing,
  and evidence.
- Preserves the accepted security CTA and loop-overview link.
- Best at teaching the basic workflow in one scan.

Mobile behavior:

- Stack message, full-width primary CTA, text-only secondary link, then the
  process rail.
- Collapse each stage to label plus one short explanation; use at most one
  supported command per stage and horizontal scroll only inside command text.
- Keep the section within approximately one and a half 390x844 viewports.

Docs mapping:

- Primary CTA -> purpose-built Security audit walkthrough.
- Secondary link -> Loops overview.
- Four stages map to Templates and forks plus
  Readiness/routing/evidence/closeout.

Required refinement:

- The generated concept includes an illustrative unsupported `mdkg note add`
  command. It must be replaced by supported evidence/closeout wording or exact
  generated CLI syntax before implementation.

## Direction 2: Readiness Ledger

Artifact: `02-readiness-ledger.png`

- Leads with blocker-aware continuation and explicit gates.
- Uses one calm ledger for questions, approvals, evidence, provenance, and
  closeout.
- States the mdkg-versus-harness execution boundary most directly.
- Best at expressing the differentiated operating model with minimal command
  drift.

Mobile behavior:

- Stack copy and actions before the ledger.
- Keep each ledger row to a label, short explanation, and readable status;
  status moves to its own line when necessary.
- Use one full-width `mdkg loop plan LOOP_ID` command strip at the end.

Docs mapping:

- Primary CTA -> Security audit walkthrough.
- Secondary link -> Loops overview.
- Ledger rows map directly to the Readiness/routing/evidence/closeout page;
  provenance links onward to Templates and forks.

Required refinement:

- Preserve the useful runtime-boundary paragraph, but shorten it for mobile and
  keep the announcement from reading like an operational dashboard.

## Direction 3: Template Catalog

Artifact: `03-template-catalog.png`

- Leads with reusable starting points and makes security plus three secondary
  audit families visible.
- Uses one grouped list and a compact fork-preview strip rather than a grid of
  cards.
- Best at proving breadth and discoverability.

Mobile behavior:

- Stack copy/actions first, then a single list with security highlighted.
- Keep four rows maximum in the announcement; the complete seven-template
  catalog belongs in docs.
- Make command strips horizontally scrollable and keep explanatory footnotes
  outside the bordered list.

Docs mapping:

- Primary CTA -> Security audit walkthrough.
- Secondary link -> Loops overview.
- Template list -> Templates and forks; the complete catalog remains a docs
  responsibility.

Required refinement:

- Remove the generated `Recommended` badge unless the final content decision
  explicitly authorizes it. Do not imply all seven templates share one mode.

## Recommendation

Choose **Direction 1** as the base because it communicates the new category and
workflow most clearly to a first-time visitor. Incorporate Direction 2's
explicit sentence that mdkg preserves process state while the coding-agent
harness executes agents and tools. Keep Direction 3's catalog treatment for the
Templates and forks documentation page rather than the homepage announcement.

The operator accepted this recommendation on 2026-07-11. Direction 1 is the
implementation base, Direction 2 contributes the explicit runtime-boundary
sentence, and Direction 3 remains a documentation pattern for Templates and
forks rather than a homepage composition.

# Accepted Selection

- Base artifact: `01-process-rail.png`.
- Required refinement from Direction 2: `mdkg preserves the process; your
  coding-agent harness executes agents and tools.`
- Headline: `Reusable loops for work that spans more than one goal.`
- Eyebrow: `New in v0.5.0 · Pre-v1 public alpha`
- Body: `Fork a read-only audit template, answer readiness questions, route the
  next authorized work, and keep decisions and evidence in your mdkg graph.
  mdkg preserves the process; your coding-agent harness executes agents and
  tools.`
- Primary CTA: `Run a security audit loop`.
- Secondary link: `Learn how loops work`.
- Proof stages: Fork a template, Resolve readiness, Route authorized work, and
  Inspect evidence and closeout.
- Supported command anchors: `mdkg loop fork security-audit --scope . --dry-run`,
  `mdkg loop plan LOOP_ID`, `mdkg loop next LOOP_ID`, and
  `mdkg loop runs LOOP_ID`.
- The generated `mdkg note add` text is illustrative and prohibited from public
  implementation because that command does not exist.

Rejected as the homepage base:

- Direction 2 is too abstract before the loop category and workflow are taught;
  its runtime-boundary language is retained.
- Direction 3 is too catalog-heavy for the incremental announcement; its list
  treatment belongs on the Templates and forks page.

# Impact

The accepted direction will set the announcement's hierarchy, mobile stacking,
proof element, and copy budget. It will also determine which visual pattern Goal
63 implements and which details stay in the top-level Loops documentation.

# Risks

- Direction 1 can drift into unsupported command syntax if illustrative text is
  copied literally instead of reconciled with generated CLI reference.
- Direction 2 can feel abstract if readiness language appears before the loop
  category is explained.
- Direction 3 can overload the release announcement and dilute the security
  walkthrough CTA.
- Any direction can accidentally compete with generic quickstart if its heading,
  height, or action count grows during implementation.

# Alternatives

- Redesign the hero or first viewport. Rejected by `dec-73`.
- Add a dedicated marketing release page. Rejected by `dec-73`.
- Publish a text-only announcement without visual selection. Rejected because
  the implementation contract needs an explicit responsive hierarchy.

# Next Steps

- Record the selection and `prop-8` contract in accepted `dec-74`.
- Finalize routes, responsive/accessibility behavior, and dormant activation in
  `task-714`.
- Seed Goal 63 only after the complete contract is accepted.
