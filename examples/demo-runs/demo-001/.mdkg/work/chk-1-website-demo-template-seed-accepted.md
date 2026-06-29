---
id: chk-1
type: checkpoint
title: website demo template seed accepted
checkpoint_kind: implementation
status: backlog
priority: 9
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
scope: []
created: 2026-06-29
updated: 2026-06-29
---
# Summary

The canonical website demo template seed exists. It defines a one-goal local
website build path with Ocean Flow design guidance, Astro plus React Islands as
the implementation stack, and preview/no-secret boundaries.

# Scope Covered

Scope is `goal-1`.

## Changed Surfaces

- Seed graph nodes: `goal-1`, `epic-1`, `spike-1`, `task-1`, and `test-1`.
- Design nodes: `dec-1`, `dec-2`, and `edd-1`.
- Public template docs: `README.md`, `DESIGN.md`,
  `WEBSITE_DEMO_TEMPLATE_BRIEF.md`, and `DEMO_HANDOFF_PROMPT.md`.

## Boundaries

- in scope: local template graph and handoff contract.
- out of scope: generated website implementation, Vercel preview deployment,
  durable `demo-N.mdkg.dev` hosting, DNS, push, tag, npm publish, and analytics.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded:
  yes.

# Decisions Captured

- `dec-1`: Astro plus React Islands is the demo stack.
- `dec-2`: demo template remains preview-gated and public-safe.

# Implementation Summary

The template is intentionally small and agent-startable. A future run starts
with `goal-1`, routes first to `spike-1`, uses a concise pack, records creative
direction, then builds and validates a local website candidate.

# Implementation Details

- Code or graph surfaces changed: template mdkg graph and docs only.
- Architecture or data-shape notes: preview and durable hosting remain parent
  repo concerns.
- Compatibility notes: no new mdkg CLI feature is required for this seed.

# Verification / Testing

## Command Evidence

- Pending in parent task closeout.

## Pass / Fail Status

- status: seed accepted pending validation.

## Known Warnings

- none yet.

# Known Issues / Follow-ups

- Parent `task-618` must validate this template and close with evidence.

## Follow-up Refs

- parent `task-618`
- `task-1`
- `test-1`

# Links / Artifacts

- `goal-1`
- `DESIGN.md`
- `WEBSITE_DEMO_TEMPLATE_BRIEF.md`
- `DEMO_HANDOFF_PROMPT.md`

# Raw Content Safety

- Summarized seed evidence only. No raw secrets, raw prompts, provider
  payloads, tokens, credentials, or bulky logs are stored here.
