# P1-016: Rewrite docs home as a real user-facing documentation home

**Priority:** P1

## URL / Section To Update

- https://mdkg-docs.vercel.app/

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

Docs home should teach users how to use mdkg, not discuss the documentation host or migration state.

## Acceptance Criteria

- [ ] Docs home opens with a clear definition of Markdown Knowledge Graph.
- [ ] It explains what the docs teach: install, initialize, model work, build packs, create handoffs, record evidence, validate.
- [ ] It provides a `Start here` path with 4-6 steps.
- [ ] It includes quick links to Install, Quickstart, Plan → Work → Evidence, Work Node Types, Trust/Safety, and CLI reference.
- [ ] It removes `future canonical host`, `Starlight`, `preview`, and docs-migration commentary.

## Copy / Implementation Guidance

Use the docs-home draft in `COPY_UPDATES_mdkg_dev_pass_2.md`.

## Notes

This should be one of the first docs copy rewrites.
