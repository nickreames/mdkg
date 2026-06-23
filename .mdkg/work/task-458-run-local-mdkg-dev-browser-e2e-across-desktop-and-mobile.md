---
id: task-458
type: task
title: run local mdkg-dev Browser E2E across desktop and mobile
status: done
priority: 1
epic: epic-128
parent: goal-26
tags: [mdkg-dev, browser-e2e, visual-qa]
owners: []
links: []
artifacts: []
relates: [goal-26, test-208]
blocked_by: [task-457]
blocks: []
refs: []
context_refs: [edd-28]
evidence_refs: [chk-196]
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-06-22
updated: 2026-06-22
---
# Overview

Build mdkg-dev, run a local loopback preview, and validate the rendered site through the in-app Browser at desktop and mobile viewport sizes.

# Acceptance Criteria

- `npm --prefix mdkg-dev run build` passes.
- A local Astro preview is started on `127.0.0.1` using an available port.
- Browser visits the required route inventory.
- Browser checks include `1440x900` and `390x844`.
- Screenshots are captured for homepage, quickstart, trust, docs, and one mobile view.
- No page-level console errors, broken local route navigation, incoherent overlaps, obvious overflow, unreadable code blocks, or missing first-viewport product signal remain.
- A Browser E2E checkpoint is created.

# Files Affected

- `/private/tmp/mdkg-dev-browser-e2e.*` temporary receipt/screenshot workspace.
- `.mdkg/work/chk-*` for evidence checkpointing.

# Implementation Notes

- Keep Browser work local-only.
- Do not click external links or transmit data.
- If Browser E2E finds a defect, record it and fix it in `task-460`.

# Test Plan

- `npm --prefix mdkg-dev run build`
- Browser DOM/metadata/navigation checks
- Browser screenshots at desktop and mobile viewport sizes

# Links / Artifacts

- goal-25
- test-208
- chk-196
- `/private/tmp/mdkg-dev-browser-e2e.2026-06-22-goal26/browser-e2e-receipt.json`

# Closeout Evidence

- `npm --prefix mdkg-dev run build`: pass.
- Browser HTML E2E over `/`, `/quickstart/`, `/trust/`, `/alpha/`, and `/docs/` at `1440x900` and `390x844`: pass.
- Screenshot evidence captured as viewport PNGs for homepage, quickstart, trust, docs, and mobile homepage.
- Browser E2E checkpoint: chk-196.
