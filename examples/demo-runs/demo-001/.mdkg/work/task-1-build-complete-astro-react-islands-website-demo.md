---
id: task-1
type: task
title: build complete Astro React Islands website demo
status: done
priority: 1
epic: epic-1
parent: goal-1
tags: [demo, website, astro, react-islands, implementation]
owners: []
links: []
artifacts: [package.json, package-lock.json, astro.config.mjs, tsconfig.json, src/pages/index.astro, src/components/GoalRunConsole.tsx, src/styles/global.css, src/assets/ocean-flow-map.svg, /private/tmp/mdkg-demo-001-validation/browser-desktop-top.png, /private/tmp/mdkg-demo-001-validation/browser-mobile-top.png, /private/tmp/mdkg-demo-001-validation/chrome-desktop-top.png, /private/tmp/mdkg-demo-001-validation/chrome-mobile-top.png]
relates: []
blocked_by: [spike-1]
blocks: []
refs: [goal-1]
context_refs: [edd-1, dec-1, dec-2]
evidence_refs: []
aliases: []
skills: [build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-06-29
updated: 2026-06-29
---
# Overview

Build the local website candidate selected by `spike-1` using Astro plus React
Islands and the Ocean Flow design system.

# Acceptance Criteria

- The generated site is a complete website candidate, not a placeholder page.
- It uses Astro plus React Islands for any interactive portions.
- It follows `DESIGN.md` and the Ocean Flow palette.
- It preserves source-backed mdkg claims and makes preview/promotion boundaries
  explicit.
- It remains local-only until the parent repo approves Vercel preview work.

# Files Affected

- Future implementation should add website source under the forked run path.
- This template itself records the contract and expected evidence only.

# Implementation Notes

- Use the creative direction from `spike-1`.
- If Creative Production was used, rely on the compact direction summary rather
  than raw prompts or provider payloads.
- Favor rich, differentiated structure and interaction while keeping the site
  inspectable and fast.
- Do not add secrets, provider payloads, raw prompt logs, analytics, or
  deployment config that requires credentials.

# Test Plan

- `test-1`
- local build command selected by the generated project
- Browser and Chrome checks when the generated site is served locally

# Links / Artifacts

- `goal-1`
- `spike-1`
- `test-1`
