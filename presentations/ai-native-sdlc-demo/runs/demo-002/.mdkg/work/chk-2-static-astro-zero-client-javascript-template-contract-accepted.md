---
id: chk-2
type: checkpoint
title: Static Astro zero client JavaScript template contract accepted
checkpoint_kind: implementation
status: done
priority: 9
tags: []
owners: []
links: []
artifacts: [README.md, DESIGN.md, WEBSITE_DEMO_TEMPLATE_BRIEF.md, DEMO_HANDOFF_PROMPT.md, CREATIVE_PRODUCTION_INTAKE.md]
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: []
created: 2026-07-26
updated: 2026-07-26
---
# Summary

Accepted the current reusable-template contract: fresh agents now start from
static Astro, semantic HTML and CSS, and zero client-side JavaScript. This
checkpoint supersedes `chk-1` for current operator routing without changing the
historical checkpoint or executing the reusable source goal.

# Scope Covered

Contract surfaces for `goal-1`, `epic-1`, `spike-1`, `task-1`, `test-1`,
`prd-2`, `dec-1`, `dec-2`, and `edd-1`.

## Changed Surfaces

- operator bootstrap files and Ocean Flow design constraints
- the reusable source graph's stack, authority, work, and validation contracts
- generated template indexes and checkpoint event provenance

## Boundaries

- in scope: the reusable local website-demo starting specification
- out of scope: executing `goal-1`, producing a demo, Git integration,
  publication, deployment, providers, DNS, analytics, or package release
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded:
  yes

# Decisions Captured

- `dec-1`: static Astro and zero client JavaScript
- `dec-2`: caller-owned integration and publication authority
- `edd-1`: Ocean Flow, static-output, accessibility, budget, and evidence
  contract

# Implementation Summary

Replaced the hydrated-islands default with a fail-closed static-output contract,
retained bounded creative latitude, and made later side effects portable by
assigning them to the invoking workflow rather than hard-coded parent goals.

# Implementation Details

- Code or graph surfaces changed: template operator files, design records, and
  the source goal's actionable work contracts
- Product-requirement surface: `prd-2` carries the fixed product, evidence,
  budget, accessibility, and authority requirements into specialized forks
- Architecture or data-shape notes: static Astro, no client directives,
  hydration, scripts, remote fonts, or third-party runtime assets
- Compatibility notes: ids `dec-1` and `task-1` remain stable; only filenames
  and current bodies changed; historical `chk-1` remains intact

# Verification / Testing

## Command Evidence

- command: `mdkg index`
- result: all tracked template indexes regenerated
- command: `mdkg validate --json`
- result: pass, zero warnings and zero errors
- command: `mdkg goal next goal-1 --json`
- result: `spike-1`
- command: explicit-edge concise pack dry run rooted at `spike-1`
- result: pass, 13 nodes including the goal, epic, full work chain, PRD, EDD,
  decisions, latest accepted checkpoint, and required skills

## Pass / Fail Status

- status: pass

## Known Warnings

- warning: the source goal remains intentionally unexecuted

# Known Issues / Follow-ups

- The caller must specialize the fork before implementation.
- Integration and publication require separate caller-owned authority.

## Follow-up Refs

- `goal-1`
- `spike-1`
- `task-1`
- `test-1`

# Links / Artifacts

- `README.md`
- `DESIGN.md`
- `WEBSITE_DEMO_TEMPLATE_BRIEF.md`
- `DEMO_HANDOFF_PROMPT.md`
- `CREATIVE_PRODUCTION_INTAKE.md`

# Raw Content Safety

- Evidence is summarized above; no raw secrets, prompts, provider payloads, or
  bulky traces are retained.
