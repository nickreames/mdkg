# P0-007: Hide Claims Evidence Matrix from public docs navigation

**Priority:** P0

## URL / Section To Update

- https://mdkg-docs.vercel.app/project/claims-evidence-matrix/
- Docs navigation

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

The claims evidence matrix is useful internally, but it currently reads like governance/planning material. It should not be part of public docs navigation for v0.

## Acceptance Criteria

- [ ] Claims Evidence Matrix is removed from public docs nav.
- [ ] If retained as a route, it is noindexed or clearly internal-only.
- [ ] Public trust claims are handled through the Trust/Safety page instead.
- [ ] Homepage copy remains backed by the internal claims matrix but does not expose the matrix to normal users.

## Copy / Implementation Guidance

No public replacement required. Use `/trust` and docs Safety pages as the public-facing trust surface.

## Notes

A polished claims page can be considered later if there is a reason to make it public.
