# P2-034: Audit external link semantics and accessibility

**Priority:** P2

## URL / Section To Update

- mdkg.dev
- docs.mdkg.dev

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

External links and icons should be accessible and safe.

## Acceptance Criteria

- [ ] External links use `target=_blank` and `rel=noopener noreferrer` where applicable.
- [ ] External-link icons have accessible labels or are decorative.
- [ ] CTA buttons are keyboard accessible.
- [ ] Focus states are visible.
- [ ] Links do not rely on color alone.

## Copy / Implementation Guidance

Use visible `↗` in link text for external links where appropriate.

## Notes

This can be covered by QA/a11y pass.
