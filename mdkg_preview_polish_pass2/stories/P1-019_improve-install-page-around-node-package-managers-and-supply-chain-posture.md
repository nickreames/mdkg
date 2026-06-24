# P1-019: Improve Install page around Node, package managers, and supply-chain posture

**Priority:** P1

## URL / Section To Update

- https://mdkg-docs.vercel.app/start-here/install/

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

The install page is already one of the better pages. It should be upgraded with low-dependency/security rationale and package-manager clarity.

## Acceptance Criteria

- [ ] Node requirement is prominent and accurate.
- [ ] Supported install commands are verified for npm, pnpm, bun, and any npx/dlx/bunx path before inclusion.
- [ ] Page explains why modern Node is required if appropriate.
- [ ] Page mentions supply-chain hygiene: do not put package-manager tokens/credentials in mdkg graph nodes.
- [ ] Page links to Local-first and Low-dependency concept page.

## Copy / Implementation Guidance

`mdkg is designed to stay boring: modern Node, TypeScript, Markdown in Git, and local generated artifacts. Install it like a normal CLI, then keep secrets and package-manager credentials out of graph nodes.`

## Notes

Verify commands before documenting.
