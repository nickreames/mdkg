---
id: goal-41
type: goal
title: Complete mdkg 0.3.9 CLI extensibility and release polish foundation
status: todo
priority: 1
goal_state: paused
goal_condition: 0.3.9 is ready for an explicit npm publish approval decision after mdkg supports config-overlay customization, arbitrary skill mirror target paths, an upgradable kernel policy, the COLLABORATION.md compatibility bridge, refreshed first-party skills, docs/release-note drift automation, full change audit, full pre-publish gates, npm pack/publish dry-run, and a final recommendation that states publish-ready or lists remaining gaps.
scope_refs: [epic-199, epic-200, epic-201, task-594, task-595, task-596, task-597, task-598, task-599, task-600, test-302, test-303, test-304, test-305, test-306]
active_node: task-594
required_skills: [select-work-and-ground-context, build-pack-and-execute-task, author-mdkg-skill, verify-close-and-checkpoint]
required_checks: [git status --short --branch, git log --oneline origin/main..HEAD, git diff --name-status origin/main..HEAD, changelog and release notes mapping for every publish-bound change, visible version-reference drift audit, npm view mdkg version --registry=https://registry.npmjs.org/, npm view mdkg@0.3.9 version --registry=https://registry.npmjs.org/, node dist/cli.js index, node dist/cli.js validate --json, node dist/cli.js validate --changed-only --json, npm run build, npm run test, npm run cli:check, npm run cli:contract, npm run docs:check, node scripts/assert-publish-ready.js, npm run smoke:upgrade, npm run smoke:init, custom overlay temp-repo smoke, custom skill mirror temp-repo smoke, NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json, NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run --registry=https://registry.npmjs.org/, publish-readiness recommendation or remaining-gaps report, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [release, 0.3.9, cli, config-overlays, skills, upgrade]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-26
updated: 2026-06-26
---
# Objective

Consolidate the next mdkg CLI polish release around enterprise-friendly
customization and release hygiene. This goal replaces the stale 0.3.9 demo-only
lane (`goal-20`) with the current product/kernel work that should ship before
the next npm release.

# End Condition

`mdkg@0.3.9` is ready for an explicit npm publish approval decision after:

- companies can customize standards through `.mdkg/config.json` overlays instead
  of primarily forking a starter repo;
- custom mirrored skill targets can be arbitrary paths while `.agents/skills`
  and `.claude/skills` remain defaults;
- `mdkg upgrade --apply` can update mdkg-managed kernel assets while preserving
  local overlays, custom core docs, and custom mirror targets;
- `COLLABORATION.md` is the canonical operator/collaboration doc and
  `HUMAN.md` remains a one-release legacy alias;
- first-party skills explain the current CLI surface, including MANIFEST,
  upgrade, validation, docs, archive, bundle, subgraph, work, and db commands;
- docs/release-note maintenance catches CLI drift before publish;
- a final audit maps every publish-bound change to release notes/changelog,
  version references, tests, and package payload;
- the final checkpoint recommends either "publish ready pending explicit
  approval" or lists exact remaining gaps.

# Non-Goals

- Do not create an official forkable starter repo in this release lane.
- Do not make mdkg.dev or docs.mdkg.dev public-site polish the blocking
  implementation scope; that belongs to `goal-42`.
- Do not run a real `npm publish`, tag, push, deploy, or mutate downstream repos
  until a later explicit approval request.

# Recursive Algorithm

1. Start with `task-594` and ground the existing init/config/skill mirror
   surfaces before coding.
2. Implement config overlay and skill mirror behavior before editing docs or
   skills that describe it.
3. Implement the `COLLABORATION.md` bridge in the same compatibility pattern as
   the accepted `MANIFEST.md`/legacy `SPEC.md` bridge.
4. Refresh skills and docs automation only after the CLI behavior is stable.
5. Close with the full 0.3.9 publish-readiness dry-run ladder and a checkpoint.

# Required Skills

- `select-work-and-ground-context`
- `build-pack-and-execute-task`
- `author-mdkg-skill`
- `verify-close-and-checkpoint`

# Required Checks

- Local mdkg graph validation and changed-only validation.
- Build, tests, CLI contract, docs check, and publish-readiness assertions.
- Temp-repo upgrade proof preserving overlays and custom mirror targets.
- Package pack and publish dry-runs with an isolated npm cache.
- Registry availability and local change audit before any publish-ready
  recommendation.

# Acceptance Criteria

- `node dist/cli.js goal next goal-41 --json` selects `task-594` first.
- Companies can configure standards after init and keep the mdkg kernel
  upgradable.
- Skill mirrors accept arbitrary configured paths without regressing the
  `.agents/skills` and `.claude/skills` defaults.
- `COLLABORATION.md` is canonical and `HUMAN.md` is explicitly legacy for one
  release.
- Skills, command docs, generated docs, changelog/release notes automation, and
  publish-readiness checks agree on the new CLI surface.

# Definition Of Done

- Goal condition is achieved.
- Required checks have evidence in a checkpoint.
- `0.3.9` remains unpublished until a separate explicit approved publish step.

# Stop Conditions

- Goal is blocked beyond the configured attempt limit.
- Required context or permissions are missing.
- Budget or safety constraints prevent continued work.

# Current State

- Created by the graph-only 0.3.9/0.4.0 consolidation pass.
- Paused and unclaimed; first actionable node is `task-594`.
- Supersedes the stale `goal-20` demo-only 0.3.9 lane and the obsolete
  `goal-26` pre-0.3.8 release gate.

# Context Refs

- `dec-51`
- `dec-52`
- `dec-53`
- `edd-56`
- `edd-57`
- `chk-282`
- `chk-283`
- `goal-20`
- `goal-26`
- `goal-40`

# Iteration Log

- 2026-06-26: Seeded from source-grounded analysis after `mdkg@0.3.8` publish
  validation (`chk-282`).

# Skill Improvement Candidates

- First-party skills need a focused CLI coverage audit in `task-598`.

# Completion Evidence

- Pending.
