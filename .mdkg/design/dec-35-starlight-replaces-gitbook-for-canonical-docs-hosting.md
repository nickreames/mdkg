---
id: dec-35
type: dec
title: Starlight replaces GitBook for canonical docs hosting
status: proposed
tags: [mdkg-dev, starlight, docs]
owners: []
links: []
artifacts: []
relates: []
refs: []
aliases: []
created: 2026-06-22
updated: 2026-06-22
---
# Context

The earlier docs plan assumed GitBook, but the desired docs experience is better served by the Astro ecosystem already used by `mdkg-dev`.

# Decision

Use Starlight for canonical docs. In a later implementation goal, turn `docs/` into a Starlight project, deploy it as Vercel project `mdkg-docs`, and map it to `docs.mdkg.dev` after preview proof and manual DNS approval.

# Alternatives considered

- GitBook: rejected for this lane because Starlight provides the needed docs defaults without a separate paid custom-domain platform.
- Render docs manually in the marketing site: rejected because it recreates search/navigation/code/docs behavior that Starlight already solves.
- Docusaurus or VitePress: rejected because they are less aligned with the existing Astro site.

# Consequences

- `docs.mdkg.dev` is canonical docs.
- `mdkg.dev/docs` becomes a landing/bridge page, not the full docs renderer.
- The implementation goal must add Starlight dependencies and config under `docs/`, not `mdkg-dev/`.

# Links / references

- `edd-32`
- `task-466`
- https://starlight.astro.build/
- related tasks
