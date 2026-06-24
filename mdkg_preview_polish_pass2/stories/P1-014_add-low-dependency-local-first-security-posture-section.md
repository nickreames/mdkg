# P1-014: Add low-dependency/local-first security posture section

**Priority:** P1

## URL / Section To Update

- https://mdkg-dev.vercel.app/
- https://mdkg-docs.vercel.app/start-here/install/
- https://mdkg-docs.vercel.app/concepts/

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

The site should emphasize that low dependency is part of mdkg’s security philosophy, especially for an npm CLI in a supply-chain-risk environment.

## Acceptance Criteria

- [ ] Homepage includes a concise low-dependency trust card/section.
- [ ] Docs include a concept page or install-page subsection on local-first and low-dependency posture.
- [ ] Copy explains TypeScript + modern Node, Markdown/Git authority, local generated artifacts, and optional node:sqlite-powered infrastructure.
- [ ] Copy avoids claiming zero dependencies unless true.
- [ ] Copy clarifies SQLite is local infrastructure where useful, not hidden authority.

## Copy / Implementation Guidance

`mdkg is intentionally boring infrastructure: TypeScript, modern Node, Markdown, Git, and local generated artifacts. SQLite is used where useful for local cache and advanced project DB workflows, but Markdown remains canonical.`

## Notes

Be precise with dependency claims by checking package reality.
