---
id: test-342
type: test
title: public-copy meta-language regression contract
status: todo
priority: 1
parent: goal-56
tags: [mdkg-dev, docs-mdkg-dev, public-copy, regression, browser, product-design]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-663, task-664, task-665]
blocks: []
refs: [task-663, task-664, task-665]
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
cases: []
created: 2026-07-05
updated: 2026-07-05
---
# Overview

Validate that the public-copy cleanup removed the audited meta/process language
without weakening mdkg's safety and capability explanations.

# Target / Scope

List the work items or areas covered (use `relates` for tickets).

- `task-663`
- `task-664`
- `task-665`
- mdkg.dev homepage
- mdkg.dev demos and demo detail/output pages
- docs install, safety boundaries, generated CLI reference, and changelog pages

# Preconditions / Environment

Document environment, data, and setup requirements.

- Implementation tasks are done locally.
- Local mdkg-dev and docs builds can be served or inspected through Browser.
- Product Design audit can capture fresh local screenshots.

# Test Cases

- Homepage rendered/source copy contains no forbidden process terms:
  `launch track`, `postpublish`, `postdeploy`, `production launch`,
  `release-readiness surface`, `Vercel currentness`, or `Chrome live`.
- Public changelog rendered/source copy describes `0.4.0` as user-facing release
  outcomes rather than launch-management evidence.
- Demo rendered/source copy avoids approval/provider mutation jargon while
  preserving public safety claims.
- Install rendered/source copy explains the supported install path without
  internal release-validation phrasing.
- Safety Boundaries remains reader-facing and does not reintroduce the removed
  `Public copy and release evidence` section.
- Generated CLI Reference remains technical and can retain command safety terms
  where they explain public CLI behavior.

# Results / Evidence

Record outcomes and link evidence in `artifacts` or `links`.

Pending.

# Notes / Follow-ups

- If a phrase is technically necessary in reference docs, classify it as
  docs/reference truth and record why it is acceptable.
