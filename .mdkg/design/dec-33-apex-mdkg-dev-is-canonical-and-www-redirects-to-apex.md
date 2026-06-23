---
id: dec-33
type: dec
title: apex mdkg.dev is canonical and www redirects to apex
status: proposed
tags: [mdkg-dev, dns, domain]
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

The mdkg.dev marketing site needs one canonical production URL before DNS cutover planning. The Astro config already uses `https://mdkg.dev`.

# Decision

Use apex `https://mdkg.dev` as canonical. Configure `https://www.mdkg.dev` to redirect to apex after Vercel preview proof and manual DNS approval.

# Alternatives considered

- Make `www.mdkg.dev` canonical: rejected because it conflicts with the current Astro `site` setting and adds unnecessary URL length.
- Serve both without redirect: rejected because it splits canonical/SEO signals.

# Consequences

- Vercel domain setup must include both apex and `www`.
- DNS cutover checklist must verify apex and redirect behavior.
- Metadata, sitemap, canonical URLs, and social URLs should use apex.

# Links / references

- `edd-31`
- `task-468`
- https://vercel.com/docs/domains/working-with-domains/add-a-domain
- related tasks
