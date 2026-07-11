---
id: dec-66
type: dec
title: Focused loop UX MVP uses plan readiness, loop next, and loop-family descriptors
status: accepted
tags: [loop, ux, cli, descriptor, mvp]
owners: []
links: []
artifacts: []
relates: [goal-59]
refs: [goal-59, edd-69, goal-58, dec-65, loop-4, prop-4, task-691, task-692, test-366]
aliases: []
created: 2026-07-06
updated: 2026-07-06
---
# Context

`loop-4` closed successfully but showed that loop execution currently depends
on an operator manually combining `loop show`, `loop runs`, `loop plan`, `pack`,
and skill instructions. The team wants long-term generic command ergonomics, but
the immediate implementation should stay focused enough to ship and dogfood.

# Decision

For `goal-59`, the MVP loop UX is:

- keep `mdkg new loop "<title>"` as deterministic raw/custom loop creation;
- guide raw-loop users toward `mdkg loop list` and `mdkg loop fork` instead of
  prompting interactively;
- improve `mdkg loop list` for template and loop comparison;
- make `mdkg loop plan` the primary readiness/status cockpit;
- add `mdkg loop next` as the only new loop-specific command in this pass;
- make pre-run questions first-class loop metadata;
- represent waivers with typed `decision_refs` and `approval_refs`;
- keep `/goal` handoff design-only for this goal;
- pilot typed command descriptors only for the loop command family.

# Alternatives considered

- Add `loop status`, `loop evaluate`, and `loop handoff` now. Rejected for MVP
  because it widens the public surface before the readiness projection is proven.
- Build generic work commands first. Rejected for this pass because `loop-4`
  exposed a concrete loop execution gap that can be fixed with smaller blast
  radius.
- Make `mdkg new loop` prompt users to select a template. Rejected because mdkg
  must remain deterministic and scriptable.

# Consequences

- `goal-59` can implement a focused loop UX improvement without owning the
  entire CLI redesign.
- `goal-60` remains the later planning lane for generic command ergonomics.
- The descriptor pilot has a real command family and regression surface, but it
  does not force older high-risk command families to migrate yet.
- Raw loop creation and seeded template forking remain separate concepts.

# Links / references

- `goal-59`
- `edd-69`
- `goal-58`
- `loop-4`
- `prop-4`
- `task-691`
- `task-692`
- `test-366`
