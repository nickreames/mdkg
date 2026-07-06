---
id: task-663
type: task
title: replace mdkg.dev homepage launch-track process copy
status: todo
priority: 1
parent: goal-56
tags: [mdkg-dev, homepage, public-copy, copy-boundary, 0.4.2]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-42, task-662, chk-375]
context_refs: []
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context, service-boundary-ownership-check, build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-05
updated: 2026-07-05
---
# Overview

Replace the homepage section that currently exposes internal launch-track and
postpublish process language with stable, user-facing customization copy. This
task owns only the public positioning issue on mdkg.dev.

# Acceptance Criteria

- Homepage body copy no longer includes `launch track`, `postpublish`,
  `postdeploy`, `production launch`, `release-readiness surface`,
  Vercel/Chrome proof wording, or internal release evidence language.
- Replacement copy communicates stable user value: team standards without
  forking the CLI, repo-local config overlays, managed skills, core docs, and
  upgrade-safe customization.
- The existing capability cards for config overlays, custom skill mirrors,
  `COLLABORATION.md`, and MANIFEST naming remain accurate.
- Structured metadata may continue to reflect the package version, but body
  copy must not present version-publish/deploy state as public positioning.

# Files Affected

List files/directories expected to change.

- `mdkg-dev/src/pages/index.astro`

# Implementation Notes

- Suggested section direction:
  `Team standards without forking the CLI.`
- Suggested support copy:
  `Use repo-local config overlays, managed skills, and core docs to adapt mdkg
  to your team while keeping the npm-installed CLI kernel upgradable.`
- Suggested replacement for the `Release target` card:
  `Upgradable kernel: Keep mdkg installed from npm while repo-local config
  preserves standards, skill mirrors, and collaboration docs.`
- Do not introduce new public claims about npm publish, deployment state,
  Vercel, Chrome, postpublish validation, or internal approval workflow.
- Do not change unrelated homepage sections, diagrams, CTA styling, metadata
  structure, docs links, package files, or mdkg graph behavior.

# Test Plan

How will we verify it works?

- `npm --prefix mdkg-dev run build`
- `npm run smoke:mdkg-dev`
- `npm run smoke:mdkg-dev-seo`
- Search rendered/source homepage output for forbidden terms.
- Browser local screenshot review of the homepage at desktop and mobile sizes.

# Links / Artifacts

- `/private/tmp/mdkg-public-copy-audit-20260705/report.md`
- `task-662`
- `chk-375`
