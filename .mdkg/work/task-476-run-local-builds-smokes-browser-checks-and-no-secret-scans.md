---
id: task-476
type: task
title: run local builds smokes Browser checks and no-secret scans
status: done
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

# Completion Evidence

- `npm --prefix mdkg-dev run build`: passed.
- `npm --prefix docs run build`: passed, building 19 static Starlight pages and Pagefind search.
- `npm run docs:check`: passed.
- `npm run smoke:mdkg-dev`: passed with Starlight docs bridge assertions.
- `npm run smoke:mdkg-dev-docs`: passed with 40 required files.
- `npm run smoke:mdkg-dev-seo`: passed.
- `npm run smoke:demo-graph`: passed.
- `npm run build`: passed.
- `npm run test`: passed, 507 tests, 0 failures.
- `npm run cli:contract`: passed.
- `node dist/cli.js validate --summary --json --limit 20`: passed with 0 warnings and 0 errors.
- `node dist/cli.js doctor --strict --json`: passed with 0 errors and 1 expected warning for ignored local project DB runtime state.
- `npm audit --prefix docs --audit-level=moderate`: passed; remaining advisories are low severity and the npm-suggested fix requires an incompatible breaking Astro 7 move.
- `git diff --check`: passed.
