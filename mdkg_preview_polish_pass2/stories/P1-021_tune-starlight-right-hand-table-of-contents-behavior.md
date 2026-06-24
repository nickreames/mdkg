# P1-021: Tune Starlight right-hand table of contents behavior

**Priority:** P1

## URL / Section To Update

- https://mdkg-docs.vercel.app/
- All docs pages with `On this page → Overview`

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

The current right-hand TOC often shows `On this page → Overview`, which feels noisy and scaffold-like. Tune the docs theme or add meaningful sections.

## Acceptance Criteria

- [ ] Short pages hide the right-hand TOC if it has no useful entries.
- [ ] Long pages have meaningful H2/H3 sections that make the TOC useful.
- [ ] Duplicate or awkward `On this page` text is removed where configurable.
- [ ] Docs pages no longer look like scaffolded placeholder content.

## Copy / Implementation Guidance

No copy requirement; this is docs UX configuration/content structure.

## Notes

If theme config cannot hide per-page TOC easily, add meaningful headings on core pages and defer minor pages.
