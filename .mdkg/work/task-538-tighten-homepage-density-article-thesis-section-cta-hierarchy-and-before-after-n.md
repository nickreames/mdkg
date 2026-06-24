---
id: task-538
type: task
title: tighten homepage density article-thesis section CTA hierarchy and before-after narrative
status: done
priority: 1
epic: epic-174
parent: goal-34
tags: [mdkg-dev, homepage, copy]
owners: []
links: []
artifacts: []
relates: [goal-34, test-262]
blocked_by: [task-535, task-537]
blocks: [task-546]
refs: [archive://archive.mdkg-dev-preview-audit-pass-4-2026-06-24]
context_refs: [prd-9, edd-47, dec-39]
evidence_refs: []
aliases: []
skills: []
created: 2026-06-24
updated: 2026-06-24
---
# Overview

Make the homepage concise, professional, and clearly anchored in the project-memory thesis.

# Acceptance Criteria

- Above the fold states mdkg, audience, one-sentence value prop, and primary next action.
- Article thesis appears in the first third: bigger context helps but does not replace project memory.
- Before/after narrative shows what mdkg changes without implying execution.
- CTA hierarchy is primary "Get started", secondary GitHub/docs, and low-pressure footer feedback.
- `test-262` passes.

# Files Affected

- `mdkg-dev/src/**`
- `mdkg-dev/DESIGN.md` if design rationale changes

# Implementation Notes

- Move deeper explanations to docs instead of deleting useful proof.
- Keep tone technical, direct, and low-hype.

# Test Plan

Browser/Chrome viewport checks and Product Design review.

# Links / Artifacts

- `test-262`
