# P0-004: Simplify header navigation and open external links in new tabs

**Priority:** P0

## URL / Section To Update

- https://mdkg-dev.vercel.app/
- Header / nav / CTA links

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

The top nav should be more concise and should distinguish internal anchors/routes from external destinations.

## Acceptance Criteria

- [ ] Recommended nav is `Quickstart`, `Docs ↗`, `GitHub ↗`, `npm ↗`.
- [ ] `Docs`, `GitHub`, and `npm` open in a new tab with `target="_blank"` and `rel="noopener noreferrer"` when external.
- [ ] `Alpha` is removed from primary nav and moved to footer/trust/hero note.
- [ ] Header is compact on mobile and does not wrap awkwardly.
- [ ] Primary CTA in hero remains focused on getting started or GitHub.

## Copy / Implementation Guidance

Header: `mdkg | Quickstart | Docs ↗ | GitHub ↗ | npm ↗`

## Notes

If docs production domain is not configured, link to the current docs preview during preview builds but keep production copy domain-oriented.
