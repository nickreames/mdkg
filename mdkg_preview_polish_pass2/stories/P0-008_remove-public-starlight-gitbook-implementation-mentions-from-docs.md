# P0-008: Remove public Starlight/GitBook implementation mentions from docs

**Priority:** P0

## URL / Section To Update

- https://mdkg-docs.vercel.app/
- https://mdkg-docs.vercel.app/reference/generated-cli-reference/
- Docs pages

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

Docs should teach mdkg, not document how the docs are generated/rendered. Public implementation details about Starlight/GitBook should be removed from user-facing docs.

## Acceptance Criteria

- [ ] No public docs page explains that Starlight is the docs renderer unless unavoidable in framework footer.
- [ ] Generated CLI reference page gives useful command guidance instead of explaining future generator work.
- [ ] Docs home reads as a live docs home, not a migration note.
- [ ] Internal docs generation policy remains in repo/internal docs only.

## Copy / Implementation Guidance

Generated reference fallback: `CLI reference is expanding during public alpha. Start with the core commands below. For complete live behavior, run mdkg --help and command-specific help in your installed version.`

## Notes

This overlaps with P0-006 but is docs-specific.
