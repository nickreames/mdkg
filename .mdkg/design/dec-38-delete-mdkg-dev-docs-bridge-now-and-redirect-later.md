---
id: dec-38
type: dec
title: delete mdkg.dev docs bridge now and redirect later
status: accepted
tags: [mdkg-dev, docs, routing, public-boundary]
owners: []
links: []
artifacts: [mdkg_preview_polish_pass2]
relates: []
refs: [archive://archive.mdkg-dev-preview-polish-pass-2-2026-06-24]
aliases: [mdkg-dev-docs-route-delete-now]
created: 2026-06-23
updated: 2026-06-23
---
# Context

The marketing `/docs` page currently competes with the Starlight docs surface and has carried implementation-meta language. The user clarified that it should be deleted now; a redirect can be added later once `docs.mdkg.dev` is canonical.

# Decision

Goal 32 should remove the marketing `/docs` bridge page. It should not implement a production redirect yet, because DNS and public launch remain out of scope.

# Alternatives Considered

- Keep a bridge page permanently: preserves marketing control but creates duplicate docs entrypoints.
- Redirect immediately: cleaner long-term, but premature before DNS/cutover work.
- Delete now and add redirect later: best fit for this pass.

# Consequences

- Site navigation should link users directly to the docs preview/canonical docs concept where appropriate.
- Future launch/cutover work should add the production redirect after `docs.mdkg.dev` is configured.
- Goal 32 validation must ensure no stale `/docs` marketing copy remains.

# Links / References

- `P0-005`
- `goal-32`
- `edd-36`
