---
id: epic-221
type: epic
title: Improve mdkg new loop and loop list discovery UX
status: todo
priority: 1
tags: [loop, ux, new, discovery]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-59, edd-69, dec-66, loop-4, prop-4]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-06
updated: 2026-07-06
---
# Goal

Make raw loop creation and seeded template discovery clear without adding
interactive CLI behavior.

# Scope

- `mdkg new loop` guidance and JSON next actions.
- `mdkg loop list` output that helps users compare seeded templates and existing
  loops before forking.
- Deterministic, scriptable behavior for humans, agents, and CI.

# Milestones

- `task-695`: improve raw loop creation guidance.
- `task-696`: improve list/discovery comparison output.

# Out of Scope

- Interactive template selection prompts.
- Replacing `mdkg loop fork` with `mdkg new loop --from-template`.

# Risks

- Confusing raw loop creation with template instantiation.
- Changing JSON envelopes in a breaking way.

# Links / Artifacts

- `goal-59`
- `edd-69`
- `dec-66`
