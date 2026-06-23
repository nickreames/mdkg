---
id: dec-1
type: dec
title: Keep demo local preview only until explicit promotion
status: accepted
tags: [demo, deploy-boundary, mdkg-dev]
owners: []
links: []
artifacts: []
relates: []
refs: [goal-1]
aliases: []
created: 2026-06-22
updated: 2026-06-22
---
# Context

The demo graph is intended for live explanation and dogfooding, but production hosting creates SEO, privacy, and operational risk.

# Decision

Keep the demo local-only by default. Preview deployment and durable demo promotion require separate explicit goals with teardown and promotion evidence.

# Alternatives considered

- local-only artifact by default
- disposable preview deployment during a later explicit rehearsal
- durable demo subdomain after promotion

# Consequences

- Positive: safe to commit and inspect publicly.
- Positive: no hidden cloud/provider dependency.
- Negative: a later goal is needed before using this as a public live URL.

# Links / references

- goal-1
- edd-3
