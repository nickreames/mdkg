---
id: test-323
type: test
title: website demo no secret and public claims contract
status: done
priority: 1
epic: epic-205
parent: goal-44
tags: [demo, no-secret, claims, public-safety]
owners: []
links: []
artifacts: [examples/website-demo-template/README.md, examples/website-demo-template/WEBSITE_DEMO_TEMPLATE_BRIEF.md, examples/website-demo-template/CREATIVE_PRODUCTION_INTAKE.md, examples/demo-runs/demo-001/src/pages/index.astro, examples/demo-runs/demo-001/src/components/GoalRunConsole.tsx, examples/demo-runs/demo-001/src/assets/ocean-flow-map.svg, examples/demo-runs/demo-001/DEMO_HANDOFF_PROMPT.md, examples/demo-runs/demo-001/README.md]
relates: []
blocked_by: [task-619, task-620]
blocks: [task-621]
refs: [dec-56, edd-58, edd-59]
context_refs: [dec-56, edd-58, edd-59]
evidence_refs: []
aliases: []
skills: []
cases: [demo graph and generated site contain no secrets or raw private payloads., public copy does not claim production launch or durable demo hosting before approval., creative production outputs preserve source-backed mdkg claims.]
created: 2026-06-29
updated: 2026-06-29
---
# Overview

Validate the demo template, generated site, and retained creative artifacts are
safe for a public OSS demo.

# Target / Scope

- `task-619`
- `task-620`
- template graph
- generated demo run source

# Preconditions / Environment

- Creative Production handoff exists.
- Generated site or candidate assets exist if the implementation reached that
  stage.

# Test Cases

- Demo graph and generated site contain no secrets or raw private payloads.
- Public copy does not claim production launch or durable demo hosting before
  approval.
- Creative Production outputs preserve source-backed mdkg claims.

# Results / Evidence

Pending.

# Notes / Follow-ups

- Do not retain raw prompts or provider payloads unless deliberately sanitized.
