---
id: dec-37
type: dec
title: claims evidence matrix is internal evidence not public navigation
status: accepted
tags: [mdkg-dev, claims, public-boundary, evidence]
owners: []
links: []
artifacts: [mdkg_preview_polish_pass2]
relates: []
refs: [archive://archive.mdkg-dev-preview-polish-pass-2-2026-06-24]
aliases: [mdkg-dev-claims-matrix-internal]
created: 2026-06-23
updated: 2026-06-23
---
# Context

The pass-2 feedback identifies the public Claims Evidence Matrix as confusing. It is useful for launch discipline, but it reads like an internal checklist rather than user documentation.

# Decision

The Claims Evidence Matrix is internal evidence. It must be removed from public docs navigation. If retained as a route or file, it must be noindex/private/internal and not presented as part of the public learning path.

# Alternatives Considered

- Keep it public: transparent, but distracts users and exposes launch mechanics.
- Delete it entirely: simpler, but loses useful claim review evidence.
- Move it into mdkg-only evidence: safest long-term, but Goal 32 may keep a noindex internal file if that reduces implementation risk.

# Consequences

- Public docs focus on learning mdkg.
- Claims still need evidence, but evidence belongs in mdkg checkpoints/design nodes or noindex internal artifacts.
- Goal 32 must validate that public navigation does not expose the matrix.

# Links / References

- `prd-7`
- `goal-32`
- `P0-007`
