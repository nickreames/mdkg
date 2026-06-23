---
id: task-465
type: task
title: specify Vercel project config for mdkg-dev
status: done
priority: 1
epic: epic-131
parent: goal-27
tags: [mdkg-dev, vercel, preview]
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

Specify the exact Vercel settings for the marketing-site preview project.

# Acceptance Criteria

- Project name is `mdkg-dev`.
- Root directory is `mdkg-dev/`.
- Framework is Astro/static.
- Build command is `npm run build`.
- Output directory is `dist`.
- First deploy target is preview URL only.

# Files Affected

- `.mdkg/work/task-465-*`
- Optional future `mdkg-dev/vercel.json` only in a later implementation goal if needed.

# Implementation Notes

- Prefer Chrome UI for first project setup to visually confirm root directory.
- The Vercel plugin can inspect deployments/logs after the project exists.

# Test Plan

`test-213` checks that the handoff contains project name, root, build command, output directory, preview-only boundary, and validation requirements.

# Links / Artifacts

- `edd-31`
- `dec-34`
- `test-213`
