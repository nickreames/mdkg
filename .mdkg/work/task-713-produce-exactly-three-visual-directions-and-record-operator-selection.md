---
id: task-713
type: task
title: Produce exactly three visual directions and record operator selection
status: done
priority: 1
epic: epic-230
prev: task-712
next: task-714
tags: [release, product-design, ideation, decision]
owners: []
links: []
artifacts: [.mdkg/artifacts/goal-62/announcement-directions/01-process-rail.png, .mdkg/artifacts/goal-62/announcement-directions/02-readiness-ledger.png, .mdkg/artifacts/goal-62/announcement-directions/03-template-catalog.png]
relates: [goal-62, test-385]
blocked_by: [task-712]
blocks: [task-714]
refs: [test-385, prop-7, dec-74]
context_refs: [goal-62, epic-230, edd-71, dec-68, dec-73, dec-74, prd-11, task-712, prop-7]
evidence_refs: []
aliases: []
skills: []
created: 2026-07-10
updated: 2026-07-11
---
# Overview

Use Product Design Ideate to create exactly three independent variants of the
post-quickstart v0.5.0 loop announcement, grounded in the accepted current
homepage screenshot, audit, and value story, then stop for operator choice.

# Acceptance Criteria

- Exactly three image-based announcement-section variants are produced with
  clear rationale and mapping to the existing design system.
- Each direction preserves the current hero and quickstart, shows the security
  CTA plus overview link, and includes written mobile behavior and top-level
  Loops docs-system mapping.
- Operator selection, requested refinements, rejected alternatives, and rationale
  are captured in a decision/proposal record.

# Files Affected

List files/directories expected to change.

- Product Design ideation artifacts and mdkg decisions only

# Implementation Notes

- Do not implement any direction in this task.
- Pause after presentation; do not infer selection.
- Do not generate three full-homepage redesigns or widen into unrelated brand
  exploration.

# Generated Directions

Product Design `ideate` produced exactly three independent, screenshot-grounded
images on 2026-07-10. Each image preserves the current quickstart above the new
section, uses the accepted security CTA and overview link, and stays within the
existing mdkg.dev design language.

1. `01-process-rail.png`: category and four-stage workflow emphasis.
2. `02-readiness-ledger.png`: readiness, approvals, evidence, provenance, and
   closeout emphasis.
3. `03-template-catalog.png`: reusable audit-template breadth emphasis.

`prop-7` records each rationale, required refinement, 390px mobile behavior,
top-level Loops docs mapping, risks, and an advisory recommendation.

# Selection State

- Operator selection: **accepted on 2026-07-11**.
- Base: Direction 1, Process Rail.
- Required refinement: Direction 2's explicit mdkg-versus-agent-harness runtime
  boundary.
- Documentation reuse: Direction 3's catalog treatment belongs on Templates and
  forks, not the homepage.
- Accepted copy, proof labels, commands, mobile behavior, and rejected
  alternatives are durable in `dec-74`.
- No direction has been implemented; Goal 63 remains the implementation owner.

# Test Plan

`test-385` requires three artifacts plus explicit operator acceptance before the
next task is actionable.

# Results / Evidence

- Exactly three image artifacts exist under
  `.mdkg/artifacts/goal-62/announcement-directions/` and were reopened for
  visual inspection after copying from the generated-image workspace.
- All three are incremental post-quickstart sections, not homepage redesigns.
- Every direction includes the security CTA, loop-overview link, existing visual
  system, and a purpose-built process/readiness/template proof element.
- Written mobile and docs mappings are complete in `prop-7`.
- The operator selected Process Rail with the runtime-boundary refinement, and
  `dec-74` is accepted with exact implementation-safe copy and proof labels.
- The unsupported illustrative `mdkg note add` command is explicitly excluded.

# Links / Artifacts

- `task-712`
- `dec-68`
- `dec-73`
- `prop-7`
- `dec-74`
