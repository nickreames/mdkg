---
id: dec-1
type: dec
title: Keep template cloneable and no production deploy by default
status: accepted
tags: [template, deploy-boundary, mdkg-dev]
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

The website template should support live demos and candidate-site generation without accidentally replacing canonical mdkg.dev or mutating production surfaces.

# Decision

Keep the template cloneable and local-only by default. Preview deploys, durable demo subdomains, analytics, and production promotion require explicit later goals.

# Alternatives considered

- cloneable local template
- preview-deploy template
- production-ready website starter

# Consequences

- Positive: safe for demos, forks, and agent experimentation.
- Positive: canonical mdkg.dev remains stable.
- Negative: a later preview/promotion workflow is required before public hosting.

# Links / references

- goal-1
- edd-3
