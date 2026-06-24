---
id: dec-42
type: dec
title: public docs prioritize user-facing guidance over maintainer scaffolding
status: accepted
tags: [mdkg-dev, docs, public-alpha]
owners: []
links: []
artifacts: []
relates: [goal-34]
refs: [archive://archive.mdkg-dev-preview-audit-pass-4-2026-06-24]
aliases: []
created: 2026-06-24
updated: 2026-06-24
---
# Context

Pass-4 feedback still found public pages that read like implementation notes, especially changelog, advanced alpha overview, generated reference, roadmap, and command contract surfaces.

# Decision

Public mdkg.dev and docs.mdkg.dev pages prioritize user-facing guidance. Maintainer mechanics, generated-reference internals, staging notes, and "should/future/planned" scaffolding belong in maintainer/reference contexts or mdkg evidence, not beginner paths.

# Alternatives considered

- Keep all current copy and rely on alpha caveats.
- Move maintainer material lower in the nav while rewriting beginner paths.

# Consequences

- Public readers see active product guidance instead of internal planning commentary.
- Maintainer metadata remains available but is clearly labeled and not the default beginner route.
- Goal-34 must audit public copy for scaffold language before closeout.

# Links / references

- `goal-34`
- `task-542`
- `archive://archive.mdkg-dev-preview-audit-pass-4-2026-06-24`
