---
id: task-546
type: task
title: run Product Design and Creative Production review and apply visual hierarchy diagram and copy-direction polish
status: done
priority: 1
epic: epic-178
parent: goal-34
tags: [mdkg-dev, product-design, creative-production]
owners: []
links: []
artifacts: [archive://archive.mdkg-dev-pass4-design-audit-screenshots-2026-06-24]
relates: [goal-34, test-267]
blocked_by: [task-538, task-545]
blocks: [task-547]
refs: [archive://archive.mdkg-dev-preview-audit-pass-4-2026-06-24]
context_refs: [edd-47, dec-45]
evidence_refs: []
aliases: []
skills: []
created: 2026-06-24
updated: 2026-06-24
---
# Overview

Use Product Design and Creative Production as evidence-backed review gates after structural fixes.

# Acceptance Criteria

- Product Design audit captures current routes/screenshots and records UX/a11y findings.
- Creative Production review records visual hierarchy, Plan -> Work -> Evidence diagram, CTA density, and copy-direction findings.
- Accepted findings are applied or explicitly deferred.
- Generated image/video assets are deferred unless explicitly rescoped.
- `test-267` passes for review evidence.

# Files Affected

- `mdkg-dev/**`
- `docs/**`
- `.mdkg/work/**` checkpoints

# Implementation Notes

- Evidence should be in checkpoints, not public pages.
- Keep public design restrained, OSS-oriented, and low-hype.

# Test Plan

Browser/Chrome screenshots, Product Design audit output, Creative Production notes, and focused route rechecks.

# Links / Artifacts

- `test-267`
