# P0-002: Fix llms.txt formatting and content

**Priority:** P0

## URL / Section To Update

- https://mdkg-dev.vercel.app/llms.txt

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

The current llms.txt output should preserve clear Markdown-like newlines and sections so humans and AI agents can parse it easily.

## Acceptance Criteria

- [ ] `/llms.txt` renders as `text/plain` or otherwise preserves newlines exactly.
- [ ] It includes a concise product definition, core promise, safety boundaries, and start commands.
- [ ] It links to mdkg.dev, docs.mdkg.dev, GitHub, npm, quickstart, trust, and alpha pages where URLs are known.
- [ ] It tells agents to prefer `mdkg pack WORK_ID` over ad hoc file lists when building work context.
- [ ] It does not include internal preview/scaffold commentary.

## Copy / Implementation Guidance

Use the llms.txt draft in `COPY_UPDATES_mdkg_dev_pass_2.md` as a starting point.

## Notes

Add `/llms-full.txt` later only if useful; do not block v0 on it.
