---
id: dec-36
type: dec
title: feedback polish ships as P0 plus core P1 with P2 deferred
status: accepted
tags: [mdkg-dev, feedback, prioritization, public-alpha]
owners: []
links: []
artifacts: [mdkg_dev_feedback]
relates: []
refs: [archive://archive.mdkg-dev-feedback-user-stories-2026-06-23]
aliases: [mdkg-dev-feedback-scope-decision]
created: 2026-06-23
updated: 2026-06-23
---
# Context

The `mdkg_dev_feedback/` bundle contains 60 stories across P0, P1, and P2. The next implementation pass needs to be ambitious and useful, but still bounded enough to complete with real validation and preview redeploy proof.

# Decision

Goal 30 will implement all P0 stories plus the core P1 stories needed for public-alpha credibility. P2 items and external-side-effect work are explicitly deferred into follow-up nodes or closeout recommendations.

# Alternatives Considered

- Implement only P0: safer but leaves the docs/product funnel too thin for a serious public-alpha review.
- Implement all P0 and P1: useful but likely too large for one focused implementation run.
- Implement all 60 stories: too broad and likely to delay validation, push, and preview proof.

# Consequences

- Goal 30 can close with a polished public-alpha preview while preserving a clear next backlog.
- Browser/Product Design/SEO/no-secret validation become release gates, not optional polish.
- DNS, production promotion, analytics activation, npm publish, git tag, and GitHub settings mutation remain outside Goal 30.

# Links / references

- `prd-6`
- `edd-34`
- `edd-35`
- `goal-30`
- `archive://archive.mdkg-dev-feedback-user-stories-2026-06-23`
