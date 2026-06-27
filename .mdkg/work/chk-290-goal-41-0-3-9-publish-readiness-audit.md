---
id: chk-290
type: checkpoint
title: goal-41 0.3.9 publish-readiness audit
checkpoint_kind: audit
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-600]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-600]
created: 2026-06-27
updated: 2026-06-27
---
# Summary

`goal-41` reached publish-readiness for `mdkg@0.3.9`. The release is ready
for an explicit npm publish approval decision, but no real publish, tag, push,
deploy, or downstream repo mutation happened in this pass.

Final recommendation: publish ready pending explicit approval.

# Scope Covered

`task-600` and the full `goal-41` implementation/test set:

- config overlays and upgradable-kernel preservation
- arbitrary configured skill mirror targets with defaults preserved
- `COLLABORATION.md` canonical core doc plus one-release `HUMAN.md` alias
- first-party skill refresh and mirrored skill sync
- docs/release-notes automation
- changelog/version/package readiness audit
- npm pack and publish dry-runs

## Changed Surfaces

- Source/package/docs: `src/core/config.ts`, init/upgrade/skill mirror
  commands, package metadata, `CHANGELOG.md`, `README.md`,
  `CLI_COMMAND_MATRIX.md`, docs generated artifacts, and release-note data
  generation.
- mdkg graph: `goal-41`, `task-594` through `task-600`, `test-302` through
  `test-306`, checkpoints `chk-284` through `chk-291`, and regenerated index
  state.
- Skills: canonical `.mdkg/skills/*`, mirrored `.agents/skills/*` and
  `.claude/skills/*`, plus seeded init skills.
- Examples: tracked example mdkg index caches were refreshed by smoke tests.

## Boundaries

- in scope: local source/docs/package/graph changes and release-readiness
  evidence.
- out of scope: real npm publish, git tag, push, deploy, and downstream repo
  mutation.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded:
  yes. Evidence is summarized by command, status, hashes, package counts, and
  registry state only.

# Decisions Captured

- `dec-51`: config overlays are the official enterprise customization path.
- `dec-52`: arbitrary skill mirror paths are supported while defaults remain.
- `dec-53`: `COLLABORATION.md` replaces `HUMAN.md` with a one-release alias.
- `edd-56`: upgrade behavior preserves overlays/custom docs while updating
  mdkg-managed kernel assets.
- `edd-57`: docs and release-notes automation keeps CLI docs, skills, and
  changelog-derived outputs aligned.

# Implementation Summary

`0.3.9` adds a config-overlay customization foundation in `.mdkg/config.json`,
including organization standards refs, custom core docs, and configurable
`customization.skill_mirrors.targets`. `mdkg upgrade --apply` preserves local
customization overlays and custom core docs while still applying safe
mdkg-managed kernel updates. Skill mirror commands now honor configured target
paths while preserving `.agents/skills` and `.claude/skills` defaults.

`COLLABORATION.md` is now the canonical collaboration/operator profile core doc;
`HUMAN.md` remains as a one-release compatibility alias. First-party skills and
init assets were refreshed to cover current CLI behavior, MANIFEST naming,
upgrade boundaries, validation, docs, archive, bundle, subgraph, work, db, and
release gates.

Release automation now generates/checks `docs/_generated/release-notes.json`
from `CHANGELOG.md`, and `docs:check`/`prepublishOnly` enforce generated docs,
release notes, and command example drift before publish.

# Audit Findings

- Reviewed surfaces: `origin/main..HEAD`, package metadata, changelog,
  generated docs, source-visible version strings, init assets, generated
  release-notes data, package payload, npm registry state, graph validation, and
  git status.
- Findings: all publish-bound `0.3.9` changes are represented in the
  `CHANGELOG.md` `0.3.9 - 2026-06-27` section; public package-version
  references align with `0.3.9`; generated docs and release-notes data are
  current; npm latest remained `0.3.8`; `mdkg@0.3.9` was not published.
- Residual risk: the legacy `.mdkg/work/mdkg-cli/SPEC.md` warning remains
  intentionally accepted for the one-release MANIFEST/SPEC compatibility bridge.

# Verification / Testing

## Command Evidence

- `npm run test`: passed, 528 tests.
- `npm run cli:check`: passed.
- `npm run cli:contract`: passed with command contract hash
  `3c13c572c740f1e40db33fa5867fa227a8347df0750ef3beb0696d5931761a6c`.
- `npm run docs:check`: passed; command examples scanned 50 files and checked
  392 examples with 0 failures.
- `node scripts/assert-publish-ready.js`: passed.
- `npm run smoke:init`: passed for version `0.3.9`.
- `npm run smoke:upgrade`: passed for version `0.3.9`.
- Custom temp-repo overlay/mirror smoke: passed after `mdkg index`; preserved
  customization overlay and synced three mirror targets.
- `node dist/cli.js validate --json`: `ok: true`, with one accepted legacy
  `SPEC.md` compatibility warning.
- `node dist/cli.js validate --changed-only --json`: `ok: true`, 0 warnings,
  0 errors.
- `git diff --check`: passed.
- `npm view mdkg version --registry=https://registry.npmjs.org/`: `0.3.8`.
- `npm view mdkg@0.3.9 version --registry=https://registry.npmjs.org/`: npm
  `E404`, confirming `0.3.9` was not already published.
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`:
  passed for `mdkg-0.3.9.tgz`.
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run --registry=https://registry.npmjs.org/`:
  passed with status 0.

## Pass / Fail Status

- status: pass. `mdkg@0.3.9` is publish ready pending explicit approval.

## Known Warnings

- `root:spec.mdkg-cli` emits `manifest.compat.spec_legacy` because
  `.mdkg/work/mdkg-cli/SPEC.md` is still a legacy SPEC file. This is expected
  under the one-release compatibility bridge and is not a `0.3.9` blocker.

# Known Issues / Follow-ups

- Real npm publish still requires explicit user approval.
- Post-publish validation must check npm registry dist-tags and a temp-dir
  global install of latest before closing the publish lane.
- The legacy `SPEC.md` and `HUMAN.md` aliases should be faded out in a later
  compatibility-removal release after the one-release bridge.

## Follow-up Refs

- `goal-42` owns `0.4.0` public docs/site launch polish.
- Future publish/post-publish validation goal should own real npm publish,
  registry verification, and temp global install proof.

# Links / Artifacts

- `goal-41`
- `task-600`
- `test-306`
- `chk-291`
- local commit `84f920d feat: prepare mdkg 0.3.9 extensibility release`
- package dry-run shasum `dfbb65267a87f963e05a90705e44f7ae029e9ffd`

# Raw Content Safety

Evidence is summarized by command result, hashes, paths, and graph refs. No raw
secrets, raw prompts, provider payloads, npm tokens, or bulky execution traces
are stored here.
