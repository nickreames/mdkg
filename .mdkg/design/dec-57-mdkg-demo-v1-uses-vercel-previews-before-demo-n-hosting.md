---
id: dec-57
type: dec
title: mdkg demo v1 uses Vercel previews before demo N hosting
status: accepted
tags: [demo, vercel, preview, dns, decision]
owners: []
links: []
artifacts: []
relates: []
refs: [edd-33, dec-32]
aliases: []
created: 2026-06-29
updated: 2026-06-29
---
# Context

The long-term direction is a moderately structured `demo-N.mdkg.dev` hosting
model, but the immediate demo workflow needs low-risk iteration with Vercel
preview URLs first.

# Decision

For v1, demo runs use Vercel preview links only. Durable `demo-N.mdkg.dev`
hosting, custom domains, aliases, DNS, and production promotion belong to the
paused follow-up goal (`goal-46`) and require an accepted preview checkpoint
from `goal-44`.

# Alternatives considered

- Create durable demo subdomains immediately: rejected because the template and
  preview evidence loop is not proven yet.
- Reuse canonical mdkg.dev paths for demos: rejected because it risks SEO and
  trust confusion.

# Consequences

- `goal-44` may plan an approval-gated dedicated Vercel preview project named
  `mdkg-demo-previews`.
- `goal-44` does not authorize DNS, custom domains, aliases, production
  promotion, or durable hosting.
- `goal-46` is blocked until an accepted preview exists.

# Links / references

- `goal-44`
- `goal-46`
- `edd-33`
- `dec-32`
