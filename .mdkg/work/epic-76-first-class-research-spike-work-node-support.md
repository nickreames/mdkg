---
id: epic-76
type: epic
title: first-class research spike work-node support
status: todo
priority: 1
tags: [spike, research, work-node, cli]
owners: []
links: []
artifacts: []
relates: [goal-14, task-347, task-348, task-349, task-350, test-142, test-143]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
created: 2026-06-11
updated: 2026-06-11
---
# Goal

Make `spike` a first-class mdkg work-node type that behaves like existing
task-like work while carrying a research/planning-oriented template and docs.

# Scope

- Parser/type support, default template, init asset copy, bundled fallback, and
  test fixture support.
- `mdkg new spike`, task lifecycle compatibility, `mdkg next`, goal traversal,
  search/show/list, pack ordering, validation, and command docs.
- Publish-readiness assertions and packed temp-repo smoke coverage.

# Milestones

- Semantics and release boundary accepted in `task-347`.
- Implementation and lifecycle coverage complete in `task-348`, `test-142`, and
  `test-143`.
- Docs, init assets, command contract, and publish readiness complete in
  `task-349` and `task-350`.

# Out of Scope

- No autonomous browser/search runner.
- No automatic follow-up node or `SKILL.md` generation.
- No separate public `mdkg spike` namespace in this release slice.

# Risks

- Treating spikes as non-actionable notes would break goal routing; they must be
  actionable work nodes.
- Overreaching into automated research or skill generation would expand scope
  beyond a shippable node-type foundation.

# Links / Artifacts

- `goal-14`
- `task-347`
- `task-348`
- `task-350`
