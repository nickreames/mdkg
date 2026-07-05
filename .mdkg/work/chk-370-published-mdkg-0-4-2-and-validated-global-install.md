---
id: chk-370
type: checkpoint
title: published mdkg 0.4.2 and validated global install
checkpoint_kind: goal-closeout
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-660, task-658, test-341]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [goal-52, goal-54]
created: 2026-07-05
updated: 2026-07-05
---
# Summary

`mdkg@0.4.2` was pushed to `origin/main`, published to npm, installed globally
on this development machine, and validated from a clean temporary workspace.
The package release is complete. One docs follow-up remains: the live generated
CLI reference omits the new `mdkg git` command family even though the root
command matrix, README, changelog, live homepage, and live docs changelog are
current for `0.4.2`.

# Scope Covered

Keep `scope` frontmatter updated when possible.

## Changed Surfaces

- remote `origin/main` received the `0.4.2` release commits before publish
- npm registry now contains `mdkg@0.4.2`
- global dev-machine install at `/opt/homebrew/bin/mdkg` reports `0.4.2`
- temp postpublish workspace:
  `/private/tmp/mdkg-0.4.2-postpublish.a6hTOe`
- mdkg graph follow-up goal: `goal-54`

## Boundaries

- in scope: git push to `origin/main`, npm publish, global install,
  postpublish package validation, local-temp Git remote lifecycle proof, live
  docs/site read-only checks, and graph evidence updates
- out of scope: tag creation, Vercel/provider mutation, DNS changes, another
  npm publish, and source/docs fixes for the generated-reference gap
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded:
  yes

# Decisions Captured

- Follow-up docs gap is tracked separately in `goal-54`; it is not a package
  publish blocker because `mdkg@0.4.2` is already published and validated.

# Implementation Summary

No source implementation occurred in this closeout checkpoint. The release
implementation is the completed `goal-52` work for low-level `mdkg git`
remote lifecycle primitives.

# Goal Closeout

- Goal condition result: package publish and postpublish validation complete.
- Scoped nodes closed: `goal-52` had already been closed by `chk-369`; this
  checkpoint records the approved publish/postpublish execution.
- Remaining deferred work: `goal-54` owns docs generated CLI reference parity
  and live docs verification.

# Verification / Testing

## Command Evidence

- command: `git push origin main`
- result: pushed `main` to GitHub before publish
- command: `npm whoami --registry=https://registry.npmjs.org/ --userconfig=/private/tmp/mdkg-npm-publish.npmrc`
- result: authenticated as `nickreames`
- command: `npm view mdkg@latest version --registry=https://registry.npmjs.org/ --prefer-online`
- result: `0.4.2`
- command: `npm view mdkg@0.4.2 version --registry=https://registry.npmjs.org/ --prefer-online`
- result: `0.4.2`
- command: `npm view mdkg dist-tags --json --registry=https://registry.npmjs.org/`
- result: `latest` is `0.4.2`
- command: `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --registry=https://registry.npmjs.org/ --userconfig=/private/tmp/mdkg-npm-publish.npmrc`
- result: published `mdkg@0.4.2`; npm tarball contained 177 files, including
  `dist/commands/git.js`, and npm shasum
  `a42a4da6bd45573ca4ccd95432b5d23f4eaa1d25`
- command: `npm install -g mdkg@latest --registry=https://registry.npmjs.org/ --prefer-online`
- result: global install updated one package
- command: `mdkg --version`
- result: `0.4.2`
- command: `npm list -g mdkg --depth=0`
- result: `/opt/homebrew/lib` contains `mdkg@0.4.2`
- command: published `mdkg init --agent`, `mdkg validate --json`,
  `mdkg new manifest`, `mdkg skill sync --json`, `mdkg upgrade --dry-run --json`,
  and `mdkg upgrade --apply --json` in
  `/private/tmp/mdkg-0.4.2-postpublish.a6hTOe/repo`
- result: validation passed with 0 warnings/errors after indexing; upgrade
  dry-run/apply had no pending writes
- command: published `mdkg git closeout`, `mdkg git push-ready`,
  `mdkg git push --stage-all`, `mdkg git clone`, and `mdkg git fetch`
- result: closeout wrote static JSON/Markdown receipts, dirty-tree
  `push-ready` failed as expected, stage-all push passed to a local bare
  remote, clone returned accepted revision
  `e5b6fc8bb631924f1980f89ade82cded22d2e66c`, and fetch passed
- command: live read-only fetches for `https://mdkg.dev/`,
  `https://docs.mdkg.dev/project/changelog/`, and
  `https://docs.mdkg.dev/reference/generated-cli-reference/`
- result: homepage and changelog are current for `0.4.2`; generated CLI
  reference omits `mdkg git` markers

## Pass / Fail Status

- status: pass for package publish and postpublish validation
- status: follow-up required for docs generated CLI reference currentness

## Known Warnings

- warning: immediate `npm view mdkg version` returned stale `0.4.1` once after
  publish; cache-bypassed `mdkg@latest`, `mdkg@0.4.2`, dist-tags, and publish
  timestamps confirmed `0.4.2`.
- warning: temp closeout reported project DB did not participate, so no DB
  snapshot was sealed; this is expected for the fresh temp repo with DB disabled.

# Known Issues / Follow-ups

- Live generated CLI reference does not include `mdkg git`, `closeout`, or
  `push-ready`; tracked by `goal-54`.
- If the generated reference can drift from `CLI_COMMAND_MATRIX.md`, harden docs
  automation or the relevant SKILL.md closeout guidance in the follow-up lane.

## Follow-up Refs

- `goal-54`
- `task-660`
- `task-658`
- `test-341`

# Links / Artifacts

- global binary: `/opt/homebrew/bin/mdkg`
- temp postpublish workspace:
  `/private/tmp/mdkg-0.4.2-postpublish.a6hTOe`
- live homepage artifact: `/private/tmp/mdkg-live-home-postpublish.html`
- live changelog artifact:
  `/private/tmp/mdkg-live-docs-changelog-postpublish.html`
- live generated reference artifact:
  `/private/tmp/mdkg-live-docs-cli-reference-postpublish.html`
- npm publish time for `0.4.2`: `2026-07-05T22:12:06.409Z`
- published commit pushed before npm publish: `a85604a3`

# Raw Content Safety

- Evidence is summarized through commands, versions, refs, hashes, and artifact
  paths. Raw credentials, token material, provider payloads, raw prompts, queue
  bodies, and bulky execution traces are excluded.
