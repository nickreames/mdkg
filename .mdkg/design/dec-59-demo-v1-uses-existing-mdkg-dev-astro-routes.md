---
id: dec-59
type: dec
title: demo v1 uses existing mdkg dev Astro routes
status: accepted
tags: [demo, mdkg-dev, astro, vercel, decision]
owners: []
links: []
artifacts: []
relates: []
refs: [goal-44, goal-46, dec-57]
aliases: []
created: 2026-06-29
updated: 2026-06-29
---
# Context

Vercel supports separate monorepo projects, but a dedicated demo project is not
required for the selected URL model. The mdkg-dev Astro app already owns the
canonical public site and can expose demo pages through framework-native routes.
Astro-on-Vercel guidance also favors native Astro routing over Vercel rewrites
for Astro path behavior.

# Decision

Demo v1 uses the existing `mdkg-dev` Astro source tree and Vercel project. The
implementation lane should add source routes such as:

- `mdkg-dev/src/pages/demos.astro`
- `mdkg-dev/src/pages/demo/[id].astro`
- a static or generated child route for `/demo/1/output`

Do not create a separate `mdkg-demo-previews` Vercel project by default. A
separate monorepo project can be reconsidered only if source integration proves
too heavy, deployment isolation becomes necessary, or accepted demos require a
different build boundary.

# Alternatives considered

- Create `mdkg-demo-previews`: deferred because it adds provider state and
  project limits without solving the chosen `/demo/:id` user experience.
- Use Vercel rewrites to proxy demo output: rejected as the default because
  framework-native Astro routes are easier to build, test, and validate.
- Keep demo output entirely outside mdkg.dev: rejected for accepted demos
  because the public gallery should let readers compare graph, source snapshot,
  and output in one place.

# Consequences

- The next implementation work is mdkg-dev source planning and local route
  validation, not Vercel project creation.
- Existing Vercel project ids remain useful for eventual mdkg.dev deployment
  proof, but this graph pass does not mutate Vercel.
- `task-621` is superseded as a provider-mutation blocker and becomes historical
  local preflight context.
- Future implementation must prove the homepage and normal docs routes are not
  slowed by demo viewer code.

# Links / references

- `goal-44`
- `goal-46`
- `task-628`
- Vercel monorepos docs: https://vercel.com/docs/monorepos
- Vercel Astro docs: https://vercel.com/docs/frameworks/frontend/astro
