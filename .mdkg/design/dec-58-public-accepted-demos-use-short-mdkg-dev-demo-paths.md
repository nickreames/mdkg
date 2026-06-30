---
id: dec-58
type: dec
title: public accepted demos use short mdkg dev demo paths
status: accepted
tags: [demo, mdkg-dev, routing, decision, public-site]
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

The earlier demo roadmap assumed accepted demos would eventually move to
`demo-N.mdkg.dev` subdomains after a Vercel preview proof. The operator has
now chosen a shorter public URL model that keeps accepted demos inside the
canonical mdkg.dev site: `/demo/1`, `/demo/2`, and a directory at `/demos`.

# Decision

Accepted public demos use short mdkg.dev path URLs:

- `/demos` is the public gallery and index.
- `/demo/1`, `/demo/2`, and later numbered paths are canonical demo detail URLs.
- `/demo/1/output` or an equivalent child route exposes the final rendered demo
  output when the implementation needs a dedicated preview surface.
- Candidate demos stay local or approval-gated until accepted. Only accepted
  demos become visible in the public gallery.

This decision supersedes the default `demo-N.mdkg.dev` hosting model for the
current lane. Subdomains can remain a future optional hosting experiment, but
they are no longer the default public-demo URL strategy.

# Alternatives considered

- Keep `demo-N.mdkg.dev`: rejected as the default because it adds Vercel/DNS
  work before the demo UX and source integration are proven.
- Keep only opaque Vercel preview URLs: rejected for accepted demos because it
  makes the public gallery harder to remember and harder to explain.
- Use `/demos/1`: rejected in favor of `/demo/1` for the detail route because
  the shorter singular route is cleaner while `/demos` remains the directory.

# Consequences

- `goal-44` should prove `/demos`, `/demo/1`, and `/demo/1/output` locally in
  the existing mdkg.dev Astro app before any provider mutation.
- `goal-46`'s `demo-N.mdkg.dev` plan becomes historical/future optional context
  instead of the next required lane.
- Browser/Chrome proof must validate the short paths and public safety of the
  accepted demo content.
- No push, deploy, DNS, tag, publish, or provider mutation is authorized by this
  decision.

# Links / references

- `goal-44`
- `goal-46`
- `dec-57`
