---
id: epic-37
type: epic
title: goal scope selection and skill guided pursuit
status: done
priority: 1
tags: [goal, agent-harness, recursive-work, skills, cli, prepublish]
owners: []
links: []
artifacts: []
relates: [epic-36, prd-3, edd-10, epic-35]
blocked_by: []
blocks: [task-208, task-209, task-210, task-211, task-212, task-213, task-214]
refs: [rule-3, rule-4, rule-6]
aliases: [goal-scope-selection, selected-goal-loop, pursue-mdkg-goal]
skills: [author-mdkg-skill]
created: 2026-06-01
updated: 2026-06-01
---

# Goal

Complete the follow-up goal UX so a human or coding agent can select one goal,
run `mdkg goal next`, receive one scoped actionable item at a time, and pursue
the loop with canonical skill guidance.

# Scope

- Add explicit `scope_refs` for goal ownership roots.
- Add local selected-goal state for short `mdkg goal next`.
- Recursively expand scoped epics and features to actionable features, tasks,
  bugs, and tests.
- Keep `goal next` read-only and add an explicit claim/set-active command.
- Add goal-aware pack behavior and canonical `pursue-mdkg-goal` skill guidance.
- Prove the flow in a fresh packed temp repo and full prepublish dry-run gate.

# Milestones

- Design graph updated with selected-goal and `scope_refs` decisions.
- CLI supports selected goal state, recursive scoped next, and explicit claim.
- Pack, docs, skills, and seeded init assets teach the new goal loop.
- Unit tests, packed smoke, graph validation, and prepublish dry-run pass.

# Out Of Scope

- No real npm publish.
- No autonomous execution of required checks by mdkg.
- No replacement of epics, features, tasks, tests, checkpoints, work orders, or
  receipts.
- No committed selected-goal runtime state.

# Risks

- Recursive traversal must stay scoped to explicit `scope_refs`, `epic`, and
  `parent` links so unrelated urgent work is not pulled into a goal.
- Selected-goal state must remain ignored local convenience state.
- Required checks must remain report-only so mdkg does not become an executor.

# Acceptance Criteria

- `mdkg goal next` works after `mdkg goal select <goal-id>`.
- `mdkg goal next <goal-id>` remains supported.
- `scope_refs` parse, validate, index, and appear in goal JSON receipts.
- Scoped epics and features expand recursively to actionable work.
- `feat`, `task`, `bug`, and `test` can be returned one at a time.
- `mdkg goal claim` writes `active_node`; `mdkg goal next` does not.
- `mdkg pack <goal-id>` includes scoped goal context.
- Canonical skills teach the selected-goal loop.
- Full non-publish prepublish gate passes.

# Completion Evidence

- `npm run build` passed.
- `npm run test` passed with 381 tests.
- `npm run cli:check` passed.
- `node dist/cli.js validate` passed.
- All smoke scripts passed, including `smoke:goal`.
- `node scripts/assert-publish-ready.js` passed.
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json` passed.
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run` passed and reported `+ mdkg@0.1.5`.

# Links / Artifacts

- `prd-3`
- `edd-10`
- `epic-36`
