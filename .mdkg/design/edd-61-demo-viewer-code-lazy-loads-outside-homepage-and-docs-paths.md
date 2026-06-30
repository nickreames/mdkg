---
id: edd-61
type: edd
title: demo viewer code lazy loads outside homepage and docs paths
tags: [demo, viewer, performance, bundle, mdkg-dev]
owners: []
links: []
artifacts: []
relates: []
refs: [goal-44, dec-58, dec-59, edd-60]
aliases: []
created: 2026-06-29
updated: 2026-06-29
---
# Overview

Demo viewer code can become heavy if it grows toward a VS Code-style workspace.
The first public demo route needs read-only graph and file exploration, but that
code must not affect the mdkg.dev homepage or normal docs load paths.

# Architecture

- v1 viewer: lightweight read-only graph/file/output explorer on demo detail
  pages only.
- v2 viewer: optional embedded VS Code-style workspace, planned in `goal-47`.
- Viewer modules should be lazy-loaded from the demo detail route and excluded
  from homepage, trust, quickstart, docs, and changelog entry bundles.
- Any large editor, syntax-highlighting, diagram, preview, or animation runtime
  must load only after the demo route needs it.

# Data model

- Route-level viewer state: active surface, selected graph node, selected file,
  output preview mode, and breakpoint-safe layout.
- Snapshot data: static accepted-demo payload that can be rendered without
  fetching private runtime state.
- Performance evidence: before/after build output, route chunk names/sizes when
  available, and Browser/Chrome observations.

# APIs / interfaces

- Astro dynamic imports, islands, or client-only hydration only on demo detail
  routes.
- No viewer runtime may be imported by `mdkg-dev/src/pages/index.astro` unless
  it is a tiny shared primitive already used elsewhere.
- Future embedded workspace options are researched in `spike-24` before
  implementation.

# Failure modes

- Homepage gains large viewer/editor chunks; block closeout.
- Demo detail route hydrates more code than needed for the read-only v1; defer
  embedded workspace behavior to `goal-47`.
- Viewer breaks mobile layout or obscures the output; require Browser/Chrome
  responsive screenshots.
- Lazy code path has console errors only after interaction; include interaction
  checks in the route proof.

# Observability

Record build output, route chunk/bundle evidence when available, Browser/Chrome
console health, screenshots, and notes proving non-demo routes are unaffected.

# Security / privacy

Viewer code renders committed sanitized snapshots only. It must not fetch local
files dynamically, expose private absolute paths, or accept arbitrary file paths
from public route parameters.

# Testing strategy

- Build mdkg-dev locally.
- Validate `/`, `/demos`, `/demo/1`, and `/demo/1/output`.
- Confirm the homepage and docs paths do not import heavy demo viewer code.
- Confirm the demo route works at desktop and mobile breakpoints with no console
  errors.

# Rollout plan

Ship the read-only v1 explorer first. Keep embedded VS Code-style work in
`goal-47` until the short-path demo route and lazy-load contract are proven.
