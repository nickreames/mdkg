---
id: chk-281
type: checkpoint
title: 0.3.8 pre-publish gate clean pending approval
checkpoint_kind: audit
status: backlog
priority: 9
tags: [release, publish, prepublish, 0-3-8]
owners: []
links: []
artifacts: [CHANGELOG.md, README.md, CLI_COMMAND_MATRIX.md, package.json, package-lock.json, scripts/assert-publish-ready.js, dist/command-contract.json]
relates: [task-589]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [goal-40]
created: 2026-06-26
updated: 2026-06-26
---
# Summary

The `mdkg@0.3.8` pre-publish gate passed without running any public side
effects. The package slot is still open on npm, the full local build/test/docs
gate passes, and `npm publish --dry-run` completed successfully as `+ mdkg@0.3.8`.

The release is not yet actually published. `task-589` remains the active
approval-boundary node because local `main` is still ahead of `origin/main` and
the real `git push`, `npm publish`, and any tag creation need explicit human
approval.

# Scope Covered

Keep `scope` frontmatter updated when possible.

## Changed Surfaces

- mdkg graph evidence only: `task-589` was started for the approval gate and
  this checkpoint records the dry-run receipt.
- `.mdkg/index/mdkg.sqlite` was regenerated after the checkpoint.
- No source, docs, package metadata, changelog, tag, push, or publish mutation
  was performed in this phase.

## Boundaries

- in scope: registry/remote freshness checks, local release gates, tarball
  dry-run, publish dry-run, mdkg validation, and approval-boundary evidence.
- out of scope: real npm publish, git push, git tag, changelog edits, source
  edits, package metadata edits, deploys, or downstream repo mutation.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded:
  yes.

# Decisions Captured

- Keep `mdkg@0.3.8` as the publish target.
- Preserve the release boundary: publish from a commit present on `origin/main`,
  or get explicit approval that includes pushing `main` first.
- Keep the post-publish validation lane deferred until npm latest actually
  resolves to `0.3.8`.

# Implementation Summary

No implementation changed. The release gate was exercised exactly far enough to
prove package readiness without public mutation, then the goal was paused at
the human approval boundary.

# Audit Findings

- Reviewed surfaces: git remote state, npm registry state, release metadata,
  generated command contract, docs, tests, package tarball payload, publish
  dry-run output, and mdkg graph validation.
- Findings: no functional publish blockers were found in source/package gates.
- Residual risk: `origin/main...HEAD` is `0 19`, so the local release commits
  are not yet on the remote. Real publish should wait until push approval and a
  fresh registry/remote re-check immediately before publish.

# Verification / Testing

## Command Evidence

- `git fetch origin main`: passed.
- `git rev-list --left-right --count origin/main...HEAD`: `0 19`.
- `npm view mdkg version --registry=https://registry.npmjs.org/`: `0.3.7`.
- `npm view mdkg@0.3.8 version --registry=https://registry.npmjs.org/`:
  expected npm `E404`; `0.3.8` is not published.
- `npm run build`: passed; command contract hash
  `145781176fcd00d6b7c7edd8e013e902acea2ace8764dbf0bb063a8d3913a3e1`.
- `npm run test`: passed; 521 tests passed, 0 failed.
- `npm run cli:check`: passed.
- `npm run cli:contract`: passed with contract hash
  `145781176fcd00d6b7c7edd8e013e902acea2ace8764dbf0bb063a8d3913a3e1`.
- `npm run docs:check`: passed.
- `node scripts/assert-publish-ready.js`: passed.
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`:
  passed; tarball `mdkg-0.3.8.tgz`, 174 files, shasum
  `0ace673026344fffea616ca793144d9a07f81382`, unpacked size about 1.8 MB.
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run
  --registry=https://registry.npmjs.org/`: passed; prepublish chain completed
  and npm dry-run ended with `+ mdkg@0.3.8`.
- `node dist/cli.js validate --json`: passed with the accepted legacy SPEC
  compatibility warning.
- `node dist/cli.js validate --changed-only --json`: passed with 0 warnings.
- `git diff --check`: passed.

## Pass / Fail Status

- status: pass for pre-publish readiness, pending explicit approval for public
  publish/push/tag actions.

## Known Warnings

- `root:spec.mdkg-cli` still reports the accepted
  `manifest.compat.spec_legacy` warning in full validation. This is intentional
  for the compatibility release.

# Known Issues / Follow-ups

- Real publish is blocked on explicit approval for public side effects.
- Before the real publish, re-run the registry and remote checks because npm and
  `origin/main` can change.
- After publish, run the isolated tmp global install validation from
  `goal-40`: `NPM_CONFIG_PREFIX=/private/tmp/mdkg-0.3.8-global npm install -g
  mdkg@latest --registry=https://registry.npmjs.org/`, then validate version,
  init, manifest capability discovery, upgrade SPEC-to-MANIFEST rename
  behavior, and graph health.

## Follow-up Refs

- `goal-40`
- `task-589`
- `task-591`
- `test-300`

# Links / Artifacts

- Local evidence checkpoint: `root:chk-281`.
- Tarball dry-run: `mdkg-0.3.8.tgz`,
  `sha512-A1g5+OXHtaQSVmF3m0xU+89dRy+u8FAwG7pzSUvzBiG5yekGzeNuUwHb3SIS1aPoJrUKoJSkEJXiekrMGwOMyQ==`.

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw secrets, raw prompts, raw payloads, or bulky execution traces.
