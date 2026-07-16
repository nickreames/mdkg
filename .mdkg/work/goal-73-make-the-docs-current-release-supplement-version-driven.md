---
id: goal-73
type: goal
title: Make the docs current-release supplement version-driven
status: progress
priority: 1
goal_state: active
goal_condition: The docs current-release supplement is complete when release/public-release.json and generated changelog data select every visible version fact without component or test version literals, published and draft-preview states fail closed on inconsistent data, Install Changelog and Generated CLI Reference pass automated and local Chrome checks, the pre-approved implementation and closeout commits reach origin/main without force, exact-SHA Vercel production deployments are READY, and canonical production Chrome validation passes with durable evidence.
scope_refs: [task-792, task-793, test-455, task-794, test-456, task-795, task-796, test-457, task-797]
active_node: task-795
required_skills: [select-work-and-ground-context, build-pack-and-execute-task, verify-close-and-checkpoint]
required_checks: [git status --short --branch, git fetch origin main, git rev-list --left-right --count origin/main...HEAD, npm run test:public-release, npm run docs:release-notes, npm run docs:release-notes:check, npm run docs:check, npm --prefix docs run build, npm run smoke:mdkg-dev-docs, npm run test, node dist/cli.js index, node dist/cli.js validate --json, node dist/cli.js validate --changed-only --json, local Chrome desktop and mobile validation for Install Changelog and Generated CLI Reference, Vercel exact-SHA READY proof for mdkg-docs and mdkg-dev, live Chrome validation for docs.mdkg.dev and basic mdkg.dev health, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [docs, release, automation, current-release, vercel, chrome, 0.5.2]
owners: []
links: []
artifacts: []
relates: [dec-84, edd-78, edd-57, edd-71, dec-74, task-738, goal-67]
blocked_by: []
blocks: []
refs: [dec-84, edd-78, edd-57, edd-71, dec-74, task-738, goal-67]
context_refs: [goal-67, task-738, edd-57, edd-71, dec-74]
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context, build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-16
updated: 2026-07-16
---
# Objective

Remove the release-specific v0.5.0 supplement implementation and replace it
with a compact, evergreen, build-time current-release projection that remains
correct for future release manifest transitions without component or test
rewrites.

# End Condition

All three docs routes render release facts selected from the shared manifest
and generated changelog data; inconsistent visible states fail the build; local
and production validation pass; and origin, Vercel, Chrome, and closeout
evidence agree on the implementation and final graph-only commits.

# Non-Goals

- Do not bump package version `0.5.2` or publish npm.
- Do not change mdkg CLI behavior, DNS, domains, analytics, or Git tags.
- Do not remove historical v0.5.0 changelog or loop documentation.
- Do not manually deploy with Vercel or force-push Git history.

# Recursive Algorithm

1. Freeze the release projection and fail-closed test contract.
2. Implement the generated supplement, update checks, and record the fix under
   `CHANGELOG.md` Unreleased.
3. Pass automated docs tests and local desktop/mobile Chrome proof.
4. Recheck origin freshness, commit, and non-force push the implementation to
   `main` under the pre-approved production-deployment boundary.
5. Match Vercel production deployments to the exact pushed SHA, inspect logs,
   and validate canonical production in Chrome.
6. Record a goal checkpoint, push the graph-only closeout, verify its automatic
   deployments and final canonical marker, then achieve the goal.

# Required Skills

- Local mdkg skills from frontmatter govern selection, execution, and closeout.
- The execution agent must invoke the `chrome:control-chrome` plugin skill;
  it remains an explicit plugin requirement rather than a local skill ref.
- Use the Vercel connector for project, deployment, SHA, and build-log proof.

# Required Checks

- Run every frontmatter check and preserve receipts under the active task.
- Store local Chrome artifacts under
  `/private/tmp/mdkg-goal73-current-release/`.

# Acceptance Criteria

- `release/public-release.json` owns target version, state, and qualifier.
- Generated release-note data owns release date, sections, item count, and
  highlights derived from `CHANGELOG.md`.
- Published, draft-preview, and hidden-draft behavior matches `edd-78`.
- Install, Changelog, and Generated CLI Reference retain the supplement with
  evergreen generated content and version-neutral identifiers.
- Both required non-force `main` pushes and their automatic Vercel production
  deployments proceed without another approval prompt after gates pass.

# Definition Of Done

- Tasks `task-792` through `task-797` and tests `test-455` through
  `test-457` are done with evidence.
- The implementation deployment and Chrome proof are recorded in a checkpoint.
- The final graph-only deployment is verified externally without creating an
  infinite evidence-only commit cycle.

# Stop Conditions

- Stop before push if origin has advanced, the tree contains unrelated changes,
  or any automated/local Chrome gate fails.
- Stop after push if either exact-SHA deployment is missing, failed, or not
  production; inspect logs and fix forward without force push.
- Stop if generated public text would expose unsupported release claims or raw
  unescaped changelog HTML.

# Current State

Planning is complete and the goal is active but unclaimed. `task-792` is the
first actionable node. The repository baseline is clean at mdkg `0.5.2`; the
current docs supplement and its smoke assertions still hardcode v0.5.0.

# Iteration Log

- 2026-07-16: Created the decision-complete graph lane after confirming the
  user selected evergreen generated supplements on all three routes and
  pre-approved non-force `main` pushes plus automatic production deployments.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- Pending.
