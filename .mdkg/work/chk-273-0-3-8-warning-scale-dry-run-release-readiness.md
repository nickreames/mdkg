---
id: chk-273
type: checkpoint
title: 0.3.8 warning-scale dry-run release readiness
checkpoint_kind: goal-closeout
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-436]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-436]
created: 2026-06-25
updated: 2026-06-25
---
# Summary

`goal-23` reached 0.3.8 dry-run release readiness. The warning-scale diagnostics work, remediation wording, safe multi-repo skill guidance, generated docs, and prepublish automation are implemented, validated, and packaged as `mdkg@0.3.8` through npm dry-run checks only.

# Scope Covered

Scope covered `task-436` and the final `goal-23.required_checks` closeout path.

## Changed Surfaces

- Release metadata was advanced to `0.3.8` in `package.json` and `package-lock.json`.
- `CHANGELOG.md` was dated as `0.3.8 - 2026-06-25`.
- Generated command docs were refreshed after the first `prepublishOnly` run caught stale docs:
  - `docs/_generated/cli-reference.md`
  - `docs/_generated/command-contract-summary.json`
- `task-436` was closed with this checkpoint after dry-run release evidence passed.

## Boundaries

- in scope: local build/test/smoke gates, generated docs refresh, npm pack dry-run, npm publish dry-run, and mdkg graph closeout evidence.
- out of scope: real npm publish, git tag, git push, global install, child-repo mutation, DNS, Vercel, and public launch actions.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded: yes. Evidence is summarized as command receipts and refs only.

# Decisions Captured

- The first `npm run prepublishOnly` run failed at `npm run docs:check` because generated docs still referenced the prior contract hash/package version.
- The fix was to run `npm run docs:generate`, producing a mechanical generated-doc update for the current `0.3.8` contract hash `98ef16eca953806c0636c4a2f05bffb8b9089935f711f81cf4bddfd93dcffc1a`.
- No functional source changes were required during closeout.

# Implementation Summary

The final closeout converted the completed warning-scale UX work into a dated 0.3.8 dry-run release candidate. The only additional gap found during this phase was generated docs drift, now covered by the release gate and refreshed docs artifacts.

# Goal Closeout

- Goal condition result: achieved for dry-run release readiness.
- Scoped nodes closed: `task-436` closed; prior scoped tasks/tests and `spike-12` were already done.
- Remaining deferred work: real npm publish, global install, post-publish validation, tag, push, and downstream upgrades remain explicit separate actions.

# Verification / Testing

## Command Evidence

- `npm run build`: passed for `mdkg@0.3.8`.
- `npm run test`: passed with 507 tests, 507 pass, 0 fail.
- `npm run cli:check`: passed; command matrix check ok.
- `npm run cli:contract`: passed; contract hash `98ef16eca953806c0636c4a2f05bffb8b9089935f711f81cf4bddfd93dcffc1a`.
- `node dist/cli.js validate --json`: passed with `warning_count: 0`, `error_count: 0`.
- `npm run smoke:warning-ux`: passed against warning-heavy temp repo fixtures.
- `npm run smoke:subgraph`: passed.
- `npm run smoke:handoff`: passed.
- `npm run docs:check`: passed after generated docs refresh.
- `npm run prepublishOnly`: passed after docs refresh, including the full build/test/CLI/DB/workflow/mdkg.dev/subgraph/package smoke chain.
- `node scripts/assert-publish-ready.js`: passed.
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`: passed; tarball `mdkg-0.3.8.tgz`, 163 files, package size about 327.6 kB.
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run`: passed; npm printed `+ mdkg@0.3.8`.
- `git diff --check`: passed.

## Pass / Fail Status

- status: pass.

## Known Warnings

- `git status` contains untracked manifest-rename planning nodes unrelated to `goal-23`; they were not folded into this closeout.
- Running smoke/demo graph checks regenerated timestamp-only example `.mdkg/index` files; treat these as generated cache churn unless separately accepted.

# Known Issues / Follow-ups

- Decide separately whether to publish `mdkg@0.3.8`.
- Decide separately whether to commit or discard unrelated manifest-rename planning nodes.
- Consider reducing generated timestamp churn in tracked example indexes in a future hygiene pass.

## Follow-up Refs

- `task-436`
- `goal-23`
- `spike-12`

# Links / Artifacts

- Generated docs: `docs/_generated/cli-reference.md`, `docs/_generated/command-contract-summary.json`.
- Dry-run package filename: `mdkg-0.3.8.tgz`.
- Command contract hash: `98ef16eca953806c0636c4a2f05bffb8b9089935f711f81cf4bddfd93dcffc1a`.

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw secrets, raw prompts, raw payloads, or bulky execution traces.
