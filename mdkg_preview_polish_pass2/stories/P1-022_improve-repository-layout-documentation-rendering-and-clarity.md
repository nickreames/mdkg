# P1-022: Improve Repository Layout documentation rendering and clarity

**Priority:** P1

## URL / Section To Update

- https://mdkg-docs.vercel.app/concepts/repository-layout/

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

The repository layout page is important because it explains what is source, cache, generated, optional, and committed. It should render clearly and be easy to scan.

## Acceptance Criteria

- [ ] Repository layout table renders cleanly in Starlight.
- [ ] Each path has clear purpose and commit/rebuild guidance.
- [ ] Page distinguishes `.mdkg/index` from `.mdkg/db` clearly.
- [ ] Page explains skill mirrors `.agents/skills` and `.claude/skills` without overclaiming future configurability.
- [ ] Page links to Local-first/Low-dependency and Trust/Safety pages.

## Copy / Implementation Guidance

Add a summary: `Markdown files, templates, archive sidecars, bundle manifests, and config are durable source. Generated indexes are rebuildable. Optional runtime DB files are advanced local state.`

## Notes

Consider using definition lists or cards if the Markdown table is cramped.
