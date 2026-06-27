---
id: goal-43
type: goal
title: Publish mdkg 0.3.9 and validate installed package
status: done
priority: 1
goal_state: achieved
goal_condition: mdkg@0.3.9 is published to npm, origin/main contains the release commit history, the published package is validated from an isolated temp global install and temp workspace, a durable mdkg checkpoint records registry/install evidence and the no-0.4.0 boundary, and annotated tag v0.3.9 is pushed to origin pointing at the published commit.
scope_refs: [task-607, task-608, test-313, task-609]
last_active_node: task-607
required_skills: [verify-close-and-checkpoint]
required_checks: [git fetch origin main, git status --short --branch, git rev-list --left-right --count origin/main...HEAD, npm ci, npm run build, npm run test, npm run cli:check, npm run cli:contract, npm run docs:check, node scripts/assert-publish-ready.js, node dist/cli.js validate --json, node dist/cli.js validate --changed-only --json, git diff --check, npm view mdkg version --registry=https://registry.npmjs.org/, npm view mdkg@0.3.9 version --registry=https://registry.npmjs.org/, NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json, NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run --registry=https://registry.npmjs.org/, git push origin main, npm whoami --registry=https://registry.npmjs.org/ --userconfig=/private/tmp/mdkg-npm-publish.npmrc, npm publish --registry=https://registry.npmjs.org/ --userconfig=/private/tmp/mdkg-npm-publish.npmrc, post-publish npm view mdkg version, post-publish npm view mdkg dist-tags --json, isolated npm install -g mdkg@latest --prefix /private/tmp/mdkg-0.3.9-postpublish, temp workspace init status validate manifest skill sync upgrade probes, mdkg checkpoint evidence, git tag -a v0.3.9, git push origin v0.3.9]
max_iterations: 25
blocked_after_attempts: 3
tags: [release, 0.3.9, publish, post-publish]
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
skills: [verify-close-and-checkpoint]
created: 2026-06-27
updated: 2026-06-27
---
# Objective

Publish `mdkg@0.3.9`, validate the installed package from npm, and preserve a
durable release receipt without starting `goal-42` or any `0.4.0` publish work.

# End Condition

This goal is achieved when:

- `origin/main` contains the release commit history used for publish;
- npm registry `latest` is `0.3.9` and `mdkg@0.3.9` is available;
- an isolated temp global install of `mdkg@latest` reports `0.3.9`;
- a temp workspace validates published-package init, status, validate,
  manifest creation, skill sync, and upgrade behavior;
- a checkpoint records the publish commit, registry evidence, temp install path,
  command outcomes, accepted warnings, and the no-`0.4.0` boundary;
- annotated tag `v0.3.9` is pushed to origin and points to the published commit.

# Non-Goals

- Do not change package, source, docs, or website content in this lane.
- Do not start `goal-42` implementation.
- Do not publish `0.4.0`, tag `v0.4.0`, deploy mdkg.dev/docs.mdkg.dev, change
  DNS, or activate analytics.
- Do not print or commit npm auth tokens.

# Recursive Algorithm

1. Complete `task-607`: rerun local gates, registry/dry-run gates, and push
   release commits to `origin/main`.
2. Complete `task-608`: create the literal `${NPM_TOKEN}` userconfig, verify npm
   auth, re-check registry state, and publish `mdkg@0.3.9`.
3. Complete `test-313`: verify registry state, install `mdkg@latest` into an
   isolated temp prefix, and run temp workspace behavior probes.
4. Complete `task-609`: record checkpoint evidence, mark this goal achieved,
   create annotated tag `v0.3.9` on the published commit, and push the tag.

# Required Skills

- `verify-close-and-checkpoint`

# Required Checks

- All commands listed in `required_checks`.
- Website live-current requirements are intentionally deferred to `goal-42` and
  are not blockers for `mdkg@0.3.9` package publish.

# Acceptance Criteria

- `package.json` remains `0.3.9` at the published commit.
- `npm view mdkg version --registry=https://registry.npmjs.org/` reports
  `0.3.9` after publish.
- `npm view mdkg dist-tags --json --registry=https://registry.npmjs.org/`
  reports `latest: "0.3.9"`.
- Isolated installed binary reports `0.3.9`.
- Temp workspace proves `COLLABORATION.md`, legacy `HUMAN.md`,
  `MANIFEST.md`, config overlays, custom skill mirror targets, `mdkg skill
  sync`, and `mdkg upgrade --apply` from the published package.
- `goal-42` remains the canonical website/docs follow-up and includes the
  live-current mdkg.dev/docs.mdkg.dev gaps.

# Definition Of Done

- Goal condition is achieved.
- Required checks have evidence.
- Completion evidence is recorded in the goal.

# Stop Conditions

- Goal is blocked beyond the configured attempt limit.
- Required context or permissions are missing.
- Budget or safety constraints prevent continued work.

# Current State

- Created as the short publish/post-publish lane for the current `0.3.9`
  package state after full audit indicated package readiness.
- `goal-42` owns mdkg.dev/docs.mdkg.dev live-current updates and the later
  `0.4.0` launch-readiness recommendation.

# Iteration Log

- 2026-06-27: Seeded before real `mdkg@0.3.9` publish execution.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- Pending.
