---
tags: [mdkg-dev, vercel, deployment, analytics, launch-boundary]
owners: []
links: [https://vercel.com/docs/analytics]
artifacts: [mdkg_planning_docs.zip]
relates: [edd-26, edd-29, edd-30]
refs: [archive://archive.mdkg-dev-planning-docs-2026-06-22]
aliases: [vercel-readiness-no-launch-boundary]
created: 2026-06-22
updated: 2026-06-22
id: dec-32
type: dec
title: Vercel readiness preview analytics and no-production-launch boundary
status: accepted
---
# Context

mdkg.dev is expected to deploy to Vercel later, and future demos may use preview deployments or durable demo subdomains. Goal-25 prepares the codebase and evidence but must not launch publicly.

# Decision

- Goal-25 may add Vercel-ready static build documentation, metadata, and scripts.
- Goal-25 must not run production deploys, promote previews, change DNS, configure production domains, or claim analytics are enabled unless separately requested and verified.
- Preview URLs and demo deployments are deferred; if created later, unpromoted previews must be noindexed and must not become canonical SEO targets.
- Vercel Web Analytics may be planned because it stores anonymized, cookie-free data, but activation is a later explicit launch action.
- Canonical mdkg.dev remains stable for SEO; demos belong on preview URLs or durable `demo-N.mdkg.dev` subdomains only after promotion.

# Alternatives considered

- Deploy during goal-25 closeout: rejected because this goal is pre-release readiness, not public launch.
- Promote demo previews into canonical mdkg.dev paths: rejected because demos need disposable review and explicit promotion semantics.
- Skip Vercel readiness planning: rejected because the implementation should avoid late deployment surprises even while production launch remains out of scope.

# Consequences

- Implementation can be Vercel-ready without making a public launch claim.
- Live demo work remains separate from canonical site SEO.
- Closeout evidence must say "not deployed" and "not launched" unless a later explicit request changes the boundary.

# Links / references

- goal-25
- task-450
- task-452
- task-454
- test-203
- test-205
- archive://archive.mdkg-dev-planning-docs-2026-06-22
