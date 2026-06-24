# P0-009: Define preview noindex and canonical policy

**Priority:** P0

## URL / Section To Update

- mdkg-dev preview deployment
- mdkg-docs preview deployment
- SEO metadata

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

Preview deployments should not compete with future canonical domains. Define and implement the safest practical noindex/canonical behavior for Vercel preview URLs.

## Acceptance Criteria

- [ ] Production URLs use canonical `https://mdkg.dev` and `https://docs.mdkg.dev` when ready.
- [ ] Preview URLs are noindexed if feasible without blocking manual review.
- [ ] Robots/meta behavior is documented.
- [ ] Sitemap includes only intended public routes for the current deployment context.
- [ ] Demo/preview routes are excluded from sitemap unless explicitly promoted.

## Copy / Implementation Guidance

Internal policy only; no public copy required.

## Notes

If preview noindex conflicts with manual review, document the tradeoff and defer implementation until production setup.
