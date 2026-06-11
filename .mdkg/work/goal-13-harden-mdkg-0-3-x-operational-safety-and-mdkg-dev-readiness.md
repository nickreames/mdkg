---
id: goal-13
type: goal
title: Harden mdkg 0.3.x operational safety and mdkg.dev readiness
status: done
priority: 1
goal_state: achieved
goal_condition: Complete the post-0.3.0 hardening roadmap by aligning release hygiene, operator status/doctor strictness, dry-run fix planning, subgraph safety, branch conflict repair, generated command contracts, and mdkg.dev readiness gates before any public docs launch.
scope_refs: [epic-69, epic-74, epic-70, epic-75, epic-71, epic-73, epic-72, task-323, task-324, task-331, task-332, task-333, task-327, task-335, task-336, task-337, task-338, task-339, task-329, task-326, task-341, task-342, task-343, task-344, task-328, task-345, task-346, task-330, test-129, test-130, test-131, test-132, test-133, test-134, test-135, test-136, test-137, test-138, test-139, test-140, test-141]
required_skills: [pursue-mdkg-goal, verify-close-and-checkpoint]
required_checks: [node dist/cli.js validate --json, node dist/cli.js goal next goal-13 --json, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [roadmap, hardening, post-0-3-0, mdkg-dev]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [epic-68, epic-65, epic-66, epic-67]
aliases: []
skills: []
created: 2026-06-09
updated: 2026-06-09
---
# Objective

Own the `0.3.x` operational hardening train that must happen before `mdkg.dev`
becomes a public docs and marketing surface.

# End Condition

- `0.3.1` release hygiene is closed with clean changelog, selected-goal, and
  roadmap graph state.
- Operator status and strict doctor checks make repo health scriptable.
- Dry-run fix planning and repair receipts exist before unsafe repairs.
- Existing subgraph sync/materialize surfaces are hardened and native
  audit/upgrade-plan commands are designed and tested.
- Branch-conflict repair and multi-writer safety are proven in temp repos.
- Generated command contract output gates public command documentation.
- `mdkg.dev` launch work starts only after generated command docs are credible.

# Non-Goals

- No real npm publish, tag, or push unless separately requested.
- No public worker execution in the `0.3.1` hygiene slice.
- No public event/reducer/lease/materializer CLI in the `0.3.1` hygiene slice.
- No mdkg.dev implementation before generated command contract readiness.
- No `mdkg fix apply` until the dry-run receipt contract has implementation and
  temp-repo evidence.

# Recursive Algorithm

1. Inspect the current goal state, relevant graph nodes, and required skills.
2. Create missing mdkg nodes only when evidence shows they are needed.
3. Select one concrete child node and work it to completion.
4. Run required checks and record evidence.
5. Re-evaluate the end condition and continue, pause, or close.

# Required Skills

- `pursue-mdkg-goal`
- `verify-close-and-checkpoint`

# Required Checks

- `node dist/cli.js validate --json`
- `node dist/cli.js goal next goal-13 --json`
- `git diff --check`

# Acceptance Criteria

- Capability epics exist for release hygiene, operator status/doctor, fix
  planning, subgraph hardening, branch/multi-writer safety, generated command
  contracts, and mdkg.dev readiness.
- Existing `goal-11` and `goal-12` are consolidated by relation, not deleted.
- Version milestones remain flexible targets from `0.3.1` through `0.4.0`.
- `mdkg.dev` command docs are explicitly blocked on generated command contract
  output.

# Definition Of Done

- Goal condition is achieved.
- Required checks have evidence.
- Completion evidence is recorded in the goal.

# Stop Conditions

- Goal is blocked beyond the configured attempt limit.
- Required context or permissions are missing.
- Budget or safety constraints prevent continued work.

# Current State

Created after `mdkg@0.3.0` was published and globally validated. `goal-10` is
achieved. `goal-11` remains the deferred execution/public DB/downstream lane,
and `goal-12` remains the subgraph operations lane. The first actionable slice
is `task-323`, limited to `0.3.1` release hygiene and roadmap alignment.

# Iteration Log

- `0.3.1`: release hygiene and roadmap alignment closed with `chk-95` through
  `chk-97`.
- `0.3.2`: operator status and strict doctor baseline closed with `chk-98`
  through `chk-101`.
- `0.3.3`: fix-plan design lane opened with `edd-19`, `task-335` through
  `task-339`, and `test-135` through `test-137`.
- `0.3.4`/`0.3.5`: subgraph audit and upgrade-plan lane closed with
  `chk-111`.
- `0.3.6`/`0.3.7`: branch conflict and multi-writer safety design opened with
  `edd-21`, `task-341` through `task-344`, and `test-138` through `test-140`.
- `0.3.8`/`0.3.9`: generated command contract design opened with `edd-22`,
  `task-345`, `task-346`, and `test-141`.
- `0.3.8`: generated mdkg-native command contract implemented with
  `scripts/generate-command-contract.js`, `dist/command-contract.json`,
  `npm run cli:contract`, and `test-141`.
- `0.3.9`: generated command docs readiness gate added with
  `scripts/smoke-command-docs.js`; `npm run prepublishOnly` passed end to end
  including the new smoke.
- `0.4.0` planning: mdkg.dev launch gate and information architecture captured
  in `edd-23`; public site implementation remains deferred.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- `node dist/cli.js validate --json` passed with zero warnings and zero errors.
- `node dist/cli.js goal next goal-13 --json` returned no actionable node after
  scoped work completion.
- `git diff --check` passed.
- `npm run test` passed 454/454 tests after command contract and docs-smoke
  changes.
- `npm run cli:check` passed.
- `npm run cli:contract` passed with contract hash
  `e2218e4a4fc5ad35efa356786b9d54e572555fe81bbcb03a7ea2da667ca737be`.
- `npm run smoke:command-docs` passed and generated a contract-derived command
  reference in a packed temp repo.
- `npm run prepublishOnly` passed end to end, including all package smokes and
  final `node scripts/assert-publish-ready.js`.
- Completed checkpoint trail: `chk-95` through `chk-125`.
- No real npm publish, git tag, or push was performed in this goal.
