---
id: edd-60
type: edd
title: demo detail pages synchronize graph filesystem and output surfaces
tags: [demo, viewer, mdkg-dev, astro, graph, filesystem]
owners: []
links: []
artifacts: []
relates: []
refs: [goal-44, dec-58, dec-59, edd-58]
aliases: []
created: 2026-06-29
updated: 2026-06-29
---
# Overview

Accepted demo detail pages should show how mdkg turns a graph into a final
website. The useful public experience is not only the rendered output; it is the
relationship between the sanitized mdkg graph, selected read-only source files,
and the completed website.

# Architecture

- `/demos` lists accepted demos and their high-level intent, stack, and status.
- `/demo/[id]` is the detail page for an accepted demo.
- `/demo/1/output` or an equivalent child route shows the final static output
  when the detail page needs an isolated rendered surface.
- The detail route presents three synchronized surfaces:
  - sanitized mdkg graph: goal, tasks, tests, design records, and checkpoints
  - selected read-only filesystem: safe source and docs files from the demo run
  - final output preview: the generated site or static captured output
- Demo 1 should use a committed sanitized snapshot derived from
  `examples/demo-runs/demo-001`, not live private files or hidden chat context.

# Data model

- Demo record: id, title, short description, stack, design theme, acceptance
  status, source snapshot version, output route, and safety status.
- Graph snapshot: curated mdkg node list with ids, titles, statuses, edges, and
  short bodies safe for public display.
- Filesystem snapshot: selected relative paths, file kinds, highlighted content
  excerpts, and omission reasons for excluded files.
- Output snapshot: static route, screenshots, build metadata, and validation
  receipts.

# APIs / interfaces

- Astro routes under `mdkg-dev/src/pages`.
- Static JSON or TypeScript data modules under mdkg-dev for accepted demo
  metadata and snapshots.
- Browser/Chrome local validation for `/demos`, `/demo/1`, and
  `/demo/1/output`.
- No provider API is needed for the local source proof.

# Failure modes

- Snapshot leaks secrets or private prompt/provider data; block publication and
  rebuild the sanitized snapshot.
- Graph and filesystem panes diverge from the final output; require explicit
  snapshot versioning and closeout evidence.
- Demo content overclaims mdkg capabilities; require public-claims audit before
  acceptance.
- Output route is indexed before the content is approved; require noindex or
  equivalent public-safety handling until accepted.

# Observability

Record build output, smoke test results, Browser/Chrome screenshots, console
health, route coverage, snapshot file list, no-secret audit, and public-claims
audit in the active task/checkpoint.

# Security / privacy

Do not expose raw prompts, provider payloads, cookies, Vercel bypass data,
tokens, private repo paths, or non-demo files. The public snapshot must be a
deliberate export with a bounded file list and explicit omissions.

# Testing strategy

- `npm --prefix mdkg-dev run build`
- `npm run smoke:mdkg-dev`
- Browser and Chrome local validation for `/demos`, `/demo/1`, and
  `/demo/1/output`
- no-secret scan of snapshot files and rendered HTML
- public-claims audit of gallery/detail/output copy

# Rollout plan

Implement locally first. Do not push, deploy, or promote live routes until the
source proof passes and the operator separately approves public deployment.
