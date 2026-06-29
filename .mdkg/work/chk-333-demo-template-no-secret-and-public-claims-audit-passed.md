---
id: chk-333
type: checkpoint
title: demo template no secret and public claims audit passed
checkpoint_kind: audit
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [test-323]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [test-323]
created: 2026-06-29
updated: 2026-06-29
---
# Summary

`test-323` passed: the canonical website demo template and `demo-001` retained
source contain no strict credential-pattern matches and do not claim production
launch, durable hosting, DNS, analytics, publish, tag, or deployment success.

# Scope Covered

- `test-323`
- `examples/website-demo-template`
- `examples/demo-runs/demo-001`

## Changed Surfaces

- Template docs and handoff files:
  `README.md`, `WEBSITE_DEMO_TEMPLATE_BRIEF.md`,
  `CREATIVE_PRODUCTION_INTAKE.md`, and `DEMO_HANDOFF_PROMPT.md`.
- Generated run source: `src/pages/index.astro`,
  `src/components/GoalRunConsole.tsx`, and `src/assets/ocean-flow-map.svg`.

## Boundaries

- in scope: local no-secret scan, public-claim scan, noindex/approval-boundary
  review.
- out of scope: Vercel provider mutation, preview deploy, DNS, aliases,
  analytics, tags, npm publish, git push, durable hosting.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded:
  yes.

# Decisions Captured

- `dec-56`
- `edd-58`
- `edd-59`

# Implementation Summary

The audit confirmed the demo language is intentionally local-first and
approval-gated. The rendered page includes `noindex,nofollow` and repeatedly
states that preview, DNS, aliases, analytics, tags, pushes, npm publishing, and
durable hosting require separate approval.

# Audit Findings

- Reviewed surfaces: template docs, demo run docs, demo page source, React
  Island copy, SVG alt/desc text, and mdkg run checkpoints.
- Findings: no strict credential-pattern matches; broad matches were safety
  language such as "no secrets" and "approval-gated preview"; no positive
  "deployed to", "live at", `demo-N.mdkg.dev`, analytics-enabled, DNS-configured,
  or package-published assertions were retained.
- Residual risk: a future preview URL will be public unless protected by Vercel;
  `task-621`/`test-324` must validate noindex state and public claims after
  deployment.

# Verification / Testing

## Command Evidence

- Strict credential-pattern `rg` over `examples/website-demo-template` and
  `examples/demo-runs/demo-001`, excluding `node_modules`, `dist`, `.astro`, and
  generated mdkg caches: no matches.
- Public-claim `rg` for production/deploy/live/DNS/custom-domain assertions:
  only negative or boundary language matched.
- Source check found `<meta name="robots" content="noindex,nofollow" />` in
  `examples/demo-runs/demo-001/src/pages/index.astro`.

## Pass / Fail Status

- status: pass

## Known Warnings

- warning: no public-safety blocker found in local source.

# Known Issues / Follow-ups

- Preview deployment still needs a post-deploy noindex and public-claims audit.
- `goal-46` must remain blocked until `goal-44` records an accepted preview.

## Follow-up Refs

- `task-621`
- `test-324`
- `task-622`
- `goal-46`

# Links / Artifacts

- `examples/demo-runs/demo-001/src/pages/index.astro`
- `examples/demo-runs/demo-001/DEMO_HANDOFF_PROMPT.md`
- `examples/website-demo-template/CREATIVE_PRODUCTION_INTAKE.md`

# Raw Content Safety

- Evidence is summarized with file refs and command summaries only. No raw
  prompts, provider payloads, cookies, credentials, tokens, or bulky execution
  traces are stored.
