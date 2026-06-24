---
id: task-519
type: task
title: create mdkg dev generated visual assets and demo video storyboard
status: todo
priority: 2
tags: [mdkg-dev, visuals, demo-video, deferred]
owners: []
links: []
artifacts: []
relates: [goal-21, goal-32, task-371, test-248]
blocked_by: [goal-32]
blocks: [test-248]
refs: [archive://archive.mdkg-dev-preview-polish-pass-2-2026-06-24]
context_refs: [prd-7, edd-36, edd-37, edd-38, dec-37, dec-38, task-371]
evidence_refs: []
aliases: []
skills: []
created: 2026-06-23
updated: 2026-06-23
---
# Overview

Create generated visual assets and a short demo-video storyboard for mdkg.dev after the pass-2 copy, docs IA, and local preview proof have stabilized.

This is intentionally deferred out of goal-32. The immediate pass uses CSS/HTML-first explanations; generated image/video assets should not block public-alpha copy, docs, or preview validation.

# Acceptance Criteria

- Define source-backed visual briefs for the Plan -> Work -> Evidence model, local-first state boundaries, subgraphs/bundles, and handoff/pack flow.
- Produce candidate generated or designed assets only after Product Design review confirms the page hierarchy and copy are stable.
- Create a demo-video storyboard that can be executed without secrets, private repos, raw prompts, provider payloads, or live production side effects.
- Keep canonical `mdkg.dev` SEO pages stable; demo video/visual assets are additive and can be rejected without changing the docs contract.
- Verify assets with `test-248` before public use.

# Files Affected

- `mdkg-dev/`
- `docs/`
- future generated visual asset folders, if introduced
- `.mdkg/work/` evidence checkpoints

# Implementation Notes

- Prefer HTML/CSS diagrams where they communicate clearly.
- Use generated bitmap assets only when they add explanatory value beyond CSS.
- Do not make public claims that are not already supported by product/docs evidence.

# Test Plan

- Run `test-248`.
- Re-run mdkg.dev and docs visual/accessibility checks after asset integration.
- Confirm no image, storyboard, or demo transcript contains raw secrets, tokens, private prompts, provider payloads, or unrelated raw logs.

# Links / Artifacts

- `goal-32`
- `task-371`
- `test-248`
