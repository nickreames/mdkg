# P1-010: Replace “golden loop” with “Plan → Work → Evidence”

**Priority:** P1

## URL / Section To Update

- https://mdkg-dev.vercel.app/
- https://mdkg-dev.vercel.app/quickstart/
- https://mdkg-docs.vercel.app/start-here/quickstart/

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

The external operating model should be `Plan → Work → Evidence`, not `golden loop`. This better captures goals, work node types, checkpoints, evidence refs, and validation.

## Acceptance Criteria

- [ ] Homepage section uses `Plan → Work → Evidence` as the main workflow model.
- [ ] Quickstart distinguishes setup commands from the operating loop.
- [ ] Docs explain that goals route work, work nodes represent SDLC units, checkpoints/evidence close the loop, and validation catches broken state.
- [ ] `golden loop` is removed or retained only as internal language.

## Copy / Implementation Guidance

`Plan the goal. Execute one work node. Record evidence. Validate before moving on.`

## Notes

This is a core messaging correction.
