---
id: chk-282
type: checkpoint
title: 0.3.8 published and installed package validated
checkpoint_kind: goal-closeout
status: backlog
priority: 9
tags: [release, publish, post-publish, npm, 0-3-8]
owners: []
links: []
artifacts: [package.json, package-lock.json, CHANGELOG.md, dist/command-contract.json, .mdkg/handoffs/runtime-manifest-0-3-8-upgrade-megaprompt.md]
relates: [task-589, task-591, test-300]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [goal-40, task-589, task-591, test-300]
created: 2026-06-26
updated: 2026-06-26
---
# Summary

`mdkg@0.3.8` was pushed, published to npm, verified as the `latest` dist-tag,
and validated from a fresh isolated global install under `/private/tmp`.

The published package reports version `0.3.8`, initializes a fresh agent
workspace, creates canonical `MANIFEST.md` capability records, exposes manifest
and capability discovery, migrates a legacy `SPEC.md` fixture to
`MANIFEST.md`, and leaves the tmp workspace validation/status clean.

# Scope Covered

Keep `scope` frontmatter updated when possible.

## Changed Surfaces

- Public git: `main` was pushed to `origin` at
  `13b8fb2a49dc5fe667893ae2ea49ffa37a4de2cc`.
- Public npm: `mdkg@0.3.8` was published to the npm registry with dist-tag
  `latest`.
- Local temp validation: `/private/tmp/mdkg-0.3.8-global` and
  `/private/tmp/mdkg-0.3.8-postpublish/workspace`.
- mdkg graph closeout evidence for `goal-40`, `task-589`, `task-591`, and
  `test-300`.

## Boundaries

- in scope: approved `git push origin main`, real npm publish, npm registry
  verification, isolated global install validation, and mdkg closeout evidence.
- out of scope: git tag creation, deploys, downstream runtime repo mutation,
  and publishing any package other than `mdkg@0.3.8`.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded:
  yes. npm auth was verified via a temporary userconfig containing the literal
  `${NPM_TOKEN}` placeholder; no token value was recorded.

# Decisions Captured

- The approved public-release boundary was used for `git push origin main` and
  `npm publish`.
- No tag was created because the goal required npm publish and post-publish
  validation, not tag creation.

# Implementation Summary

The publish ran from the pushed release commit. The final dry-run and real
publish both executed the full `prepublishOnly` chain. Post-publish validation
then installed `mdkg@latest` from npm into an isolated prefix and used the
installed binary by absolute path so the local checkout could not satisfy the
test accidentally.

# Goal Closeout

- Goal condition result: achieved.
- Scoped nodes closed: `task-589`, `task-591`, and `test-300` in this phase;
  prerequisite `task-590`, `task-592`, and `test-301` were already done.
- Remaining deferred work: downstream runtime repo migration should consume
  `.mdkg/handoffs/runtime-manifest-0-3-8-upgrade-megaprompt.md`, but it is not
  part of this mdkg package publish goal.

# Verification / Testing

## Command Evidence

- `git push origin main`: passed; remote advanced to
  `13b8fb2a49dc5fe667893ae2ea49ffa37a4de2cc`.
- `git rev-list --left-right --count origin/main...HEAD`: `0 0` before
  publish.
- `npm whoami --registry=https://registry.npmjs.org/ --userconfig=/private/tmp/mdkg-npm-publish.npmrc`:
  passed as `nickreames`.
- `npm view mdkg version --registry=https://registry.npmjs.org/`: returned
  `0.3.7` before publish and `0.3.8` after publish.
- `npm view mdkg@0.3.8 version --registry=https://registry.npmjs.org/`:
  returned expected E404 before publish.
- Final `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run
  --registry=https://registry.npmjs.org/
  --userconfig=/private/tmp/mdkg-npm-publish.npmrc`: passed and ended with
  dry-run `+ mdkg@0.3.8`.
- Real `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish
  --registry=https://registry.npmjs.org/
  --userconfig=/private/tmp/mdkg-npm-publish.npmrc`: passed and ended with
  `+ mdkg@0.3.8`.
- Published tarball metadata:
  `https://registry.npmjs.org/mdkg/-/mdkg-0.3.8.tgz`, shasum
  `0ace673026344fffea616ca793144d9a07f81382`, integrity
  `sha512-A1g5+OXHtaQSVmF3m0xU+89dRy+u8FAwG7pzSUvzBiG5yekGzeNuUwHb3SIS1aPoJrUKoJSkEJXiekrMGwOMyQ==`.
- `npm view mdkg dist-tags --json --registry=https://registry.npmjs.org/`:
  returned `{ "latest": "0.3.8" }`.
- `NPM_CONFIG_PREFIX=/private/tmp/mdkg-0.3.8-global npm install -g
  mdkg@latest --registry=https://registry.npmjs.org/`: passed.
- `/private/tmp/mdkg-0.3.8-global/bin/mdkg --version`: returned `0.3.8`.
- Installed binary `mdkg init --agent --json` in
  `/private/tmp/mdkg-0.3.8-postpublish/workspace`: passed.
- Installed binary `mdkg new manifest "Post publish sample capability" --id
  agent.post-publish-sample --json`: created
  `.mdkg/work/agent.post-publish-sample-post-publish-sample-capability/MANIFEST.md`.
- Manifest assertions: `MANIFEST.md` exists, generated `SPEC.md` does not, and
  frontmatter contains `type: manifest`.
- Installed binary `mdkg manifest list/show/validate --json`: passed for
  `agent.post-publish-sample`.
- Installed binary `mdkg capability search "post publish sample" --json`:
  found the MANIFEST-backed capability.
- Legacy fixture upgrade dry-run: `safe_to_apply: true`, `migrated: 1`, source
  `SPEC.md`, target `MANIFEST.md`.
- Legacy fixture upgrade apply: `migrated: 1`; `SPEC.md` removed, `MANIFEST.md`
  exists, and frontmatter contains `type: manifest`.
- Installed binary `mdkg index`, `mdkg validate --json`, and
  `mdkg status --json`: passed; tmp workspace status `ok`, validation
  `ok: true`, 0 warnings, 0 errors.

## Pass / Fail Status

- status: pass.

## Known Warnings

- Full repo validation during publish intentionally reported
  `root:spec.mdkg-cli` legacy `manifest.compat.spec_legacy`; this is the
  accepted compatibility-release warning.

# Known Issues / Follow-ups

- No publish or installed-package validation blockers remain for `goal-40`.
- The downstream runtime migration is a separate follow-up lane and should
  start from the checked-in runtime handoff megaprompt.

## Follow-up Refs

- `goal-40`
- `task-589`
- `task-591`
- `test-300`
- `task-590`

# Links / Artifacts

- npm package: `mdkg@0.3.8`
- npm tarball: `https://registry.npmjs.org/mdkg/-/mdkg-0.3.8.tgz`
- publish commit: `13b8fb2a49dc5fe667893ae2ea49ffa37a4de2cc`
- tmp install prefix: `/private/tmp/mdkg-0.3.8-global`
- tmp validation workspace: `/private/tmp/mdkg-0.3.8-postpublish/workspace`

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw secrets, raw prompts, raw payloads, or bulky execution traces.
