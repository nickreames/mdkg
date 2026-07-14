---
id: goal-70
type: goal
title: Fix archive compression ownership for mdkg v0.5.1
status: done
priority: 0
goal_state: achieved
goal_condition: Archive compression mutates only archives owned by enabled local workspaces, imported archive projections remain discoverable and fail closed for direct mutation, all selected archives pass ownership and path preflight before any write, disposable regressions and the complete prepublish ladder pass, and one local implementation commit records v0.5.1 readiness without changing the package version or performing an external mutation.
scope_refs: [epic-246, epic-247, epic-248, epic-249, bug-1, task-777, task-778, task-779, task-780, task-781, task-782, test-435, test-436, test-437, test-438, test-439, test-440, test-441, test-442, test-443]
last_active_node: task-777
required_skills: [select-work-and-ground-context, service-boundary-ownership-check, build-pack-and-execute-task, verify-close-and-checkpoint]
required_checks: [git status --short --branch, npm run build, npm run test, npm run smoke:archive-work, npm run smoke:subgraph, npm run smoke:bundle, npm run cli:check, npm run cli:contract, npm run docs:check, npm run prepublishOnly, node scripts/assert-publish-ready.js, NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json, NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run --registry=https://registry.npmjs.org/, node dist/cli.js index, node dist/cli.js validate --changed-only --json, node dist/cli.js validate --summary --json --limit 20, node dist/cli.js goal show goal-70 --json, node dist/cli.js goal next goal-70 --json, node dist/cli.js pack bug-1 --pack-profile concise --dry-run --stats, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [archive, compression, subgraph, ownership, v0.5.1]
owners: []
links: []
artifacts: []
relates: [goal-71, edd-76, dec-82, dec-29, edd-11, dec-80, goal-69]
blocked_by: []
blocks: [goal-71]
refs: [edd-76, dec-82, dec-29, edd-11, dec-80, goal-69]
context_refs: [edd-76, dec-82, dec-29, edd-11, dec-80, goal-69]
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context, service-boundary-ownership-check, build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-14
updated: 2026-07-14
---
# Objective

Fix generic archive compression ownership so `mdkg archive compress --all`
works safely in graphs that combine writable local workspaces with read-only
imported subgraphs.

# End Condition

The implementation, command contracts, docs, and disposable regressions satisfy
`edd-76` and `dec-82`; all prepublish gates pass; a checkpoint records the old
failure and final mutation boundary; and one logical local commit is ready for
the separate v0.5.1 release goal.

# Non-Goals

- Do not reproduce against or mutate `/Users/nick/omni-chat-rooms`.
- Do not bump package versions, finalize the release changelog, push, publish,
  tag, globally install, deploy, or activate public release content.
- Do not add Omni-specific names or alter imported subgraph visibility.
- Do not weaken archive containment, symlink, locking, or per-file atomicity.

# Recursive Algorithm

1. Lock the current failure and no-touch invariants in a disposable fixture.
2. Resolve writable ownership and direct targets before deriving any path.
3. Preflight the full selected set before beginning the first archive write.
4. Add transparent receipts, help, contracts, docs, and regressions.
5. Run focused checks after each lane and the full packaged prepublish ladder.
6. Record checkpoint evidence, create one local commit, and evaluate the goal.

# Required Skills

- `select-work-and-ground-context`
- `service-boundary-ownership-check`
- `build-pack-and-execute-task`
- `verify-close-and-checkpoint`

# Required Checks

- Run every command in `required_checks` and record exact pass/fail evidence.
- Hash disposable imported bundles and child trees before and after tests.
- Prove no filesystem helper receives a ZIP-fragment projection path.

# Acceptance Criteria

- Enabled `config.workspaces` are the only writable archive owners.
- `--all` and `--all --ws <local>` select deterministic local archive sets.
- Imported aliases and qids fail with stable actionable read-only errors before
  path resolution or writes.
- Full-set ownership, containment, symlink, raw-input, and destination preflight
  completes before mutation.
- Existing JSON fields remain compatible and additive selection evidence is
  deterministic.
- List, show, search, and capability discovery continue exposing imports.

# Definition Of Done

- `bug-1`, tasks `task-777` through `task-782`, and tests `test-435` through
  `test-443` are done.
- All required checks pass with package version still `0.5.0`.
- A checkpoint names the implementation commit, compatibility impact, residual
  risk, and Goal 71 handoff.

# Stop Conditions

- Stop before any real root-graph or external mutation.
- Stop and create a spike/proposal if compatibility requires changing archive
  identity, source-of-truth ownership, or cross-archive transaction semantics.
- Do not call the goal blocked while another scoped test or implementation lane
  can make useful progress.

# Current State

Implementation and all required release-readiness checks are complete at
package version 0.5.0. Checkpoint `chk-518` records the verified ownership and
preflight contract. Goal 71 owns all release mutations.

# Iteration Log

- 2026-07-14: Successor goal created after confirming no open archive/subgraph
  ownership lane exists and the graph has no selected goal.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- `chk-518`: implementation, compatibility, regression, package, and npm
  dry-run evidence.
- 641 repository tests and 13 public-release tests passed.
- Complete `prepublishOnly`, package dry-run, and publish dry-run passed without
  changing version or performing external mutation.
