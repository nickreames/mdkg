# P0-005: Replace mdkg.dev /docs meta page with redirect or clean docs bridge

**Priority:** P0

## URL / Section To Update

- https://mdkg-dev.vercel.app/docs/

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

The current `/docs` route explains implementation details about the docs site and preview setup. Public users should not see meta commentary. The route should redirect to the docs host or show a minimal product-facing bridge.

## Acceptance Criteria

- [ ] Production `/docs` redirects to `https://docs.mdkg.dev` when ready.
- [ ] Preview `/docs` redirects to the preview docs URL or shows a minimal bridge with no Starlight/GitBook/meta commentary.
- [ ] No public copy explains that docs are a renderer, preview, future canonical host, or scaffold.
- [ ] Header Docs link points to the docs host directly where practical.

## Copy / Implementation Guidance

Minimal fallback bridge: `Markdown Knowledge Graph documentation is hosted at docs.mdkg.dev. Use the docs to install mdkg, learn the Plan → Work → Evidence loop, and give agents deterministic project context.`

## Notes

Keep repo-first docs ownership decisions in internal docs, not public route copy.
