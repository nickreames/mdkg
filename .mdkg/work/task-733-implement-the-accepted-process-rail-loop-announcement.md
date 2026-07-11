---
id: task-733
type: task
title: Implement the accepted Process Rail loop announcement
status: done
priority: 1
epic: epic-237
tags: [release, implementation, goal-63]
owners: []
links: []
artifacts: [.mdkg/artifacts/goal-62/announcement-directions/01-process-rail.png]
relates: [goal-63]
blocked_by: [task-731]
blocks: [task-734]
refs: [test-403, edd-71, dec-73, dec-74, prd-11, prop-7, prop-8]
context_refs: [goal-62, goal-63, epic-237, dec-74, prop-7, prop-8, task-712, task-713, task-731]
evidence_refs: []
aliases: []
skills: [build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-11
updated: 2026-07-11
---
# Overview

Implement the selected Process Rail as one incremental release section directly
after the existing generic quickstart. The bitmap is a hierarchy reference;
`dec-74` and generated CLI truth govern content.

# Acceptance Criteria

- Preserve the existing hero, quickstart, global navigation, following section,
  and generic first-use path.
- Render exactly the accepted eyebrow, headline, two-sentence body, primary CTA,
  secondary link, and four proof-stage labels from `dec-74`.
- Link `Run a security audit loop` to `/loops/security-audit/` and
  `Learn how loops work` to `/loops/`.
- Use supported command anchors only: fork dry-run, plan, next, and runs.
- Use one semantic section with an `h2` and ordered process list; do not create a
  hero, nested cards, template catalog, dashboard, or dedicated release page.
- Reuse the existing white/light-blue bands, black type, blue eyebrow,
  restrained border, dark command surface, and existing primary CTA treatment.
- Render only when the shared release projection is visible; active preview is
  noindex and dormant output contains no announcement source data.
- Do not implement or mention the unsupported bitmap command `mdkg note add`.

# Files Affected

- mdkg.dev homepage/component/styles under `mdkg-dev/src/`
- Focused mdkg.dev component/render tests

# Implementation Notes

- Use the selected artifact for layout intent, not literal text extraction.
- Product Design audit B2 and recommendations R1-R3 are binding.
- Keep the runtime boundary verbatim: `mdkg preserves the process; your
  coding-agent harness executes agents and tools.`

# Test Plan

Run the active-preview marketing build and `test-403`; compare desktop hierarchy
to the selected artifact and assert exact copy, links, source order, semantics,
state gating, and absence of unsupported syntax.

# Results / Evidence

- Added `mdkg-dev/src/components/LoopAnnouncement.astro` as one semantic gated
  section with the accepted `h2`, two actions, and ordered four-stage process
  rail.
- Inserted the announcement immediately after the existing quickstart without
  changing the hero, quickstart, navigation, or following section.
- Used only the accepted `fork --dry-run`, `plan`, `next`, and `runs` commands;
  the unsupported `mdkg note add` command is absent.
- Canonical and `PUBLIC_MDKG_RELEASE_PREVIEW=1` marketing builds passed. The
  canonical build omits all announcement content; the preview build renders the
  exact release copy and remains `noindex, nofollow`.
- `node scripts/smoke-mdkg-dev.js` passed with focused preview and dormant-output
  assertions. Responsive and browser proof remains owned by `task-734` and
  `test-403`.

# Links / Artifacts

- `dec-74`
- `prop-7`
- `test-403`
