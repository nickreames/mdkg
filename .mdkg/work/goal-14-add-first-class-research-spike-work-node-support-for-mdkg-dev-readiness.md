---
id: goal-14
type: goal
title: Complete first-class research spike system and 0.3.2 RC readiness
status: todo
priority: 1
goal_state: active
goal_condition: Ship a first-class, hardened research spike work-node system through implementation, docs, packed temp-repo proof, mdkg.dev dogfood handoff, and 0.3.2 release-candidate dry-run readiness without a real publish.
scope_refs: [epic-76, epic-77, epic-84, task-347, task-348, task-349, task-350, task-351, task-364, task-365, task-366, task-367, task-368, task-369, test-142, test-143, test-144, test-152, test-153, test-154, test-155, test-156]
active_node: task-348
required_skills: [pursue-mdkg-goal, author-mdkg-skill, verify-close-and-checkpoint]
required_checks: [npm run build, npm run test, npm run cli:check, npm run cli:contract, node dist/cli.js validate --json, npm run smoke:init, npm run smoke:upgrade, npm run smoke:spike, npm run smoke:command-docs, npm run prepublishOnly, node scripts/assert-publish-ready.js, NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json, NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [spike, research, mdkg-dev, node-type, roadmap, hardening, 0.3.2]
owners: []
links: []
artifacts: []
relates: [epic-69, epic-74, epic-75]
blocked_by: []
blocks: []
refs: [goal-11, goal-13]
aliases: []
skills: []
created: 2026-06-11
updated: 2026-06-11
---
# Objective

Complete `spike` as a first-class mdkg work-node type for research, planning,
documentation discovery, security/UX/data-structure investigation, and
structured creation of follow-up mdkg nodes and skill-authoring work. This goal
now includes release-hardening scope for the `0.3.2` release-candidate path:
template/init/upgrade compatibility, pack visibility/export behavior, command
contract parity, validation/fix-plan UX, packed temp-repo proof, and dry-run
prepublish readiness.

# End Condition

- `mdkg new spike "..." --json` creates validation-clean `spike-#` nodes under
  `.mdkg/work/`.
- Spike nodes participate in the same first-class work flows as task-like nodes:
  `mdkg task start/update/done`, `mdkg next`, `mdkg goal next`, `mdkg goal claim`,
  search, show, pack, validate, and generated command contract/docs.
- The default spike template guides research question framing, web/docs/mdkg
  search plans, findings, options, recommendation, follow-up nodes, skill
  candidates, evidence, and mdkg.dev launch implications.
- Fresh init and upgrade flows install or propose the spike template safely
  without silently overwriting local customization.
- Pack, visibility, JSON/XML/TOON/Markdown exports, generated command contract,
  and command docs account for spike nodes deterministically.
- Malformed spike records fail validation clearly and `mdkg fix plan --json`
  offers useful non-mutating guidance where existing repair families apply.
- Packed temp-repo smoke coverage proves spike creation, lifecycle, discovery,
  goal routing, pack inclusion, follow-up node planning, and skill candidate
  recording from an installed tarball.
- `0.3.2` release-candidate gates pass through pack dry-run and publish dry-run
  without a real npm publish, tag, or push.

# Non-Goals

- No automatic web search execution in the mdkg CLI.
- No automatic creation of follow-up nodes or `SKILL.md` files in the first pass.
- No top-level `mdkg spike ...` namespace in this slice.
- No public worker execution, public event/reducer/lease/materializer CLI, or
  downstream migration automation from paused `goal-11`.
- No mdkg.dev website implementation; this goal creates the research node type
  and dogfoods it toward that launch.
- No version publish from this goal. `0.3.2` means release-candidate readiness
  unless a separate explicit publish request is made.

# Recursive Algorithm

1. Inspect the current goal state, relevant graph nodes, and required skills.
2. Create missing mdkg nodes only when evidence shows they are needed.
3. Select one concrete child node and work it to completion.
4. Run required checks and record evidence.
5. Re-evaluate the end condition and continue, pause, or close.

# Required Skills

- `pursue-mdkg-goal`
- `author-mdkg-skill`
- `verify-close-and-checkpoint`

# Required Checks

- `npm run build`
- `npm run test`
- `npm run cli:check`
- `npm run cli:contract`
- `node dist/cli.js validate --json`
- `npm run smoke:init`
- `npm run smoke:upgrade`
- `npm run smoke:spike`
- `npm run smoke:command-docs`
- `npm run prepublishOnly`
- `node scripts/assert-publish-ready.js`
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run`
- `git diff --check`

# Acceptance Criteria

- `spike` is accepted by parser, validators, templates, creation, task lifecycle,
  next selection, goal traversal, pack ordering, command docs, and init assets.
- Spike hardening includes init/upgrade compatibility, pack/export/visibility,
  command-contract parity, and validation/fix-plan UX.
- Docs state that spikes are research/planning work nodes, not execution agents.
- The smoke proves the public CLI experience from a temp repo using an installed
  package tarball.
- Dogfood evidence creates or updates mdkg.dev launch planning through spike
  output, not scattered notes.
- `0.3.2` release-candidate evidence is recorded before `goal-14` closeout.

# Definition Of Done

- Goal condition is achieved.
- Required checks have evidence.
- Completion evidence is recorded in the goal.

# Stop Conditions

- Goal is blocked beyond the configured attempt limit.
- Required context or permissions are missing.
- Budget or safety constraints prevent continued work.
- Do not run a real npm publish, git tag, or push unless separately requested.

# Current State

`mdkg@0.3.1` is published and globally installed. Existing work-node types do
not include `spike`. `task-347` locked the semantics and release boundary, and
this alignment pass expands the active goal with hardening and `0.3.2` RC
readiness nodes. During alignment, `active_node` is `task-364`; after successful
alignment closeout, the goal should claim `task-348`.

# Iteration Log

- `task-347` completed and checkpointed the spike semantics contract.
- `task-364` aligns the expanded hardening scope before implementation resumes.

# Skill Improvement Candidates

- Capture any repeatable spike authoring workflow as a future update to
  `author-mdkg-skill`.

# Completion Evidence

- Pending.
