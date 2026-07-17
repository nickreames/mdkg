---
id: edd-78
type: edd
title: Version-driven current-release docs projection and fail-closed rendering contract
tags: [docs, release, automation, current-release, vercel, chrome]
owners: []
links: []
artifacts: []
relates: [goal-73, dec-84, edd-57]
refs: [goal-73, dec-84, edd-57, edd-71, dec-74, task-738]
aliases: []
created: 2026-07-16
updated: 2026-07-16
---
# Overview

Define a version-neutral Starlight current-release projection that preserves
the existing release-state gating while eliminating hardcoded release facts
from components and test expectations.

# Architecture

A pure tested projection combines the existing `publicRelease` projection with
generated release-note JSON. `CurrentReleaseSupplement.astro` consumes the
result and renders one of three evergreen variants. `Footer.astro` retains the
route mapping and visibility gate but imports only the version-neutral
component.

# Data model

- Lifecycle: `target_version`, `state`, `qualifier`, and existing visibility,
  preview, indexability, and package-version facts.
- Published selection: the generated release whose version exactly equals
  `target_version`, including date, sections, item count, and highlights.
- Draft preview selection: `target_version` plus generated `Unreleased`
  sections and item count; it never claims npm availability.
- Hidden draft: no supplement projection and no release-specific markup.

# APIs / interfaces

The internal projection exposes version, state, qualifier, preview/published
label, date when published, item count, up to three highlights, and visibility.
Rendered IDs use `release-current-${variant}`. No mdkg CLI, package, npm, or
external web API changes are introduced.

# Failure modes

- A visible published target has no exact generated release: fail the build.
- Published target and package version disagree: preserve the existing failure.
- Generated notes are malformed or required fields have wrong types: fail.
- Draft preview has no Unreleased items: render the evergreen preview label and
  links without inventing release highlights.
- Generated highlight content contains markup: render safely without
  unrestricted raw HTML.

# Observability

Automated checks identify the selected target, release state, note count, and
missing/mismatched data. Local and production receipts record route, viewport,
DOM markers, console state, screenshot path, commit SHA, deployment ID, and
Vercel readiness.

# Security / privacy

Only committed public release data may render. Do not expose provider payloads,
tokens, internal checkpoints, absolute paths, or raw HTML from changelog text.
Vercel and Chrome verification remain read-only after the pre-approved Git
push triggers deployment.

# Testing strategy

Unit tests cover published, draft preview, hidden draft, missing release,
metadata mismatch, malformed notes, and absence of version literals. Built
route tests cover all three variants. Chrome checks desktop and mobile local
and canonical production output, stale scoped markers, console health, links,
and overflow.

# Rollout plan

Implement and validate locally, commit once, then non-force push `main` under
the recorded pre-approval. Require exact-SHA READY production deployments for
`mdkg-docs` and `mdkg-dev`, validate production in Chrome, record a checkpoint,
push the graph-only closeout, and verify that final automatic deployment without
creating another evidence-only commit.
