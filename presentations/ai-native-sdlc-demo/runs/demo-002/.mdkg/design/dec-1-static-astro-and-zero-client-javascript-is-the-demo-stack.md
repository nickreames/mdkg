---
id: dec-1
type: dec
title: Static Astro and zero client JavaScript is the demo stack
status: accepted
tags: [demo, demo-002, stack, astro, static, zero-javascript]
owners: [demo-002-agent]
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

For Demo 2, use a bright Ocean Flow navigation-chart composition implemented
with HTML and CSS. The run-local site and canonical output component must tell
the same durable-continuity story without requiring shared page markup or a
client runtime.

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

# Links / references

- `goal-1`
- `prd-2`
- `edd-1`
