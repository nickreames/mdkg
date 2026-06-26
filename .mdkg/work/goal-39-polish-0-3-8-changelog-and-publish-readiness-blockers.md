---
id: goal-39
type: goal
title: Polish 0.3.8 changelog and publish-readiness blockers
status: done
priority: 1
goal_state: achieved
goal_condition: mdkg 0.3.8 release metadata and publish-readiness gates are clean after changelog placement, public version references, manifest docs command checking, and full isolated-cache package dry-runs are fixed and proven.
scope_refs: [task-588, task-586, task-587, test-299, test-298]
last_active_node: test-298
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
evidence_refs: [chk-280]
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

- Implementation complete.
- MANIFEST/SPEC release notes now live in the `0.3.8` changelog section.
- Public source-version references in `README.md` and `CLI_COMMAND_MATRIX.md`
  now match `package.json` `0.3.8`.
- Docs command checking recognizes the `mdkg manifest ...` command family.
- Publish-readiness assertions now fail on README or command-matrix version
  drift and require manifest command coverage in the generated contract.
- Example templates include `manifest.md`, so demo graph validation no longer
  emits missing local-type fallback warnings.
- Full isolated-cache npm publish dry-run completed successfully without a
  real publish, tag, push, deploy, or downstream repo mutation.

# Iteration Log

- task-588 folded the MANIFEST/SPEC compatibility note into the `0.3.8`
  changelog section.
- task-586 updated public `0.3.8` version references and added
  publish-readiness drift assertions.
- task-587 taught docs command checks and smoke coverage about the manifest
  command family.
- test-299 proved focused changelog, version, manifest command, and docs
  contract readiness.
- test-298 proved the full publish dry-run path after adding manifest templates
  to both example mdkg graphs.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- `chk-280` records closeout evidence for `goal-39`.
- `npm run build` passed with command contract hash
  `145781176fcd00d6b7c7edd8e013e902acea2ace8764dbf0bb063a8d3913a3e1`.
- `npm run test` passed with 518 passing tests and 0 failures.
- `npm run cli:check`, `npm run cli:contract`, `npm run docs:check`,
  `npm run docs:check-commands`, `npm run smoke:command-docs`, and
  `npm run smoke:mdkg-dev-docs` passed.
- `node scripts/assert-publish-ready.js` passed, and a mocked README drift
  check failed as expected.
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`
  passed for `mdkg-0.3.8.tgz` with 174 entries.
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run
  --registry=https://registry.npmjs.org/` passed and ended with dry-run output
  for `+ mdkg@0.3.8`.
- Final registry recheck: `npm view mdkg version
  --registry=https://registry.npmjs.org/` returned `0.3.7`, and
  `npm view mdkg@0.3.8 version --registry=https://registry.npmjs.org/`
  returned the expected E404.
- `node dist/cli.js validate --json` passed with only the accepted legacy
  `SPEC.md` compatibility warning.
- `node dist/cli.js validate --changed-only --json` and `git diff --check`
  passed.
