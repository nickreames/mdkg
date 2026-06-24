# P0-006: Remove public scaffold, preview, and implementation-meta commentary

**Priority:** P0

## URL / Section To Update

- https://mdkg-dev.vercel.app/
- https://mdkg-dev.vercel.app/docs/
- https://mdkg-docs.vercel.app/
- All docs pages

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

The public sites should not sound like launch scaffolding. They should act as live product and documentation surfaces even when deployed to preview URLs.

## Acceptance Criteria

- [ ] Remove phrases like `future canonical`, `Starlight site`, `renderer`, `preview bridge`, `entry point until generator is added`, and `may summarize` from public-facing copy.
- [ ] Replace internal launch commentary with product/user-facing guidance.
- [ ] Public alpha caveats remain, but they describe mdkg product maturity rather than website implementation status.
- [ ] Internal launch planning content is moved to repo docs or hidden/noindex pages.

## Copy / Implementation Guidance

Replace meta copy with direct copy such as: `These docs teach the core mdkg workflow: initialize project memory, model work, build packs, create handoffs, record evidence, and validate before closeout.`

## Notes

This is a site-wide copy pass.
