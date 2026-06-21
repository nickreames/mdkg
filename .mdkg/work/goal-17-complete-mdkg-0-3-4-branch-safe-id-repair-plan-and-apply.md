---
id: goal-17
type: goal
title: Complete mdkg 0.3.4 branch-safe ID repair plan and apply
status: done
priority: 1
goal_state: achieved
goal_condition: 0.3.4 is dry-run publish ready after duplicate IDs and Git conflict-stage ID collisions can be planned, applied, receipted, and verified while preserving links and prioritizing main branch IDs.
scope_refs: [epic-89, epic-90, epic-91, spike-6, task-380, task-381, task-382, task-383, task-384, task-385, test-162, test-163, test-164]
last_active_node: task-385
required_skills: [pursue-mdkg-goal, verify-close-and-checkpoint]
required_checks: [npm run build, npm run test, npm run cli:check, npm run cli:contract, node dist/cli.js validate --json, npm run smoke:id-repair, npm run prepublishOnly, node scripts/assert-publish-ready.js, NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json, NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run, git diff --check]
max_iterations: 30
blocked_after_attempts: 3
tags: [release, 0.3.4, id-repair, branch-safety]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Objective

Deliver branch-safe ID repair planning and apply behavior for teams and agents merging divergent mdkg graph branches.

# End Condition

0.3.4 is dry-run publish ready after duplicate IDs and Git conflict-stage ID collisions can be planned, applied, receipted, and verified while preserving links and prioritizing main branch IDs.

# Non-Goals

- Do not weaken validation to ignore duplicate IDs.
- Do not mutate unrelated child repos.
- Do not attempt semantic merge of markdown bodies beyond preserving links and references.

# Recursive Algorithm

1. Inspect current graph, release boundary, selected goal, and scoped nodes.
2. Run or complete the active research spike when present, then claim one implementation task at a time.
3. Keep mutation receipts, test evidence, and checkpoint notes on scoped nodes.
4. Run the required release gates up to dry-run pack and dry-run publish only.
5. Close the goal only after scoped tests and closeout checkpoint are complete.

# Required Checks

- npm run build
- npm run test
- npm run cli:check
- npm run cli:contract
- node dist/cli.js validate --json
- npm run smoke:id-repair
- npm run prepublishOnly
- node scripts/assert-publish-ready.js
- NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json
- NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run
- git diff --check

# Acceptance Criteria

- Clean duplicate-ID trees can be planned and repaired.
- Unresolved Git index conflict stages can be inspected and repaired in the same command surface.
- Main branch IDs are prioritized and incoming IDs are rewritten deterministically.
- All links, blockers, parents, epic refs, scope refs, and aliases remain functional after repair.
- Repair receipts are deterministic and auditable.
- Two-branch temp-repo smokes prove the merge scenario.

# Checkpoint Requirement

`task-385` must close with a checkpoint named `0.3.4 branch-safe ID repair readiness`.

# Current State

Achieved. The 0.3.4 release candidate is dry-run publish ready for branch-safe ID repair. No real npm publish, git tag, git push, website deploy, global install, or child-repo mutation was performed.

# Release Boundary

No real npm publish, git tag, git push, website deploy, or child-repo mutation is included unless separately requested.

# Iteration Log

- 2026-06-16: Created during versioned future-goal alignment pass.

# Completion Evidence

- Scoped work completed:
  - `spike-6` closed branch merge ID repair research.
  - `task-380` and `task-381` closed the fix apply, receipt, base-ref priority, and rewrite-map designs.
  - `task-382` implemented `mdkg fix apply --family ids`.
  - `task-383` implemented `mdkg fix ids --base-ref <ref> --apply --json` and Git conflict-stage ID repair.
  - `task-384` added packed branch conflict and ID repair smokes.
  - `test-162`, `test-163`, and `test-164` closed clean duplicate-tree repair, unresolved Git conflict-stage repair, and link preservation contracts.
  - `task-385` closed with checkpoint `chk-152`.
- Acceptance criteria evidence:
  - Clean duplicate-ID trees are planned and repaired by the new `ids` repair family.
  - Unresolved Git index add/add conflict stages are inspected through the same command surface and repaired by preserving the base side while rewriting the incoming side to the next canonical numeric ID.
  - Main branch IDs are prioritized with `--base-ref`, and incoming duplicate IDs are rewritten deterministically.
  - Parent, epic, blocker, scope, refs, aliases, and body links are rewritten when they are safely owned by the incoming side; base-owned links remain pointed at the base record.
  - Repair receipts include deterministic plan hashes, touched paths, rewrite maps, ambiguous references, and family/status metadata.
  - Packed temp-repo smokes cover clean duplicate repair and Git conflict-stage repair.
- Required check evidence:
  - `npm run build` passed.
  - `npm run test` passed with 478 tests.
  - `npm run cli:check` passed.
  - `npm run cli:contract` passed.
  - `node dist/cli.js validate --json` passed with zero warnings and zero errors.
  - `npm run smoke:id-repair` passed from a packed `mdkg-0.3.4.tgz` install.
  - `npm run prepublishOnly` passed.
  - `node scripts/assert-publish-ready.js` passed.
  - `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json` passed and reported `mdkg@0.3.4`, tarball `mdkg-0.3.4.tgz`, shasum `f5cac8ef823ad1684ccef82d3ff69988c6bdbc74`.
  - `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run` passed and reported `+ mdkg@0.3.4`.
  - `git diff --check` passed.
