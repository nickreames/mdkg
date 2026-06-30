---
id: edd-59
type: edd
title: Vercel preview demo evidence and closeout contract
tags: [demo, vercel, preview, evidence, closeout]
owners: []
links: []
artifacts: []
relates: []
refs: [edd-31, edd-33, dec-32]
aliases: []
created: 2026-06-29
updated: 2026-06-29
---
# Overview

Vercel preview demos should be review surfaces for generated mdkg website runs,
not durable public hosting. Each preview needs enough evidence to decide whether
to reject, polish, or promote later.

Supersession note, 2026-06-29: this EDD remains historical context for Vercel
preview evidence. The active goal-44 path now proves accepted demos through
local mdkg-dev routes `/demos`, `/demo/1`, and `/demo/1/output` using
`edd-60` and `edd-61`.

# Architecture

- Dedicated preview project name: `mdkg-demo-previews`.
- Preview source: this repo, using a branch-path demo run such as
  `examples/demo-runs/demo-001/`.
- Preview deployment: approval-gated and recorded with project id, deployment
  id, URL, commit SHA, build logs, screenshots, and noindex state.
- Durable hosting: blocked to `goal-46`.

# Data model

- Demo preview candidate: run path, fork receipt, selected goal, preview URL,
  deployment evidence, noindex status, validation artifacts, and closeout
  classification.
- Closeout classification: accepted, rejected, or needs-polish.
- Accepted preview: the only state that can unblock durable `demo-N.mdkg.dev`
  follow-up work.

# APIs / interfaces

- Vercel project/deployment inspection through the Vercel plugin or Vercel CLI
  only after approval.
- Browser/Chrome validation for local and preview URLs.
- mdkg checkpoint evidence for final preview classification.

# Failure modes

- Preview project deploys the wrong root; block closeout until Vercel build
  configuration and logs are verified.
- Preview is publicly reachable without noindex policy; classify as blocker.
- Preview is treated as durable hosting; reject and defer to `goal-46`.
- Vercel or DNS credentials leak into graph state; stop and remediate.

# Observability

Evidence should include deployment id, preview URL, project id, commit SHA,
build-log summary, screenshot paths, console health, responsive checks,
noindex/canonical status, and recommendation.

# Security / privacy

Do not record Vercel tokens, cookies, bypass secrets, DNS credentials, raw
provider payloads, or private prompts. Treat preview URLs as public unless
explicitly protected.

# Testing strategy

Use local validation before preview deployment. After approved preview deploy,
validate URL reachability, visual rendering, console health, noindex state,
build logs, no-secret posture, and closeout classification.

# Rollout plan

Preview deployment is optional and approval-gated in `goal-44`. Durable hosting,
DNS, aliases, and canonical links are deferred to `goal-46`.

For current execution, continue with `task-628`, `task-629`, and `task-630`
instead of preview deployment.
