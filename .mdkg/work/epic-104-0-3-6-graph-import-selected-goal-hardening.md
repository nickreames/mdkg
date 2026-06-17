---
id: epic-104
type: epic
title: 0.3.6 graph import selected-goal hardening
status: done
priority: 1
tags: [0.3.6, graph-import, selected-goal]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
created: 2026-06-17
updated: 2026-06-17
---
# Goal

Make `mdkg graph import-template --select-goal --apply` safe when importing active template goals into repositories that already have an active root goal.

# Scope

- Activation semantics for the rewritten imported start goal.
- Pause semantics for competing active local and imported root goals.
- Unit, packed-smoke, docs, and publish-readiness assertions for the contract.

# Milestones

- Align goal scope and release boundary.
- Implement lifecycle-safe import behavior.
- Extend packed smoke and command docs.

# Out of Scope

- Broader rollback for arbitrary import validation failures.
- Real npm publish, git tag, git push, or global install.

# Risks

- Importing active template goals can currently create multiple active root goals if selected-goal behavior is only a state pointer write.

# Completion Evidence

- task-410 closed with `chk-163` after `goal-19` scope and release boundary alignment.
- task-411 closed with `chk-164` after import-template selected-goal activation semantics were implemented.
- task-412 closed with `chk-165` after docs, smoke coverage, and publish-readiness assertions were updated.
- test-178 closed with `chk-166` after focused graph import unit coverage passed.
- test-179 closed with `chk-167` after packed graph clone smoke coverage passed.

# Links / Artifacts

- goal-19
- task-410
- task-411
- task-412
- test-178
- test-179
