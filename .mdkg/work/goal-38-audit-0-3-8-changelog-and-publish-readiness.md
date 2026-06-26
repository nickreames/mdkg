---
id: goal-38
type: goal
title: Audit 0.3.8 changelog and publish readiness
status: done
priority: 1
goal_state: achieved
goal_condition: Confirm mdkg 0.3.8 is changelog-complete and publish-ready without source edits, or create a follow-up mdkg polish goal that captures every required source/docs/package change before publish.
scope_refs: [task-585, test-297]
last_active_node: task-585
required_skills: [select-work-and-ground-context, pursue-mdkg-goal, verify-close-and-checkpoint]
required_checks: [git status --short --branch, git fetch origin main, git rev-list --left-right --count origin/main...HEAD, git log --oneline origin/main..HEAD, git diff --name-status origin/main..HEAD, npm view mdkg version --registry=https://registry.npmjs.org/, npm view mdkg@0.3.8 version --registry=https://registry.npmjs.org/, npm run build, npm run test, npm run cli:check, npm run cli:contract, npm run docs:check, node scripts/assert-publish-ready.js, npm pack --dry-run --json, NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run --registry=https://registry.npmjs.org/, node dist/cli.js status --json, node dist/cli.js validate --json, node dist/cli.js validate --changed-only --json, node dist/cli.js goal current --json, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [release, audit, changelog, publish-readiness, 0-3-8]
owners: []
links: []
artifacts: [CHANGELOG.md, package.json, package-lock.json, README.md, CLI_COMMAND_MATRIX.md, scripts/assert-publish-ready.js, origin/main..HEAD]
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: [chk-279, goal-39]
aliases: []
skills: [select-work-and-ground-context, pursue-mdkg-goal, verify-close-and-checkpoint]
created: 2026-06-26
updated: 2026-06-26
---
# Objective

Audit the local `mdkg@0.3.8` release candidate represented by the current
commits ahead of `origin/main`.

The audit is read-only against publish-bound source, docs, package metadata,
and public release files. It may write mdkg graph evidence and, if readiness is
blocked, create a follow-up mdkg polish goal for subsequent execution.

# End Condition

This goal is achieved when one of these outcomes is durable:

- Ready: `0.3.8` has complete changelog coverage, package metadata/version
  references are coherent, registry state allows the target version, package
  and mdkg gates pass, and an audit checkpoint records the evidence.
- Not ready: a follow-up mdkg polish goal exists with exact required
  source/docs/package changes, and this audit records the blocker evidence.

# Non-Goals

- Do not edit `CHANGELOG.md`, source, docs, package files, generated docs, or
  publish-readiness assertions during this audit.
- Do not run a real npm publish.
- Do not tag, push, deploy, change DNS, activate analytics, or mutate
  downstream repos.
- Do not treat green package gates as sufficient if changelog/version metadata
  is stale.

# Recursive Algorithm

1. Activate this goal and claim `task-585`.
2. Re-check git, package, changelog, registry, and mdkg status before deciding
   readiness.
3. Run the required release gates without publish/tag/push side effects.
4. Mark `test-297` done only after the audit contract has evidence.
5. If readiness is blocked, create one follow-up polish goal with exact changes.
6. Record an audit checkpoint and mark this goal achieved.

# Required Skills

- `select-work-and-ground-context`
- `pursue-mdkg-goal`
- `verify-close-and-checkpoint`

# Required Checks

- Git freshness and outgoing commit inventory.
- Registry availability for `mdkg@0.3.8`.
- Changelog and visible version-reference audit.
- Build, tests, command contract, docs check, publish-readiness assertions,
  package dry-run, publish dry-run, mdkg validation, and whitespace checks.

# Acceptance Criteria

- Every publish-bound commit in `origin/main..HEAD` is represented in the
  `0.3.8` changelog section or is explicitly deferred by the generated polish
  goal.
- `package.json`, `package-lock.json`, npm registry state, and public
  version-reference surfaces agree that `0.3.8` is the intended next target.
- `npm publish --dry-run` passes with an isolated cache before any ready claim.
- Any `SPEC.md` compatibility warning is recorded as expected release behavior.
- Final committed changes are mdkg graph/index evidence only.

# Definition Of Done

- Goal condition is achieved.
- Required checks have evidence.
- Completion evidence is recorded in the goal.
- One local graph-only commit records the audit outcome.

# Stop Conditions

- Goal is blocked beyond the configured attempt limit.
- Required context or permissions are missing.
- Budget or safety constraints prevent continued work.

# Current State

- Starting state: local `main` is clean and ahead of `origin/main` by 15
  commits.
- Source package target: `package.json` and `package-lock.json` are `0.3.8`.
- Registry baseline before audit planning: npm latest was `0.3.7`.
- Known suspected blockers to verify: `CHANGELOG.md` keeps MANIFEST/SPEC notes
  under `## Unreleased`, while `README.md` and `CLI_COMMAND_MATRIX.md` still
  advertise `0.3.7`.
- Previous selected goal was achieved `goal-37`; this goal supersedes that
  selected pointer for this audit run.

# Iteration Log

- 2026-06-26: Created and activated `goal-38`, claimed `task-585`, ran the
  0.3.8 changelog/version/registry/package audit, and created follow-up
  `goal-39` because publish readiness is blocked by release-metadata and docs
  command-checker gaps.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- ACHIEVED on 2026-06-26 by producing the required follow-up polish lane.
- Outcome: not ready for publish yet.
- Durable audit receipt: `chk-279`.
- Follow-up implementation goal: `goal-39`.
- Registry state:
  - `npm view mdkg version --registry=https://registry.npmjs.org/` returned
    `0.3.7`.
  - `npm view mdkg@0.3.8 version --registry=https://registry.npmjs.org/`
    returned npm `E404`, so `0.3.8` is not already published.
- Source audit blockers:
  - MANIFEST/SPEC compatibility release notes are still under
    `## Unreleased` even though the implementation commits are in
    `origin/main..HEAD` for the `0.3.8` target.
  - `README.md` still says `Current package version in source: 0.3.7`.
  - `CLI_COMMAND_MATRIX.md` still says `package_version_in_source: 0.3.7`.
  - `node scripts/assert-publish-ready.js` passes despite those stale public
    version references.
  - `npm run docs:check-commands` fails because the command example checker
    does not recognize `mdkg manifest list --json` or
    `mdkg manifest show <id-or-qid-or-alias> --json`, although the CLI itself
    supports both command paths.
- Gate evidence:
  - `npm run build` passed.
  - `npm run test` passed 518/518.
  - `npm run cli:check` passed.
  - `npm run cli:contract` passed with contract hash
    `7731504607851c08dd0b6fe1c29f58cc47271fdc20073e9ca0a010eefa9c2a77`.
  - `npm run docs:check` passed.
  - `node scripts/assert-publish-ready.js` passed.
  - Default-cache `npm pack --dry-run --json` failed with local npm cache
    `EPERM`; isolated-cache pack passed and reported `mdkg-0.3.8.tgz` with
    174 files.
  - Isolated-cache `npm publish --dry-run --registry=https://registry.npmjs.org/`
    failed inside `smoke:mdkg-dev-docs` because `npm run docs:check-commands`
    failed on the two `mdkg manifest ...` README examples.
  - `node dist/cli.js validate --json` passed with the expected single legacy
    dogfood `SPEC.md` compatibility warning.
  - `node dist/cli.js validate --changed-only --json` passed with no warnings
    for the graph-only audit changes.
  - `git diff --check` passed.
- Boundary evidence:
  - No source, docs, package, changelog, generated docs, publish-readiness
    source, tag, push, deploy, real npm publish, or downstream repo mutation was
    performed by this audit.
