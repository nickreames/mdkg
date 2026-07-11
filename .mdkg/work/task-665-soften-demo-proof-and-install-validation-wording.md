---
id: task-665
type: task
title: soften demo proof and install validation wording
status: done
priority: 1
parent: goal-56
tags: [mdkg-dev, docs-mdkg-dev, demo, install, public-copy, copy-boundary]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-664]
blocks: []
refs: [goal-44, task-662, chk-375, chk-376]
context_refs: []
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context, service-boundary-ownership-check, build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-05
updated: 2026-07-05
---
# Overview

Clean the remaining lower-priority wording issues from demo and install public
surfaces so they explain safety and proof without sounding like internal
deployment or approval workflow.

# Acceptance Criteria

- Demo pages prefer reader-facing proof language such as local proof captured
  before optional preview deployment.
- Demo pages do not expose `preview approval`, `parent Vercel preview
  approval`, `provider mutation`, or `raw prompt payload` as public narrative
  language.
- Install docs use reader-facing wording such as supported public-alpha install
  path and package smoke tests.
- Safety intent remains intact: no credentials, private prompts, cookies,
  provider data, or private artifacts are included in public demo snapshots.

# Files Affected

List files/directories expected to change.

- `mdkg-dev/src/data/demoSnapshots.ts`
- `mdkg-dev/src/pages/demo/[id]/output.astro`
- `docs/src/content/docs/start-here/install.md`

# Implementation Notes

- Keep the demo's graph/file/output proof model. The issue is wording, not the
  demo concept.
- Preferred demo wording:
  `Local proof is captured before any optional preview deployment.`
- Preferred safety wording:
  `No credentials, private prompts, cookies, or provider data are included in
  the public snapshot.`
- Preferred install wording:
  `The supported public-alpha install path uses the globally installed CLI.`
  and `validates global install in package smoke tests.`
- Do not change demo routes, data shape, noindex behavior, visual design,
  package scripts, or generated CLI reference behavior.

# Test Plan

How will we verify it works?

- `npm --prefix mdkg-dev run build`
- `npm --prefix docs run build`
- `npm run smoke:mdkg-dev`
- `npm run smoke:mdkg-dev-docs`
- Search demo/install source and rendered output for the forbidden phrases.

# Links / Artifacts

- `/private/tmp/mdkg-public-copy-audit-20260705/report.md`
- `goal-44`
- `chk-375`
- `chk-376`
