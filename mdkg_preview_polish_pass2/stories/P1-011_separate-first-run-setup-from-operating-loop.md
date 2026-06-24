# P1-011: Separate first-run setup from operating loop

**Priority:** P1

## URL / Section To Update

- https://mdkg-dev.vercel.app/
- https://mdkg-dev.vercel.app/quickstart/
- https://mdkg-docs.vercel.app/start-here/quickstart/

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

The user needs to understand that `init/index/status/validate` proves the local memory layer works, while `goal/pack/task/checkpoint/validate` is the ongoing agent workflow.

## Acceptance Criteria

- [ ] Homepage has separate sections or clearly separated code blocks for `First-run setup` and `Operating loop`.
- [ ] Quickstart docs narrate the difference between setup and ongoing work.
- [ ] Agents are instructed to use `goal current`, `goal next`, `pack`, `task done --checkpoint`, and `validate` for work.
- [ ] No single command block mixes install/setup and operating-loop commands into one ambiguous flow.

## Copy / Implementation Guidance

Section headings: `First, prove the repo memory layer works.` and `Then run the Plan → Work → Evidence loop.`

## Notes

This improves onboarding clarity.
