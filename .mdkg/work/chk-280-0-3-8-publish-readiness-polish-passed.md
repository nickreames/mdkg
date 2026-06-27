---
id: chk-280
type: checkpoint
title: 0.3.8 publish readiness polish passed
checkpoint_kind: goal-closeout
status: backlog
priority: 9
tags: [release, polish, publish-readiness, 0-3-8]
owners: []
links: []
artifacts: [CHANGELOG.md, README.md, CLI_COMMAND_MATRIX.md, scripts/assert-publish-ready.js, scripts/check-doc-command-examples.js, scripts/cli_help_targets.js, scripts/smoke-command-docs.js, docs/_generated/cli-reference.md, docs/_generated/command-contract-summary.json, examples/demo-agentic-coding/.mdkg/templates/default/manifest.md, examples/template-mdkg-dev/.mdkg/templates/default/manifest.md]
relates: [goal-39, task-586, task-587, task-588, test-299, test-298]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [goal-39, task-586, task-587, task-588, test-299, test-298]
created: 2026-06-26
updated: 2026-06-26
---
# Summary

`goal-39` completed the 0.3.8 changelog and publish-readiness polish required
after audit `goal-38`. The `mdkg@0.3.8` source tree now has release notes,
public version references, manifest command docs checks, generated command
contract docs, and example graph templates aligned for the next publish dry-run.

# Scope Covered

Keep `scope` frontmatter updated when possible.

## Changed Surfaces

- `CHANGELOG.md` moves the MANIFEST/SPEC compatibility note into the
  `0.3.8` release section.
- `README.md` and `CLI_COMMAND_MATRIX.md` report source package version
  `0.3.8`.
- `scripts/assert-publish-ready.js` now checks README and command-matrix
  version parity and requires manifest command coverage in
  `dist/command-contract.json`.
- `scripts/check-doc-command-examples.js`, `scripts/cli_help_targets.js`, and
  `scripts/smoke-command-docs.js` now cover the `mdkg manifest ...` command
  family.
- Generated command docs were refreshed with contract hash
  `145781176fcd00d6b7c7edd8e013e902acea2ace8764dbf0bb063a8d3913a3e1` and 102
  commands.
- Both example mdkg graph templates now include `manifest.md` so demo graph
  validation does not fall back on a missing local type.

## Boundaries

- in scope: local source/docs/readiness polish, example graph template fix,
  generated docs/index refresh, and mdkg evidence for `goal-39`.
- out of scope: real npm publish, tag, push, deploy, downstream repo mutation,
  or a version bump beyond `0.3.8`.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded:
  yes.

# Decisions Captured

- Keep `mdkg@0.3.8` as the publish target.
- Preserve the intentional one-release legacy `SPEC.md` compatibility warning.
- Treat manifest command docs coverage and public version drift as
  publish-readiness assertions, not cosmetic checks.

# Implementation Summary

The release polish closed the audit blockers by moving publish-bound release
notes into the target changelog section, updating public version references,
making readiness checks assert those references, and teaching command docs
checks to recognize manifest commands. The final dry-run exposed a separate
example graph validation fallback for the new `manifest` local type; that was
fixed by adding `manifest.md` templates to both example mdkg graphs.

# Goal Closeout

- Goal condition result: achieved.
- Scoped nodes closed: `task-588`, `task-586`, `task-587`, `test-299`, and
  `test-298`.
- Remaining deferred work: none for this polish goal.

# Verification / Testing

## Command Evidence

- `npm run build`: passed; command contract hash
  `145781176fcd00d6b7c7edd8e013e902acea2ace8764dbf0bb063a8d3913a3e1`.
- `npm run test`: passed; 518 tests passed, 0 failed.
- `npm run cli:check`: passed.
- `npm run cli:contract`: passed.
- `npm run docs:check`: passed.
- `npm run docs:check-commands`: passed; 392 examples checked, 0 failures.
- `node dist/cli.js manifest list --json`: passed.
- `node dist/cli.js manifest show spec.mdkg-cli --json`: passed.
- `node dist/cli.js manifest validate spec.mdkg-cli --json`: passed with the
  accepted legacy SPEC compatibility warning.
- `node scripts/assert-publish-ready.js`: passed.
- Mocked README version drift check: failed as expected with
  `publish readiness failed: README.md current package version does not match
  package.json 0.3.8`.
- `npm run smoke:command-docs`: passed.
- `npm run smoke:mdkg-dev-docs`: passed.
- `node dist/cli.js validate --root examples/demo-agentic-coding --json`:
  passed with 0 warnings.
- `node dist/cli.js validate --root examples/template-mdkg-dev --json`:
  passed with 0 warnings.
- `npm run smoke:demo-graph`: passed.
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`:
  passed; tarball `mdkg-0.3.8.tgz`, 174 entries, shasum
  `e30916bd92fe99e4403902b8fcf6e27466d921a2`.
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run
  --registry=https://registry.npmjs.org/`: passed and ended with dry-run output
  for `+ mdkg@0.3.8`.
- `npm view mdkg version --registry=https://registry.npmjs.org/`: returned
  `0.3.7`.
- `npm view mdkg@0.3.8 version --registry=https://registry.npmjs.org/`:
  returned the expected E404 because `0.3.8` is not published.
- `node dist/cli.js validate --json`: passed.
- `node dist/cli.js validate --changed-only --json`: passed.
- `git diff --check`: passed.

## Pass / Fail Status

- status: pass.

## Known Warnings

- `root:spec.mdkg-cli` still reports the accepted legacy
  `manifest.compat.spec_legacy` warning when validating all graph files.

# Known Issues / Follow-ups

- No known release-readiness issues remain for `goal-39`.

## Follow-up Refs

- task/test/goal refs: none.

# Links / Artifacts

- Local graph evidence: this checkpoint and scoped `goal-39` nodes.
- Commit: pending at checkpoint creation time.

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw secrets, raw prompts, raw payloads, or bulky execution traces.
