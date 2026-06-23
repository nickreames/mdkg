---
id: task-466
type: task
title: specify Starlight project config for docs and mdkg-docs
status: done
priority: 1
epic: epic-133
parent: goal-27
tags: [mdkg-dev, starlight, docs]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-22
updated: 2026-06-22
---
# Overview

Specify how `docs/` becomes the future Starlight docs project and Vercel preview target.

# Acceptance Criteria

- Docs project name is `mdkg-docs`.
- Project root is `docs/`.
- Framework is Astro/Starlight.
- Build command is `npm run build`.
- Output directory is `dist`.
- Future canonical host is `docs.mdkg.dev`.
- `mdkg.dev/docs` remains a bridge/landing page.

# Files Affected

- `.mdkg/work/task-466-*`
- `docs/` only in a later implementation goal.

# Implementation Notes

- Do not install Starlight or move Markdown in this alignment pass.
- The implementation pass must translate existing `docs/SUMMARY.md` into Starlight sidebar/navigation.

# Test Plan

`test-214` checks that the docs project plan includes root, framework, build, output, canonical host, and migration constraints.

# Links / Artifacts

- `edd-32`
- `dec-35`
- `test-214`
