---
id: chk-292
type: checkpoint
title: mdkg 0.3.9 publish and post-publish validation
checkpoint_kind: goal-closeout
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [goal-43]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-607, task-608, test-313, task-609]
created: 2026-06-27
updated: 2026-06-27
---
# Summary

`mdkg@0.3.9` was published to npm from commit
`072cf5193adf897fff5b5041bef90d0a8c2b0a68`, validated from the public registry,
installed into an isolated temp prefix, and tagged with annotated tag `v0.3.9`.
The website/docs live-current work remains intentionally deferred to `goal-42`.

# Scope Covered

Keep `scope` frontmatter updated when possible.

## Changed Surfaces

- npm registry: `mdkg@0.3.9` is now published and `latest` points to `0.3.9`.
- Git remote: `origin/main` contains published commit
  `072cf5193adf897fff5b5041bef90d0a8c2b0a68`.
- Git tag: annotated `v0.3.9` was created on the published commit and pushed to
  `origin`.
- mdkg graph: `goal-43`, `task-607`, `task-608`, `test-313`, `task-609`, and
  this checkpoint record the publish lane.

## Boundaries

- in scope: final 0.3.9 gates, `origin/main` push, real npm publish,
  post-publish registry/temp-install validation, annotated `v0.3.9` tag.
- out of scope: 0.4.0 npm publish, 0.4.0 tag, mdkg.dev/docs.mdkg.dev
  implementation, deploy, DNS, analytics, or production promotion.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded:
  npm token was referenced only through `/private/tmp/mdkg-npm-publish.npmrc`
  with literal `${NPM_TOKEN}` and was not printed or committed.

# Decisions Captured

- `goal-42` remains the canonical mdkg.dev/docs.mdkg.dev follow-up lane.
- `goal-43` owns the completed 0.3.9 npm publish and post-publish evidence.

# Implementation Summary

- `goal-42` was enhanced before publish to absorb the live-current website/docs
  gaps, required Product Design/Browser/Chrome execution checks, and the
  explicit no-real-0.4.0 boundary.
- `goal-43` was created as the short publish lane and then executed through
  final gates, publish, post-publish install validation, and tag closeout.

# Goal Closeout

- Goal condition result: satisfied for `mdkg@0.3.9` publish and installed
  package validation.
- Scoped nodes closed: `task-607`, `task-608`, `test-313`, `task-609`.
- Remaining deferred work: `goal-42` must update mdkg.dev structured metadata,
  live docs/release notes, Product Design audit evidence, Browser/Chrome
  verification, and 0.4.0 readiness up to but not including real 0.4.0 publish.

# Verification / Testing

## Command Evidence

- `git fetch origin main`: passed before publish.
- `git rev-list --left-right --count origin/main...HEAD`: `0 5` before push;
  `0 0` after `git push origin main`.
- `npm ci`: passed, 0 vulnerabilities.
- `npm run build`: passed.
- `npm run test`: passed, 528 tests, 0 failures.
- `npm run cli:check`: passed.
- `npm run cli:contract`: passed, contract hash
  `3c13c572c740f1e40db33fa5867fa227a8347df0750ef3beb0696d5931761a6c`.
- `npm run docs:check`: passed, 392 checked examples, 0 failures.
- `node scripts/assert-publish-ready.js`: passed.
- `node dist/cli.js validate --json`: passed with accepted legacy SPEC warning.
- `node dist/cli.js validate --changed-only --json`: passed clean.
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`:
  passed, 176 files, shasum
  `dfbb65267a87f963e05a90705e44f7ae029e9ffd`.
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run
  --registry=https://registry.npmjs.org/`: passed and ended `+ mdkg@0.3.9`.
- `npm publish --registry=https://registry.npmjs.org/
  --userconfig=/private/tmp/mdkg-npm-publish.npmrc`: passed and ended
  `+ mdkg@0.3.9`.
- `npm view mdkg version --registry=https://registry.npmjs.org/`: `0.3.9`.
- `npm view mdkg@0.3.9 version --registry=https://registry.npmjs.org/`:
  `0.3.9`.
- `npm view mdkg dist-tags --json --registry=https://registry.npmjs.org/`:
  `latest` is `0.3.9`.
- isolated install: `npm install -g mdkg@latest --prefix
  /private/tmp/mdkg-0.3.9-postpublish-CLC94F/prefix` passed.
- isolated binary:
  `/private/tmp/mdkg-0.3.9-postpublish-CLC94F/prefix/bin/mdkg --version`
  returned `0.3.9`.
- temp workspace probes under `/private/tmp/mdkg-0.3.9-postpublish-CLC94F`:
  `mdkg init --agent`, `mdkg index`, `mdkg status --json`,
  `mdkg validate --json`, `mdkg new manifest ... --json`, `mdkg skill sync
  --json`, and `mdkg upgrade --apply --json` passed.
- upgrade overlay receipt preserved `.mdkg/config.json` operator customization
  overlay and did not replace org standards, custom core docs, or configured
  skill mirror targets.
- custom mirror proof: `.agents/skills`, `.claude/skills`, `.codex/skills`, and
  `team/agent-skills` existed after published-package `mdkg skill sync --json`.

## Pass / Fail Status

- status: pass.

## Known Warnings

- accepted warning: `root:spec.mdkg-cli` remains a legacy `SPEC.md` compatibility
  warning and is deferred to the planned compatibility bridge closeout.
- note: initial temp-workspace `mdkg status --json` failed before `mdkg index`
  because generated caches were missing; after `mdkg index`, `status --json`
  was clean.

# Known Issues / Follow-ups

- `goal-42` must make mdkg.dev/docs.mdkg.dev live-current for 0.3.9 and prepare
  the 0.4.0 launch/readiness lane.
- Live website/docs gaps were not blockers for the `mdkg@0.3.9` npm package
  publish by explicit plan.

## Follow-up Refs

- `goal-42`
- `goal-43`
- `task-607`
- `task-608`
- `test-313`
- `task-609`

# Links / Artifacts

- commit: `072cf5193adf897fff5b5041bef90d0a8c2b0a68`
- tag: `v0.3.9`
- temp install: `/private/tmp/mdkg-0.3.9-postpublish-CLC94F`
- npm package: `mdkg@0.3.9`

# Raw Content Safety

- Evidence is summarized with command names, paths, hashes, and registry state.
  Raw npm token material, bulky terminal logs, and private execution traces are
  excluded.
