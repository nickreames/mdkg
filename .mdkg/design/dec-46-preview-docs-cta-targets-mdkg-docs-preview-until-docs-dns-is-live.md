---
id: dec-46
type: dec
title: preview docs CTA targets mdkg docs preview until docs DNS is live
status: accepted
tags: [mdkg-dev, docs, vercel, dns]
owners: []
links: [https://mdkg-docs.vercel.app/]
artifacts: [archive://archive.mdkg-dev-preview-audit-pass-5-2026-06-24]
relates: []
refs: [archive://archive.mdkg-dev-preview-audit-pass-5-2026-06-24]
aliases: []
created: 2026-06-24
updated: 2026-06-24
---
# Context

`docs.mdkg.dev` is the future canonical docs domain, but DNS is not live during preview polish.

# Decision

Preview-facing docs CTAs must target `https://mdkg-docs.vercel.app/` until the DNS cutover goal explicitly changes production links.

# Alternatives considered

- Point to `docs.mdkg.dev` now: rejected because it can create broken links before manual DNS.
- Keep `/docs` as a full marketing bridge: rejected for this pass because it obscures the real docs preview.

# Consequences

The implementation must update header, hero, footer, `/docs`, and docs references consistently and test preview links explicitly.

# Links / references

- `goal-35`
- `edd-48`
- `task-550`
