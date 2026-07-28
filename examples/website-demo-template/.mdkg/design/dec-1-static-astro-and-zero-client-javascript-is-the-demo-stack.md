---
id: dec-1
type: dec
title: Static Astro and zero client JavaScript is the demo stack
status: accepted
tags: [demo, stack, astro, static, zero-javascript]
owners: []
links: []
artifacts: []
relates: []
refs: [goal-1, prd-2]
aliases: []
created: 2026-06-29
updated: 2026-07-26
---
# Context

The template needs a deterministic implementation contract for repeatable,
public-safe demos while leaving room for differentiated creative execution.

# Decision

Use Astro as the site framework and emit only static semantic HTML and CSS.
Demo pages must use no `client:*` directives, framework hydration metadata,
generated client JavaScript, inline or external runtime scripts, remote fonts,
or third-party runtime assets. Visual motion must be CSS-only and respect
`prefers-reduced-motion`.

# Alternatives considered

- Hydrated framework islands: rejected because hydration and runtime JavaScript
  conflict with the demo's inspectable zero-JavaScript proof.
- A client-rendered application: rejected because it is heavier and weakens
  deterministic static-output verification.

# Consequences

- Demo runs have a clear default stack.
- Creative Production and coding agents retain latitude over composition,
  visual metaphor, hierarchy, imagery, and CSS-only motion.
- Built-output validation can fail closed on scripts, hydration metadata, and
unexpected runtime assets.
- Each run produces one portable `DemoOutput.astro`; canonical integration
  supplies only a thin wrapper and static registry binding.
- Shared generated output is built once and checks that consume it run
  serially.

# Links / references

- `goal-1`
- `prd-2`
- `edd-1`
