# P1-020: Improve Quickstart narrative and example work flow

**Priority:** P1

## URL / Section To Update

- https://mdkg-dev.vercel.app/quickstart/
- https://mdkg-docs.vercel.app/start-here/quickstart/

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

Quickstart should tell a short story: initialize memory, create or select work, pack context, do work, record evidence, validate.

## Acceptance Criteria

- [ ] Quickstart distinguishes `first-run setup` from `Plan → Work → Evidence`.
- [ ] It includes an example path for when no goal/work exists yet.
- [ ] It includes a path for working from an existing goal/work node.
- [ ] It shows what to give an agent, especially `mdkg pack WORK_ID` and/or `mdkg handoff create WORK_ID`.
- [ ] It avoids commands that are not verified.

## Copy / Implementation Guidance

Include commands only if verified:

```bash
mdkg new goal "Ship the first docs pass"
mdkg goal activate goal-1
mdkg new task "Fix quickstart copy" --goal goal-1
mdkg goal next
mdkg pack task-1
```

## Notes

If `--goal` flag or IDs differ, adapt to actual CLI behavior.
