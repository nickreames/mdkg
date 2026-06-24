# P1-018: Add Local-first and Low-dependency concept page

**Priority:** P1

## URL / Section To Update

- https://mdkg-docs.vercel.app/concepts/
- New docs page

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

Create a docs page that explains mdkg’s security philosophy: local-first, low-dependency, Markdown/Git authority, rebuildable caches, optional project DB state, and supply-chain posture.

## Acceptance Criteria

- [ ] New page exists under Concepts, likely `/concepts/local-first-low-dependency/`.
- [ ] Page explains what lives in Markdown, what is generated, what is optional, and what should not contain secrets.
- [ ] Page distinguishes `.mdkg/index` from `.mdkg/db`.
- [ ] Page explains modern Node and node:sqlite usage where applicable.
- [ ] Page avoids overclaiming dependency minimalism; it says low-dependency by design, not dependency-free unless true.

## Copy / Implementation Guidance

`Low dependency is part of mdkg’s security philosophy. The durable memory layer is Markdown in Git; generated caches are rebuildable; optional project DB state is local and advanced.`

## Notes

Link this from Install, Trust/Safety, and homepage.
