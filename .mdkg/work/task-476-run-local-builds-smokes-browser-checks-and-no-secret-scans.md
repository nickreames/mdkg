---
id: task-476
type: task
title: run local builds smokes Browser checks and no-secret scans
status: todo
priority: 1
epic: epic-139
parent: goal-28
tags: []
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

Run the local quality gates that must pass before any push or Vercel project setup.

# Acceptance Criteria

- Marketing build passes.
- Docs Starlight build passes.
- mdkg validation, doctor, docs checks, mdkg-dev smokes, demo graph smoke, build/test, and CLI contract pass.
- No high-risk raw secret markers are present in site/docs output.

# Files Affected

List files/directories expected to change.

- command evidence only

# Implementation Notes

- Treat failures as blockers for push/Vercel setup.

# Test Plan

- `npm --prefix mdkg-dev run build`
- `npm --prefix docs run build`
- `npm run docs:check`
- `npm run smoke:mdkg-dev`
- `npm run smoke:mdkg-dev-docs`
- `npm run smoke:mdkg-dev-seo`
- `npm run smoke:demo-graph`
- `npm run build`
- `npm run test`
- `npm run cli:contract`
- `node dist/cli.js validate --summary --json --limit 20`
- `node dist/cli.js doctor --strict --json`
- `git diff --check`

# Links / Artifacts

- `test-219`
- `test-220`
