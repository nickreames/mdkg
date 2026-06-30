---
id: dec-1
type: dec
title: Astro plus React Islands is the demo stack
status: accepted
tags: [demo, stack, astro, react-islands]
owners: []
links: []
artifacts: []
relates: []
refs: [goal-1]
aliases: []
created: 2026-06-29
updated: 2026-06-29
---
# Context

The template needs enough implementation guidance for repeatable demos while
leaving room for differentiated creative execution.

# Decision

Use Astro as the site framework and React Islands for focused interactive
sections. Static content, routing, and layouts should stay Astro-first; React is
reserved for controls, demos, animations, or stateful components that benefit
from client-side behavior.

# Alternatives considered

- Plain Astro only: simpler, but too limiting for interactive demo ideas.
- Full React app: flexible, but heavier and less aligned with fast static demo
  previews.

# Consequences

- Demo runs have a clear default stack.
- Creative Production and coding agents can propose interaction patterns without
  turning the whole site into a client app.

# Links / references

- `goal-1`
- `edd-1`
