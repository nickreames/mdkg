---
id: epic-84
type: epic
title: 0.3.2 spike release hardening and prepublish readiness
status: todo
priority: 1
tags: [spike, hardening, prepublish, 0.3.2]
owners: []
links: []
artifacts: []
relates: [task-348, test-152]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
created: 2026-06-11
updated: 2026-06-11
---
# Goal

Harden first-class `spike` support beyond the basic node-type implementation so
the feature can reach `0.3.2` release-candidate readiness without a real publish.

# Scope

- Template, init, and upgrade compatibility for `spike` nodes.
- Pack ordering, visibility behavior, structured exports, command contract, and
  generated docs parity.
- Validation and fix-plan UX for malformed or partially migrated spike records.
- Full local gates through pack dry-run and publish dry-run.

# Milestones

- `task-364` confirms scope and routing.
- `task-365` through `task-367` cover hardening implementation.
- `task-368` prepares the `0.3.2` RC gate.
- `task-369` records closeout evidence and hands off mdkg.dev dogfood.

# Out of Scope

- Real npm publish, git tag, or push.
- Top-level `mdkg spike ...` command namespace.
- Automatic web search, autonomous research execution, or automatic `SKILL.md`
  generation.

# Risks

- Treating spike as only a template would miss next/goal/pack/export behavior.
- Adding the node type without init/upgrade tests could break existing repos.
- Over-documenting future autonomous behavior would mislead mdkg.dev users.

# Links / Artifacts

- `goal-14`
- `task-348`
- `test-152`
