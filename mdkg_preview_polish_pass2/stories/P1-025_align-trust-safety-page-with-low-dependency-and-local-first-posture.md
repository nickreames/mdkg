# P1-025: Align Trust/Safety page with low-dependency and local-first posture

**Priority:** P1

## URL / Section To Update

- https://mdkg-dev.vercel.app/trust/
- docs Safety page

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

The Trust page already has the right boundaries but should be tightened and tied to low-dependency/security philosophy.

## Acceptance Criteria

- [ ] Trust page clearly states local-first, no hosted index, no hosted runtime, no autonomous execution, no skill execution, and read-only MCP boundaries.
- [ ] Trust page explicitly says low-dependency is part of security philosophy.
- [ ] Trust page distinguishes Markdown source, generated index cache, and optional project DB state.
- [ ] It says raw-marker warnings are not full DLP/secret scanning.
- [ ] It links to docs concept pages for Local-first/Low-dependency and Repository Layout.

## Copy / Implementation Guidance

`Local-first and low-dependency are part of mdkg’s security posture. Project memory lives in Markdown and Git; generated indexes are rebuildable; optional SQLite-backed state stays local.`

## Notes

Avoid guaranteeing safety/security beyond actual behavior.
