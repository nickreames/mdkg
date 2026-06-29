---
id: dec-56
type: dec
title: canonical website demo template replaces ad hoc demo planning
status: accepted
tags: [demo, template, decision, website]
owners: []
links: []
artifacts: []
relates: []
refs: [goal-20, edd-26, edd-45]
aliases: []
created: 2026-06-29
updated: 2026-06-29
---
# Context

The repo already contains small demo/example graphs and archived `goal-20`
planning for live demos, but the operator now wants one clear template that can
be forked repeatedly to create differentiated website demos from this repo.

# Decision

Use one new canonical website demo template at
`examples/website-demo-template/`. Existing examples such as
`examples/demo-agentic-coding/` and `examples/template-mdkg-dev/` remain useful
reference fixtures, but new website demo runs should start from the canonical
template instead of ad hoc graph planning.

# Alternatives considered

- Reframe `examples/template-mdkg-dev/` in place: rejected because the new
  template should be broader and more creative than an mdkg.dev-inspired
  reference example.
- Maintain multiple competing templates: rejected for v1 because it makes the
  fork/run/deploy workflow harder to teach and verify.

# Consequences

- `goal-44` owns the new template and preview workflow.
- Archived `goal-20` remains historical context only.
- Future demo runs should fork from one template and record run-specific
  evidence under a branch path such as `examples/demo-runs/demo-001/`.

# Links / references

- `goal-44`
- `goal-20`
- `edd-26`
- `edd-45`
