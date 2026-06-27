---
id: goal-39
type: goal
title: Polish 0.3.8 changelog and publish-readiness blockers
status: todo
priority: 1
goal_state: paused
goal_condition: mdkg 0.3.8 release metadata and publish-readiness gates are clean after changelog placement, public version references, manifest docs command checking, and full isolated-cache package dry-runs are fixed and proven.
scope_refs: [task-588, task-586, task-587, test-299, test-298]
required_skills: [pursue-mdkg-goal, select-work-and-ground-context, verify-close-and-checkpoint]
required_checks: [npm run build, npm run test, npm run cli:check, npm run cli:contract, npm run docs:check, npm run docs:check-commands, npm run smoke:mdkg-dev-docs, node scripts/assert-publish-ready.js, NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json, NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run --registry=https://registry.npmjs.org/, node dist/cli.js validate --json, node dist/cli.js validate --changed-only --json, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [release, polish, changelog, publish-readiness, 0-3-8]
owners: []
links: []
artifacts: [CHANGELOG.md, README.md, CLI_COMMAND_MATRIX.md, scripts/check-doc-command-examples.js, scripts/assert-publish-ready.js]
relates: []
blocked_by: []
blocks: []
refs: [goal-38, task-585, test-297]
context_refs: [goal-38, task-585, test-297]
evidence_refs: []
aliases: []
skills: [pursue-mdkg-goal, select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-06-26
updated: 2026-06-26
---
# Objective

Fix the release-readiness blockers found by `goal-38` without changing the
intended `mdkg@0.3.8` version line.

This goal is paused for the next implementation pass. It is not part of the
read-only audit closeout.

# End Condition

This goal is achieved when:

- MANIFEST/SPEC release notes for the current outgoing implementation are in
  the `0.3.8` changelog section, not only under `## Unreleased`.
- Public source-version references in `README.md` and `CLI_COMMAND_MATRIX.md`
  match `package.json` `0.3.8`.
- The docs command-example checker recognizes the real `mdkg manifest ...`
  command family.
- Publish-readiness assertions catch future version-reference drift.
- Full local and isolated-cache npm dry-run gates pass.

# Non-Goals

- Do not bump beyond `0.3.8`.
- Do not remove the intentional one-release `SPEC.md` compatibility bridge.
- Do not publish, tag, push, deploy, or mutate downstream repos.
- Do not broaden the changelog beyond the current `origin/main..HEAD` publish
  candidate.

# Recursive Algorithm

1. Resume and activate `goal-39`.
2. Start with `task-588`, then `task-586`, then `task-587`.
3. Run `test-299` for focused release-metadata/docs-command proof.
4. Run `test-298` for the full publish dry-run recheck.
5. Record evidence and close the goal only when all required checks pass.

# Required Skills

- `pursue-mdkg-goal`
- `select-work-and-ground-context`
- `verify-close-and-checkpoint`

# Required Checks

- Focused docs command example check.
- Version-reference parity checks.
- Full publish dry-run with isolated npm cache.
- mdkg validation and whitespace gates.

# Acceptance Criteria

- `npm run docs:check-commands` no longer reports unknown `manifest list` or
  `manifest show` examples.
- `README.md` and `CLI_COMMAND_MATRIX.md` expose `0.3.8` where they name the
  current source package version.
- `scripts/assert-publish-ready.js` fails if those source version references
  drift from `package.json`.
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run
  --registry=https://registry.npmjs.org/` exits 0.

# Definition Of Done

- Goal condition is achieved.
- Required checks have evidence.
- Completion evidence is recorded in the goal.
- One local commit contains the source/docs/package-readiness polish and mdkg
  evidence.

# Stop Conditions

- Goal is blocked beyond the configured attempt limit.
- Required context or permissions are missing.
- Budget or safety constraints prevent continued work.

# Current State

- Created from audit `goal-38`.
- Audit blockers:
  - MANIFEST/SPEC release notes are only under `## Unreleased`, but the
    implementation commits are in `origin/main..HEAD` for the `0.3.8` target.
  - `README.md` line 17 and `CLI_COMMAND_MATRIX.md` line 4 still say `0.3.7`.
  - `npm run docs:check-commands` fails on `README.md` examples for
    `mdkg manifest list --json` and `mdkg manifest show ... --json`.
  - `npm publish --dry-run` fails through `smoke:mdkg-dev-docs` because of the
    same docs command checker failure.

# Iteration Log

- No iterations recorded yet.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- Pending.
