---
id: goal-40
type: goal
title: Publish mdkg 0.3.8 and validate installed package
status: todo
priority: 1
goal_state: paused
goal_condition: mdkg 0.3.8 is published only after the SPEC.md to MANIFEST.md upgrade migration is implemented and proven, explicit publish approval is given, npm latest becomes 0.3.8, and an isolated tmp global install validates init, manifest capabilities, upgrade rename behavior, and graph health from the published package.
scope_refs: [task-590, task-592, test-301, task-589, task-591, test-300]
active_node: task-592
required_skills: [pursue-mdkg-goal, verify-close-and-checkpoint]
required_checks: [git status --short --branch, git fetch origin main, git rev-list --left-right --count origin/main...HEAD, npm view mdkg version --registry=https://registry.npmjs.org/, npm view mdkg@0.3.8 version --registry=https://registry.npmjs.org/, npm run build, npm run test, npm run cli:check, npm run cli:contract, npm run docs:check, node scripts/assert-publish-ready.js, NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json, NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run --registry=https://registry.npmjs.org/, after explicit approval npm publish --registry=https://registry.npmjs.org/, npm view mdkg version --registry=https://registry.npmjs.org/, NPM_CONFIG_PREFIX=/private/tmp/mdkg-0.3.8-global npm install -g mdkg@latest --registry=https://registry.npmjs.org/, /private/tmp/mdkg-0.3.8-global/bin/mdkg --version, /private/tmp/mdkg-0.3.8-global/bin/mdkg validate --json, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [release, publish, post-publish, 0-3-8]
owners: []
links: []
artifacts: [.mdkg/handoffs/runtime-manifest-0-3-8-upgrade-megaprompt.md]
relates: []
blocked_by: []
blocks: []
refs: [goal-37, goal-39, chk-280]
context_refs: [dec-50, edd-54, goal-37, goal-39, chk-280]
evidence_refs: []
aliases: [publish-0-3-8, post-publish-0-3-8, npm-0-3-8-validation, manifest-upgrade-publish-gate]
skills: [pursue-mdkg-goal, verify-close-and-checkpoint]
created: 2026-06-26
updated: 2026-06-26
---
# Objective

Publish `mdkg@0.3.8` only after the newly identified `mdkg upgrade`
`SPEC.md` to `MANIFEST.md` migration blocker is fixed and proven, then validate
the published package from an isolated temporary global npm install.

# End Condition

This goal is achieved when:

- `mdkg upgrade --dry-run --json` and `mdkg upgrade --apply --json` plan and
  apply safe legacy `SPEC.md` to `MANIFEST.md` migrations, including
  frontmatter `type: spec` to `type: manifest`, without overwriting sibling
  `MANIFEST.md` files.
- The full pre-publish gate still passes for `0.3.8`.
- A human explicitly authorizes the public side effects before `npm publish`,
  `git push`, or tag commands run.
- `mdkg@0.3.8` is published to npm and `npm view mdkg version
  --registry=https://registry.npmjs.org/` returns `0.3.8`.
- A fresh isolated tmp global install of `mdkg@latest` reports version
  `0.3.8` and validates init, manifest command/capability discovery, upgrade
  rename behavior, and graph health in a temporary repo.
- A closeout checkpoint records registry state, publish output summary, tmp
  install path, installed binary path, command evidence, accepted warnings, and
  no raw secrets or bulky logs.

# Non-Goals

- Do not publish, push, tag, deploy, or mutate downstream repos without an
  explicit approval in the execution turn.
- Do not bump beyond `0.3.8`.
- Do not remove the one-release legacy `SPEC.md` compatibility bridge.
- Do not make downstream runtime code changes in this repo.
- Do not store raw credentials, npm auth tokens, raw prompts, raw payloads, or
  bulky publish logs in mdkg graph files.

# Recursive Algorithm

1. Resume and activate this goal only when ready to do the publish-prep pass.
2. Start with `task-592` and `test-301`; do not proceed to publication until
   upgrade rename behavior is implemented and proven.
3. Re-run the full pre-publish release gate from `task-589`.
4. Confirm remote-origin requirements: `origin/main` must contain the exact
   publish commit before npm publish, or the same explicit approval must
   authorize pushing `main` first.
5. After explicit approval, run the real npm publish and record a bounded
   receipt summary.
6. Run `task-591` and `test-300` from a local tmp directory with a local npm
   global prefix, installing `mdkg@latest` from the registry rather than using
   the checkout.
7. Close with a goal checkpoint and leave the worktree clean.

# Required Skills

- `pursue-mdkg-goal`
- `verify-close-and-checkpoint`

# Required Checks

- `git status --short --branch`
- `git fetch origin main`
- `git rev-list --left-right --count origin/main...HEAD`
- `npm view mdkg version --registry=https://registry.npmjs.org/`
- `npm view mdkg@0.3.8 version --registry=https://registry.npmjs.org/`
- `npm run build`
- `npm run test`
- `npm run cli:check`
- `npm run cli:contract`
- `npm run docs:check`
- `node scripts/assert-publish-ready.js`
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run
  --registry=https://registry.npmjs.org/`
- after explicit approval: `npm publish --registry=https://registry.npmjs.org/`
- post-publish: `npm view mdkg version --registry=https://registry.npmjs.org/`
- post-publish isolated install:
  `NPM_CONFIG_PREFIX=/private/tmp/mdkg-0.3.8-global npm install -g mdkg@latest
  --registry=https://registry.npmjs.org/`
- `/private/tmp/mdkg-0.3.8-global/bin/mdkg --version`
- tmp repo init, manifest, capability, upgrade, validate, and status checks
  from the installed binary
- `node dist/cli.js validate --json`
- `node dist/cli.js validate --changed-only --json`
- `git diff --check`

# Acceptance Criteria

- The upgrade migrator handles legacy `SPEC.md` files safely before publish.
- The runtime handoff prompt exists and describes how a downstream coding agent
  should ingest canonical `MANIFEST.md` and capability surfaces after the
  published mdkg upgrade.
- Public side effects are explicitly gated.
- Published package validation uses a registry-installed binary from
  `/private/tmp`, not the local checkout.

# Definition Of Done

- Goal condition is achieved.
- Required checks have evidence.
- Completion evidence is recorded in the goal.
- The post-publish tmp directory and installed binary path are recorded.
- No raw npm tokens, credentials, or bulky logs are stored in mdkg.

# Stop Conditions

- Goal is blocked beyond the configured attempt limit.
- Required context or permissions are missing.
- Budget or safety constraints prevent continued work.
- `mdkg upgrade` cannot safely migrate legacy `SPEC.md` without risking data
  loss or overwriting sibling `MANIFEST.md`.
- npm registry state changes unexpectedly, such as `0.3.8` already being
  published by another actor.

# Current State

- Local readiness commit `3175fd1` made the previous publish dry-run path pass.
- As of the recheck, npm latest is `0.3.7` and `mdkg@0.3.8` returns E404.
- A temp probe at `/private/tmp/mdkg-upgrade-spec-probe` showed that current
  `mdkg upgrade --apply` leaves legacy `SPEC.md` in place, creates no
  `MANIFEST.md`, and reports `migrated: 0`. This is a pre-publish blocker for
  the newly requested upgrade-rename requirement.
- This goal is paused and unselected until a future execution turn explicitly
  starts the publish lane.

# Iteration Log

- Created publish/post-publish lane after `goal-39` readiness closeout.
- Added explicit upgrade migration blocker based on local temp probe evidence.
- Created runtime handoff megaprompt artifact for downstream MANIFEST adoption.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- Pending.
