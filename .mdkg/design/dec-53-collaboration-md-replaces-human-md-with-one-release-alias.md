---
id: dec-53
type: dec
title: COLLABORATION.md replaces HUMAN.md with one release alias
status: accepted
tags: [0.3.9, collaboration, core-docs, compatibility]
owners: []
links: []
artifacts: [.mdkg/core/HUMAN.md, AGENT_START.md, assets/init/core]
relates: []
refs: [dec-17, dec-50]
aliases: []
created: 2026-06-26
updated: 2026-06-26
---
# Context

`HUMAN.md` exists as the human working profile and collaboration preference
surface, but the name is not operational enough for how mdkg is now used.
The recent MANIFEST/SPEC rename also established the pattern for a one-release
compatibility bridge rather than an abrupt file removal.

# Decision

`COLLABORATION.md` becomes the canonical operator/collaboration profile.
`HUMAN.md` remains a legacy alias for one compatibility release, then fades out
alongside the `SPEC.md` compatibility bridge in a follow-up release.

# Alternatives considered

- Keep `HUMAN.md`: stable but underspecified and not aligned with actual use.
- Rename directly without alias: cleaner long-term, but unsafe for existing
  initialized repos and agent prompts.
- `PROFILE.md` or `OPERATOR.md`: serviceable names, but `COLLABORATION.md`
  better describes the doc's purpose.

# Consequences

- Init and upgrade behavior must introduce `COLLABORATION.md` without deleting
  local `HUMAN.md` customizations during the compatibility release.
- AGENT_START and skills should prefer `COLLABORATION.md` while mentioning the
  temporary alias.
- A later goal should remove or further demote both `HUMAN.md` and legacy
  `SPEC.md` after the compatibility window.

# Links / references

- `goal-41`
- `task-597`
- `test-304`
