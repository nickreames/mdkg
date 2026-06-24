# P1-023: Replace generated CLI reference placeholder with useful minimal reference

**Priority:** P1

## URL / Section To Update

- https://mdkg-docs.vercel.app/reference/generated-cli-reference/
- https://mdkg-docs.vercel.app/reference/

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

Until the generated reference is fully integrated, the page should be useful rather than meta. Provide a concise core command reference.

## Acceptance Criteria

- [ ] Generated CLI Reference page no longer says it is merely an entry point until generation exists.
- [ ] Page lists core launch commands with one-line descriptions.
- [ ] Page points users to `mdkg --help` and command-specific help for complete live behavior.
- [ ] Advanced commands are grouped separately and marked advanced alpha.
- [ ] Page avoids stale metadata or version mismatch.

## Copy / Implementation Guidance

`CLI reference is expanding during public alpha. Start with the core commands below. For complete live behavior, run mdkg --help and command-specific help in your installed version.`

## Notes

Generated docs can replace this later.
