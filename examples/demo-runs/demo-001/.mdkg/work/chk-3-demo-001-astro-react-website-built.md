---
id: chk-3
type: checkpoint
title: demo-001 Astro React website built
checkpoint_kind: implementation
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-1]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-1]
created: 2026-06-29
updated: 2026-06-29
---
# Summary

`task-1` built a complete local website candidate for `demo-001` from the
forked mdkg website demo graph.

# Scope Covered

- `task-1`
- local Astro + React Islands implementation under `examples/demo-runs/demo-001`

## Changed Surfaces

- `package.json`
- `package-lock.json`
- `astro.config.mjs`
- `tsconfig.json`
- `src/pages/index.astro`
- `src/components/GoalRunConsole.tsx`
- `src/styles/global.css`
- `src/assets/ocean-flow-map.svg`

## Boundaries

- in scope: local website implementation, local build readiness, public-safe
  copy.
- out of scope: Vercel deploy, DNS, durable hosting, push, tag, npm publish,
  analytics, raw Creative Production prompts, and provider payloads.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded:
  yes.

# Decisions Captured

- `dec-1`: Astro plus React Islands is the demo stack.
- `dec-2`: preview deployment remains parent-repo approval-gated.
- `edd-1`: Ocean Flow website demo design and Creative Production contract.

# Implementation Summary

The implementation uses Astro for the static page and one focused React Island
for the graph-run console. The visual system follows Ocean Flow colors and the
copy keeps mdkg claims source-backed and local-first.

# Implementation Details

- Code or graph surfaces changed: page, island component, CSS, SVG visual,
  package metadata, and lockfile.
- Architecture or data-shape notes: the React Island exposes selected stages
  and commands without turning the page into a full client app.
- Compatibility notes: the page is a local preview candidate and includes
  `noindex,nofollow`; no deployment config or credentials are added.

# Verification / Testing

## Command Evidence

- `npm install`: passed with 0 vulnerabilities.
- `npm run build`: passed and generated a static `dist/index.html`.

## Pass / Fail Status

- status: pass

## Known Warnings

- warning: Astro/Vite emitted upstream React plugin deprecation warnings for
  `esbuild` and `optimizeDeps.esbuildOptions`.

# Known Issues / Follow-ups

- Local Browser/Chrome validation is recorded in `chk-4`.
- Vercel preview deployment remains parent-goal work.

## Follow-up Refs

- `test-1`
- parent `goal-44`

# Links / Artifacts

- `src/pages/index.astro`
- `src/components/GoalRunConsole.tsx`
- `src/styles/global.css`
- `src/assets/ocean-flow-map.svg`

# Raw Content Safety

- Evidence is summarized with file refs and command outcomes only. No raw
  prompts, provider payloads, credentials, cookies, or tokens are stored.
