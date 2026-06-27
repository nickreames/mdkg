---
id: epic-201
type: epic
title: 0.3.9 skills docs automation and release readiness polish
status: todo
priority: 1
tags: [0.3.9, skills, docs, automation, release-readiness]
owners: []
links: []
artifacts: [.mdkg/skills, CLI_COMMAND_MATRIX.md, CHANGELOG.md, docs, scripts]
relates: []
blocked_by: []
blocks: [task-598, task-599, task-600, test-305, test-306]
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-26
updated: 2026-06-26
---
# Goal

Keep first-party skills, docs automation, changelog/release notes checks, and
publish-readiness gates aligned with the expanded `0.3.9` CLI surface.

# Scope

- Audit and refresh first-party `SKILL.md` files for current command coverage.
- Add or extend docs/release-note drift automation.
- Run the final `0.3.9` dry-run release ladder.

# Milestones

- `task-598`: skills coverage refresh.
- `task-599`: docs/release-note automation.
- `task-600`: release-readiness closeout.
- `test-305` and `test-306`: drift and dry-run contracts.

# Out of Scope

- Public release notes page implementation; `goal-42` owns that.

# Risks

- CLI capabilities can expand faster than docs and skills.
- Release notes can drift from `CHANGELOG.md` unless checked.

# Links / Artifacts

- `edd-57`
- `goal-42`
